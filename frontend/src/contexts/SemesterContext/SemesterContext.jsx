import { createContext, useContext } from "react";

export const SemesterContext = createContext();

export const useSemester = () => useContext(SemesterContext);
