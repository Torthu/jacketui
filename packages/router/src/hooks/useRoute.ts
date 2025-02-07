import { useContext } from "react";
import { RouteContext } from "../contexts/RouteContext";

export const useRoute = () => useContext(RouteContext);
