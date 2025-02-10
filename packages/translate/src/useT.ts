import { Translate, TranslateFunction } from "./Translate";
import { TranslateContext } from "./TranslateContext";
import { useContext } from "react";

/** useT
 *  Returns a tuple with the Translate instance's t()-function and the current language.
 *
 * @returns [TranslateFunction t, string, (langCode: string) => void]
 */
export function useT(): [
  TranslateFunction,
  string,
  (langCode: string) => void
] {
  const translateInstance = useContext(TranslateContext);
  return [
    translateInstance.t,
    translateInstance.getLanguage(),
    translateInstance.setLanguage,
  ];
}
