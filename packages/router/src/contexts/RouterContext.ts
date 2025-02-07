import { createContext } from "react";

export const RouterContext = createContext<{
  currentPath: string;
  rootPath: string;
}>({ currentPath: "", rootPath: "" });
