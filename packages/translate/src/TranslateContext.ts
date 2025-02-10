import { createContext } from "react";
import { Translate } from "./Translate";

const translate = new Translate({ languages: {}, currentLanguage: "" });

export const TranslateContext = createContext<Translate>(translate);
