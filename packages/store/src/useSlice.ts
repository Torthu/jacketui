import { useEffect, useRef, useState } from "react";
import { BasicAction, SliceSelector } from "./types";
import { Store } from "./Store";
import { Slice } from "./Slice";

/** **useSlice**(store, selector)
 *
 * Hook for using a Slice.
 *
 * A {@link Slice} returns and updates a View using a selector function.
 *
 * @param store {@link Store} instance
 * @param selector {@link SliceSelector} function for selecting the view from the state
 * @returns View
 */
export function useSlice<
  State extends object,
  Action extends BasicAction,
  View
>(
  store: Store<State, Action>,
  selector: SliceSelector<State, View>,
  compareFunction?: (a: View, b: View) => boolean
): View {
  const [view, setView] = useState(() => selector(store.getState()));
  const sliceRef = useRef<Slice<State, Action, View> | null>(null);

  useEffect(() => {
    // Create the slice and set the update callback
    const slice = store.createSlice(selector, setView, compareFunction);
    sliceRef.current = slice;

    // Clean up on unmount
    return () => slice.destroy();
  }, []);

  return view;
}
