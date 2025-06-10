import { Reducer } from "../types/Reducer";

/** combineReducers
 *
 * Combines multiple reducers into a single reducer.
 *
 * @example // Typical Usage
 *   const reducer1: Reducer<State, Action> = (state, action) => { ... }
 *   const reducer2: Reducer<State, Action> = (state, action) => { ... }
 *   const combinedReducer = combineReducers([reducer1, reducer2]);
 *
 *   // Now you can use combinedReducer as a single reducer
 *   const store = new Store({ initialState, actionHandlers: [ combinedReducer ] });
 *
 * @example // React
 *   const [state, dispatch] = useStore([combineReducers(reducer1, reducer2), someEffect], initialState);
 *
 */
export const combineReducers =
  <S, A>(reducers: Array<Reducer<S, A>>): Reducer<S, A> =>
  (state: S, action: A) =>
    reducers.reduce((state, fn) => fn(state, action), state);
