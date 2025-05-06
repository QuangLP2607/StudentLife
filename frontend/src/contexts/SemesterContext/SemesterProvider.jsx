import { useState, useEffect } from "react";
import { SemesterContext } from "./SemesterContext";

export const SemesterProvider = ({ children }) => {
  const [semester, setSemester] = useState(() => {
    const storedSemester = localStorage.getItem("semester");
    return storedSemester ? JSON.parse(storedSemester) : null;
  });

  useEffect(() => {
    if (semester) {
      localStorage.setItem("semester", JSON.stringify(semester));
    } else {
      localStorage.removeItem("semester");
    }
  }, [semester]);

  return (
    <SemesterContext.Provider value={{ semester, setSemester }}>
      {children}
    </SemesterContext.Provider>
  );
};
