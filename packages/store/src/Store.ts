import { referenceComparison } from "./comparison/referenceComparison";

interface StateChangedCallback<State> {
  (getState: () => State): void;
}

interface StateAboutToChangeCallback<State, Action = DefaultAction> {
  (newState: State, action: Action): void;
}

interface DefaultAction {
  type: string;
  [key: string]: any;
}

export interface UpdateFunction<Action = DefaultAction> {
  (action: Action): void;
}

export interface HashingFunction<State> {
  (input: State): string;
}

function isAsyncActionHandler(
  actionHandler: ActionHandler<any, any>
): actionHandler is AsyncActionHandler<any, any> {
  return actionHandler.length >= 3;
}

function isSyncActionHandler(
  actionHandler: ActionHandler<any, any>
): actionHandler is SyncActionHandler<any, any> {
  return actionHandler.length === 2;
}

interface AsyncActionHandler<State, Action> {
  (
    getState: () => State,
    action: Action,
    commit: (newState: State, cloneDeep?: boolean) => void,
    dispatch?: (action: Action) => void
  ): void;
}

interface SyncActionHandler<State, Action> {
  (state: State, action: Action): State;
}

export type ActionHandler<State, Action> =
  | SyncActionHandler<State, Action>
  | AsyncActionHandler<State, Action>;

interface ModelConstructorProps<State, Action> {
  initialState: State;
  actionHandlers: ActionHandler<State, Action>[];
  compareFunction?: (oldState: State, newState: State) => boolean;
  onStateChanged?: StateChangedCallback<State>;
}

/**
 * The model contains the current state plus action handlers to update said state
 */
export class Store<State, Action> {
  private actionHandlers: ActionHandler<State, Action>[];
  private state: State;
  private stateChangedCallbacks: StateChangedCallback<State>[];
  private preStateChangedCallbacks: StateAboutToChangeCallback<State, Action>[];
  private compareFunction: (oldState: State, newState: State) => boolean;

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

  /**
   * TODO: Is this useful, or is it easy enough to implement an actionHandler manually?
   * Path the state with a state partial object
   * @param newState Partial<State>
   */
  public patch(newState: Partial<State>) {
    this.setState(Object.assign({}, this.getState(), newState));
  }

  /** onPreDataChanged
   *  Listen to and manipulate actions before they are applied
   *  Triggered before the internal state changes
   *
   *  @param callback StateAboutToChangeCallback<State>
   *
   */
  public onPreDataChanged(
    callback: StateAboutToChangeCallback<State, Action>
  ): StateAboutToChangeCallback<State, Action> {
    this.preStateChangedCallbacks.push(callback);
    return callback;
  }

  public offPreDataChanged(
    callback: StateAboutToChangeCallback<State, Action>
  ): void {
    const index = this.preStateChangedCallbacks.indexOf(callback);

    if (index >= 0) {
      this.preStateChangedCallbacks.splice(index, 1);
    }
  }

  /**
   * Add a data changed listener
   * Triggered when the internal state changes
   * @param callback StateChangedCallback<State>
   */
  public onDataChanged(
    callback: StateChangedCallback<State>
  ): StateChangedCallback<State> {
    this.stateChangedCallbacks.push(callback);
    return callback;
  }

  /**
   * Remove a data changed listener
   * @param callback StateChangedCallback<State>
   */
  public offDataChanged(callback: StateChangedCallback<State>): void {
    const index = this.stateChangedCallbacks.indexOf(callback);

    if (index >= 0) {
      this.stateChangedCallbacks.splice(index, 1);
    }
  }

  /**
   * Gets the current state. getState is passed to action handlers.
   * @returns the current state
   */
  public getState(): State {
    return this.state;
  }

  /**
   * Calculates a new data hash using the hashingFunction, then sets new state and triggers onStateChanged if the hash does not match the previous data hash.
   * setState is passed as the commit callback to action handlers.
   *
   * @param newState - the new state to set
   * @param [boolean=false] cloneDeep - whether to clone the new state before setting it
   *
   * @returns the new state
   *
   * @example
   *   store.setState({...state, a: "new value"});
   */
  public setState(newState: State, cloneDeep: boolean = false): State {
    if (this.isNewState(newState)) {
      this.state = cloneDeep ? Store.cloneDeep(newState) : newState;
      this.stateChangedCallbacks.forEach((callback) => callback(this.getState));
    }

    return this.state;
  }

  /**
   * The update function takes an action, and loops through all the action handlers
   * Action handlers are called with getState, the passed action and setState
   * @param action
   */
  public dispatch(action: Action): void {
    this.actionHandlers.forEach(
      (actionHandler: ActionHandler<State, Action>) => {
        if (isAsyncActionHandler(actionHandler)) {
          // TODO: Do we want this feature?
          const commit = (newState: State, cloneDeep?: boolean) => {
            this.preStateChangedCallbacks.forEach((callback) =>
              callback(newState, action)
            );
            this.setState(newState, cloneDeep);
          };
          actionHandler(this.getState, action, commit, this.dispatch);
        } else if (isSyncActionHandler(actionHandler)) {
          const newState = actionHandler(this.getState(), action);
          this.preStateChangedCallbacks.forEach((callback) =>
            callback(newState, action)
          );
          this.setState(newState);
        }
      }
    );
  }

  /**
   * Alias for dispatch for backwards compatibility
   * @deprecated
   */
  public update = this.dispatch;

  /**
   * Check if the passed "newState" is different from old state
   * @param newState
   * @returns boolean
   */
  private isNewState(newState: State) {
    const oldState = this.getState();
    return this.compareFunction(oldState, newState);
  }

  constructor(props: ModelConstructorProps<State, Action>) {
    this.stateChangedCallbacks = [];
    if (props.onStateChanged) {
      this.stateChangedCallbacks.push(props.onStateChanged);
    }
    this.preStateChangedCallbacks = [];
    this.compareFunction = props.compareFunction || referenceComparison;
    this.actionHandlers = props.actionHandlers;

    // Bind Scope
    this.setState = this.setState.bind(this);
    this.getState = this.getState.bind(this);
    this.dispatch = this.dispatch.bind(this);
    this.update = this.dispatch.bind(this);

    // Set Initial State
    this.state = props.initialState;
  }
}
