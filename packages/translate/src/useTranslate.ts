import { TranslateContext } from "./TranslateContext";
import { Translate } from "./Translate";
import { useContext } from "react";

/** useTranslate()
 *  Returns the Translate instance.
 *  Use this to e.g register languages.
 *
 * @example register a language
 *   const translate = useTranslate();
 *   translate.registerLanguage("en", {one: "one", two: "two"});
 *
 * @example set the current language
 *   const translate = useTranslate();
 *   translate.setLanguage("fr")
 *
 * @returns {Translate}
 */
export function useTranslate(): Translate {
  const translateInstance = useContext(TranslateContext);
  return translateInstance;
}
