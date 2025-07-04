import {
  Broadcast,
  BroadcastCallbackFunction,
} from "@torthu/jacketui-broadcast";
import { referenceComparison } from "./comparison/referenceComparison";
import { isAsyncReducer, isEffect, isReducer } from "./guards";
import { ActionHandler } from "./types/ActionHandler";
import { BasicAction } from "./types/BasicAction";
import { StoreBroadcastAction } from "./types/StoreBroadcastAction";
import { Selector } from "./types/Selector";
import { Slice } from "./Slice";
import { SliceSelector } from "./types";

interface StateChangedCallback<State> {
  (getState: () => State): void;
}

interface StateAboutToChangeCallback<State, Action> {
  (newState: State, action: Action): void;
}

interface StoreConstructorProps<
  State extends object,
  Action extends BasicAction
> {
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

  /** createSelector
   *
   * Create a selector function for the store.
   * A selector function is a function that takes the state and returns some kind of subset or parsed "View" of the state.
   *
   * The selector function is called with the current state and the filters passed to the selector function.
   *
   *
   * @param selector {@link Selector}<State, Filters, View> - The selector function.
   * @return (...filters: Filters) => View
   *
   * @example
   *   const store = new Store<State, Action>({ initialState, actionHandlers });
   *   const someStoreView = store.createSelector((state, filter: string) => state.filter(filter));
   *   console currentView = someStoreView("someFilter");
   */
  public createSelector<Filters extends unknown[], View>(
    selector: Selector<State, Filters, View>
  ): (...filters: Filters) => View {
    return (...filters) => selector(this.getState(), ...filters);
  }

  /** createSlice
   *
   * A Slice is a self-updating View of the store, based on a selector function.
   *
   * A View is some value based on the state. It can be e.g. the state itself, a subset, or some kind of parsed value.
   *
   * @param selector {@link SliceSelector}
   * @param onUpdate (newViewState: View) => void
   * @returns {@link Slice}<State, Action, View>
   *
   * @example
   *   const store = new Store<State, Action>({ initialState, actionHandlers });
   *   const slice = store.createSlice((state) => state.someProp, (newViewState) => console.log(newViewState));
   */
  public createSlice<View>(
    selector: SliceSelector<State, View>,
    onUpdate: (newViewState: View) => void
  ): Slice<State, Action, View> {
    return new Slice(this, selector, onUpdate);
  }

  private _state: State;
  private _broadcast: Broadcast<StoreBroadcastAction<State, Action>>;

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
   * @param newState Partial<State>
   * @return {State} the new state
   *
   * @example
   *   store.patch({ a: "new value" });
   */
  public patch(newState: Partial<State>) {
    return this.setState(Object.assign({}, this.getState(), newState));
  }

  public on(
    action: StoreBroadcastAction<State, Action>["type"],
    callback: BroadcastCallbackFunction<StoreBroadcastAction<State, Action>>
  ) {
    return this._broadcast.on(action, callback);
  }

  public off(
    action: StoreBroadcastAction<State, Action>["type"],
    callback: BroadcastCallbackFunction<StoreBroadcastAction<State, Action>>
  ) {
    return this._broadcast.off(action, callback);
  }

  /** onPreDataChanged(callback)
   *  Listen to and manipulate actions before they are applied
   *  Triggered before the internal state changes
   *
   * @param {StateAboutToChangeCallback<State>} callback
   * @return {StateAboutToChangeCallback<State>}
   *
   * @example
   *   const listener = store.onPreDataChanged(console.log); // logs the new state and action
   *   store.offPreDataChanged(listener); // no more logging
   */
  public onPreDataChanged(callback: StateAboutToChangeCallback<State, Action>) {
    return this._broadcast.on("preStateChange", (e) => {
      if (e.action.type === "preStateChange") {
        callback(e.action.payload.toState, e.action.payload.action);
      }
    });
  }

  /** offPreDataChanged(callback)
   *  Remove a pre data changed listener
   *
   * @param {StateAboutToChangeCallback<State>} callback
   *
   * @example
   *   const listener = store.onPreDataChanged(console.log); // logs the new state and action
   *   store.offPreDataChanged(listener); // no more logging
   */
  public offPreDataChanged(callback: BroadcastCallbackFunction<any>): void {
    this._broadcast.off("preStateChange", callback);
  }

  /** onDataChanged(callback)
   *  Triggered when the state changes.
   *
   * @param {StateChangedCallback<State>} callback
   * @return {BroadcastCallbackFunction<State>} listener, can be used to remove the listener
   *
   * @example
   *   const listener = store.onDataChanged(console.log); // logs the new state
   *   store.offDataChanged(listener); // no more logging
   */
  public onDataChanged(callback: StateChangedCallback<State>) {
    return this._broadcast.on("stateChanged", (e) => {
      if (e.action.type === "stateChanged") {
        callback(this.getState);
      }
    });
  }

  /** offDataChanged(callback)
   *
   * Remove a data changed listener
   *
   * @param callback StateChangedCallback<State>
   *
   * @example
   *   const listener = store.onDataChanged(console.log); // logs the new state
   *   store.offDataChanged(listener); // no more logging
   */
  public offDataChanged(callback: BroadcastCallbackFunction<any>): void {
    this._broadcast.off("stateChanged", callback);
  }

  /** getState()
   *
   * Gets the current state. getState is passed to action handlers.
   *
   * @returns {State} the current state
   */
  public getState(): State {
    return this._state;
  }

  /** setState(newState)
   *
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
      this._broadcast.emit({
        type: "stateChanged",
        payload: { state: this._state },
      });
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
    this._broadcast.emit({
      type: "dispatch",
      payload: { state: this.getState(), action },
    });

    this._actionHandlers.forEach(
      (actionHandler: ActionHandler<State, Action>) => {
        if (isEffect(actionHandler)) {
          actionHandler({
            getState: this.getState,
            action,
            setState: (newState: State, cloneDeep?: boolean) => {
              this._broadcast.emit({
                type: "preStateChange",
                payload: {
                  fromState: this.getState(),
                  toState: newState,
                  action,
                },
              });
              this.setState(newState, cloneDeep);
            },
            dispatch: this.dispatch,
            on: this.on,
            off: this.off,
          });
        } else if (isAsyncReducer(actionHandler)) {
          const commit = (newState: State, cloneDeep?: boolean) => {
            this._broadcast.emit({
              type: "preStateChange",
              payload: {
                fromState: this.getState(),
                toState: newState,
                action,
              },
            });
            this.setState(newState, cloneDeep);
          };
          actionHandler(this.getState, action, commit);
        } else if (isReducer(actionHandler)) {
          const newState = actionHandler(this.getState(), action);
          this._broadcast.emit({
            type: "preStateChange",
            payload: { fromState: this.getState(), toState: newState, action },
          });
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
    this._broadcast = new Broadcast<StoreBroadcastAction<State, Action>>();

    if (props.onStateChanged) {
      this.onDataChanged(props.onStateChanged);
    }

    this._compareFunction = props.compareFunction || referenceComparison;

    this._actionHandlers = props.actionHandlers;

    // Set Initial State
    this._state = props.initialState;

    // Bind Scope
    this.setState = this.setState.bind(this);
    this.getState = this.getState.bind(this);
    this.dispatch = this.dispatch.bind(this);
    this.on = this.on.bind(this);
    this.off = this.off.bind(this);
  }
}
