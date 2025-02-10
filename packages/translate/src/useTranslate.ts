import { TranslateContext } from "./TranslateContext";
import { Translate } from "./Translate";
import { useContext } from "react";

export function useTranslate(): Translate {
  const translateInstance = useContext(TranslateContext);
  return translateInstance;
}
