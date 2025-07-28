import { referenceComparison } from "./comparison";
import { Store } from "./Store";
import { BasicAction, SliceSelector } from "./types";

/** Slice
 *
 * A slice is a view of the store. It is a subset of the store's state.
 *
 * @param store {@link Store}<State, Action>
 * @param selector {@link SliceSelector}<State>
 * @param onUpdate {(newView: View) => void} - Callback that triggers when the view has changed
 * @param compareFunction {(a: View, b: View) => boolean} - Function to compare old and new state. Default is {@link referenceComparison}. Return true if state has changed.
 * @return {@link Slice}<State, Action, View>
 */
export class Slice<State extends object, Action extends BasicAction, View> {
  private _storeRef: Store<State, Action>;

  // Selector function to get state view
  private _selector: SliceSelector<State, View>;

  // Cache to detect if state has changed
  private _view: View;

  // Callback to update UI when state changes
  private _onUpdate?: (newViewState: View) => void;

  // Compare function to detect if state has changed true = changed
  private _compareFunction: (a: View, b: View) => boolean;

  // Getter to get the current state view
  get state() {
    return this._selector(this._storeRef.getState());
  }

  // Callback to update the state view when the store state changes
  private _onDataChanged = () => {
    const newView = this._selector(this._storeRef.getState());

    if (this._compareFunction(this._view, newView)) {
      this._view = newView;
      this._onUpdate?.(newView);
    }
  };

  // Destroy the slice and remove the callback from the store
  public destroy() {
    this._storeRef.offDataChanged(this._onDataChanged);
  }

  constructor(
    store: Store<State, Action>,
    selector: SliceSelector<State, View>,
    onUpdate: (newViewState: View) => void,
    compareFunction: (a: View, b: View) => boolean = referenceComparison<View>
  ) {
    this._storeRef = store;
    this._selector = selector;
    this._view = selector(store.getState());
    this._onUpdate = onUpdate;
    this._compareFunction = compareFunction;
    this._storeRef.onDataChanged(this._onDataChanged);
  }
}
