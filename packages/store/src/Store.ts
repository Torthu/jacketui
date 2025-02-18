import { referenceComparison } from "./comparison/referenceComparison";
import { isAsyncActionHandler, isSyncActionHandler } from "./guards";
import { ActionHandler } from "./types/ActionHandler";
import { BasicAction } from "./types/BasicAction";

interface StateChangedCallback<State> {
  (getState: () => State): void;
}

interface StateAboutToChangeCallback<State, Action> {
  (newState: State, action: Action): void;
}

interface StoreConstructorProps<State, Action> {
  initialState: State;
  actionHandlers: ActionHandler<State, Action>[];
  compareFunction?: (oldState: State, newState: State) => boolean;
  onStateChanged?: StateChangedCallback<State>;
}

/** Store
 *  A simple store for managing state.
 */
export class Store<State extends object, Action extends BasicAction> {
  private _actionHandlers: ActionHandler<State, Action>[];
  private _state: State;
  private _stateChangedCallbacks: StateChangedCallback<State>[];
  private _preStateChangedCallbacks: StateAboutToChangeCallback<
    State,
    Action
  >[];
  private _compareFunction: (oldState: State, newState: State) => boolean;

  /** cloneDeep
   *  Utility for cloning a structure.
   *  Useful for cloning the store state before updating it.
   *
   *  Deep Clone a structure (Object/Array) recursively.
   *  Will not clone Function or RegExp or Date.
   *
   *  @example
   *    const actionHandler = (state, action) => {
   *      const newState = Store.cloneDeep(state);
   *      newState.a = "new value";
   *      return newState;
   *    }
   *
   *  @param structure
   *  @returns structure
   */
  public static cloneDeep<T = any>(structure: T): T {
    return structuredClone(structure);
  }

  /** clonePath
   *  Clone a specific path of a structure.
   *  Useful for cloning a specific part of the store state before updating it,
   *  ensuring React picks up the change.
   *
   *  Note: Will not clone Function or RegExp or Date
   *
   *  @example
   *    // With some state: {a: {b: "old value"}, some: "other values", that: "should not be touched"}
   *    const actionHandler = (state, action) => {
   *      const newState = Store.clonePath(state, ["a", "b"]); // state, state.a and state.a.b will be new references
   *      newState.a.b = "new value";
   *      return newState;
   *    }
   *
   *  @example clonePath({a: [0], b: {c: [0]}}, ["b", "c"])
   *  @param structure
   *  @param path
   *  @returns structure
   */
  public static clonePath<T = any>(
    structure: T,
    path: Array<string | number>
  ): T {
    const next = path.shift();

    if (Array.isArray(structure)) {
      const cloned = [...structure];
      if (typeof next === "number") {
        cloned[next] = Store.clonePath(structure[next], path);
      }
      return cloned as unknown as T;
    } else if (typeof structure === "object") {
      const cloned: any = { ...structure };

      if (next) {
        cloned[next] = Store.clonePath(
          (structure as unknown as any)[next],
          path
        );
      }
      return cloned as unknown as T;
    } else {
      return structure;
    }
  }

  /** patch(newPartialState: Partial<State>)
   *  Merges newPartialState with the current state into a new object.
   *
   * @TODO Is this useful, or is it easy enough to implement an actionHandler manually?
   * Path the state with a state partial object
   *
   * @param newState Partial<State>
   * @return {State} the new state
   *
   * @example
   *   store.patch({ a: "new value" });
   */
  public patch(newState: Partial<State>) {
    return this.setState(Object.assign({}, this.getState(), newState));
  }

  /** onPreDataChanged(callback)
   *  Listen to and manipulate actions before they are applied
   *  Triggered before the internal state changes
   *
   * @param {StateAboutToChangeCallback<State>} callback
   * @return {StateAboutToChangeCallback<State>}
   */
  public onPreDataChanged(
    callback: StateAboutToChangeCallback<State, Action>
  ): StateAboutToChangeCallback<State, Action> {
    this._preStateChangedCallbacks.push(callback);
    return callback;
  }

  /** offPreDataChanged(callback)
   *  Remove a pre data changed listener
   *
   * @param {StateAboutToChangeCallback<State>} callback
   */
  public offPreDataChanged(
    callback: StateAboutToChangeCallback<State, Action>
  ): void {
    const index = this._preStateChangedCallbacks.indexOf(callback);

    if (index >= 0) {
      this._preStateChangedCallbacks.splice(index, 1);
    }
  }

  /** onDataChanged(callback)
   *  Triggered when the state changes.
   *
   * @param {StateChangedCallback<State>} callback
   * @return {StateChangedCallback<State>}
   */
  public onDataChanged(
    callback: StateChangedCallback<State>
  ): StateChangedCallback<State> {
    this._stateChangedCallbacks.push(callback);
    return callback;
  }

  /** offDataChanged(callback)
   *  Remove a data changed listener
   *
   * @param callback StateChangedCallback<State>
   */
  public offDataChanged(callback: StateChangedCallback<State>): void {
    const index = this._stateChangedCallbacks.indexOf(callback);

    if (index >= 0) {
      this._stateChangedCallbacks.splice(index, 1);
    }
  }

  /** getState()
   * Gets the current state. getState is passed to action handlers.
   * @returns {State} the current state
   */
  public getState(): State {
    return this._state;
  }

  /** setState(newState)
   *  Sets the state if it is different from the current state and triggers onStateChanged.
   *  setState is passed as the commit callback to async action handlers.
   *
   * @param {State} newState - the new state to set
   * @param {boolean} cloneDeep - whether to clone the new state before setting it
   *
   * @returns {State} the new state
   *
   * @example
   *   store.setState({...state, a: "new value"});
   */
  public setState(newState: State, cloneDeep: boolean = false): State {
    if (this._isNewState(newState)) {
      this._state = cloneDeep ? Store.cloneDeep(newState) : newState;
      this._stateChangedCallbacks.forEach((callback) =>
        callback(this.getState)
      );
    }

    return this._state;
  }

  /** dispatch(Action)
   *  The primary method for updating the store state.
   *  Dispatch an action to the store. The action will be passed to all action handlers.
   *
   * @param {Action} action
   * @example
   *   store.dispatch({ type: "TEST", payload: "new value" });
   */
  public dispatch(action: Action): void {
    this._actionHandlers.forEach(
      (actionHandler: ActionHandler<State, Action>) => {
        if (isAsyncActionHandler(actionHandler)) {
          const commit = (newState: State, cloneDeep?: boolean) => {
            this._preStateChangedCallbacks.forEach((callback) =>
              callback(newState, action)
            );
            this.setState(newState, cloneDeep);
          };
          actionHandler(this.getState, action, commit, this.dispatch);
        } else if (isSyncActionHandler(actionHandler)) {
          const newState = actionHandler(this.getState(), action);
          this._preStateChangedCallbacks.forEach((callback) =>
            callback(newState, action)
          );
          this.setState(newState);
        }
      }
    );
  }

  /**
   * Check if the passed "newState" is different from old state
   * @param newState
   * @returns boolean
   * @private
   */
  private _isNewState(newState: State) {
    const oldState = this.getState();
    return this._compareFunction(oldState, newState);
  }

  constructor(props: StoreConstructorProps<State, Action>) {
    this._stateChangedCallbacks = [];
    if (props.onStateChanged) {
      this._stateChangedCallbacks.push(props.onStateChanged);
    }
    this._preStateChangedCallbacks = [];
    this._compareFunction = props.compareFunction || referenceComparison;
    this._actionHandlers = props.actionHandlers;

    // Bind Scope
    this.setState = this.setState.bind(this);
    this.getState = this.getState.bind(this);
    this.dispatch = this.dispatch.bind(this);

    // Set Initial State
    this._state = props.initialState;
  }
}
