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
  return actionHandler.length === 3;
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
    commit: (newState: State, cloneDeep?: boolean) => void
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
  hashingFunction: HashingFunction<State>;
  onStateChanged?: StateChangedCallback<State>;
}

/**
 * The model contains the current state plus action handlers to update said state
 */
export default class Model<State, Action> {
  private dataHash = "";
  private actionHandlers: ActionHandler<State, Action>[];
  private state: State;
  private stateChangedCallbacks: StateChangedCallback<State>[];
  private preStateChangedCallbacks: StateAboutToChangeCallback<State, Action>[];
  private hashingFunction: HashingFunction<State>;

  /**
   * TODO: Check out new JS strutured clone
   * Deep Clone a structure (Object/Array) recursively
   * Will not clone Function or RegExp or Date
   * @param structure
   * @returns structure
   */
  public static cloneDeep<T = any>(structure: T): T {
    return structuredClone(structure);
    // const clonedStructure: any = Array.isArray(structure) ? [] : {};

    // if (
    //   typeof structure === "function" ||
    //   structure instanceof RegExp ||
    //   structure instanceof Date
    // ) {
    //   return structure;
    // }

    // for (let key in structure) {
    //   const value = structure[key];

    //   if (Array.isArray(value) || typeof value === "object") {
    //     clonedStructure[key] = Model.cloneDeep(value);
    //   } else {
    //     clonedStructure[key] = value;
    //   }
    // }

    // return clonedStructure as T;
  }

  /**
   * Clone a specific path of a structure
   * Will not clone Function or RegExp or Date
   * @example clonePath({a: [0], b: {c: [0]}}, ["b", "c"])
   * @param structure
   * @param path
   * @returns
   */
  public static clonePath<T = any>(
    structure: T,
    path: Array<string | number>
  ): T {
    const next = path.shift();

    if (Array.isArray(structure)) {
      const cloned = [...structure];
      if (typeof next === "number") {
        cloned[next] = Model.clonePath(structure[next], path);
      }
      return cloned as unknown as T;
    } else if (typeof structure === "object") {
      const cloned: any = { ...structure };

      if (next) {
        cloned[next] = Model.clonePath(
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

  /**
   * TODO: Useful for enabling plugins, dev tools, etc
   * Listen to and manipulate actions before they are applied
   * Triggered before the internal state changes
   * @param callback StateAboutToChangeCallback<State>
   */
  public onPreDataChanged(
    callback: StateAboutToChangeCallback<State, Action>
  ): StateAboutToChangeCallback<State, Action> {
    this.preStateChangedCallbacks.push(callback);
    return callback;
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
   * @param newState
   */
  public setState(newState: State, cloneDeep: boolean = false): State {
    if (this.isNewState(newState)) {
      this.state = cloneDeep ? Model.cloneDeep(newState) : newState;
      this.stateChangedCallbacks.forEach((callback) => callback(this.getState));
    }

    return this.state;
  }

  /**
   * The update function takes an action, and loops through all the action handlers
   * Action handlers are called with getState, the passed action and setState
   * @param action
   */
  public update(action: Action): void {
    this.actionHandlers.forEach(
      (actionHandler: ActionHandler<State, Action>) => {
        if (isAsyncActionHandler(actionHandler)) {
          // TODO: Do we want this feature?
          this.preStateChangedCallbacks.forEach((callback) =>
            callback(this.getState(), action)
          );

          actionHandler(this.getState, action, this.setState);
        } else if (isSyncActionHandler(actionHandler)) {
          this.setState(actionHandler(this.getState(), action));
        }
      }
    );
  }

  /**
   * Check if the passed "newState" is different from old state
   * TODO: Maybe change to reference check if hash is too slow/not useful
   * @param newState
   * @returns
   */
  private isNewState(newState: State) {
    const newDataHash = this.hashingFunction(newState);
    const oldDataHash = this.getDataHash();

    if (oldDataHash !== newDataHash) {
      this.dataHash = newDataHash;
      return true;
    } else {
      return false;
    }
  }

  /**
   * Get the current data hash
   * @returns the current data hash
   */
  private getDataHash(): string {
    return this.dataHash;
  }

  constructor(props: ModelConstructorProps<State, Action>) {
    this.stateChangedCallbacks = [];
    if (props.onStateChanged) {
      this.stateChangedCallbacks.push(props.onStateChanged);
    }
    this.preStateChangedCallbacks = [];
    this.hashingFunction = props.hashingFunction;
    this.actionHandlers = props.actionHandlers;

    // Bind Scope
    this.setState = this.setState.bind(this);
    this.getState = this.getState.bind(this);
    this.update = this.update.bind(this);

    // Set Initial State
    this.state = props.initialState; // to make compiler happy
    this.setState(props.initialState);
  }
}
