/**
 * OptionItem is a generic type for displaying options in a Select/Type-ahead style component
 */
export interface OptionItem<Type = string> {
  value: Type;
  label: string;
  alt?: string;
}

/** isOptionItem
 *
 * Check if val<any> is a valid OptionItem.
 * Not exhaustive, will accept objects that extends/can be used as OptionItems.
 *
 * @param val {any}
 * @returns boolean
 */
export const isOptionItem = (val: unknown): val is OptionItem => {
  if (typeof val === "object") {
    const valOptItem = val as OptionItem;

    return (
      Object.hasOwn(valOptItem, "value") && Object.hasOwn(valOptItem, "label")
    );
  } else {
    return false;
  }
};
