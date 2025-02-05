import { useContext } from "react";
import { CurrentRouteContext } from "../contexts";

export const useRoute = () => useContext(CurrentRouteContext);
