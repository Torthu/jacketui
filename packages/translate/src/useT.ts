import { TranslateContext } from "./TranslateContext";
import { useContext } from "react";

export function useT(): [(id: string) => string, string] {
  const translateInstance = useContext(TranslateContext);
  return [translateInstance.t, translateInstance.getLanguage()];
}
