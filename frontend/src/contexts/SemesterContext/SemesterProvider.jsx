import { useState, useEffect } from "react";
import { SemesterContext } from "./SemesterContext";
import semesterService from "@/services/semesterService";

export const SemesterProvider = ({ children }) => {
  const [semester, setSemester] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(null);
  const [semesterId, setSemesterId] = useState(() => {
    return localStorage.getItem("semesterId") || null;
  });

  useEffect(() => {
    const fetchSemesterById = async (id) => {
      try {
        const res = await semesterService.getSemesterDetail(id);
        if (res.data?.data?.semester) {
          setSemester(res.data.data.semester);
        }
      } catch (error) {
        console.error("Lỗi khi lấy học kỳ theo ID:", error);
      }
    };

    if (semesterId) {
      fetchSemesterById(semesterId);
      localStorage.setItem("semesterId", semesterId);
    } else {
      const fetchSemesters = async () => {
        try {
          const res = await semesterService.getSemesters();
          const semesters = res.data?.data.semesters;
          if (semesters.length > 0) {
            const latestSemester = semesters[0];
            setSemester(latestSemester);
            setSemesterId(latestSemester.id);
          }
        } catch (error) {
          console.error("Lỗi khi lấy danh sách học kỳ:", error);
        }
      };
      fetchSemesters();
    }
  }, [semesterId]);

  useEffect(() => {
    if (semester) {
      calculateCurrentWeek(semester.start_date, semester.weeks);
    }
  }, [semester]);

  const calculateCurrentWeek = (startDate, totalWeeks) => {
    const start = new Date(startDate);
    const now = new Date();

    const diffInMs = now - start;
    const diffInWeeks = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7)) + 1;

    if (diffInWeeks >= 1 && diffInWeeks <= totalWeeks) {
      setCurrentWeek(diffInWeeks);
    } else {
      setCurrentWeek(null);
    }
  };

  const updateSemesterId = (id) => {
    setSemesterId(id);
  };

  return (
    <SemesterContext.Provider
      value={{
        semester,
        semesterId,
        setSemesterId: updateSemesterId,
        currentWeek,
      }}
    >
      {children}
    </SemesterContext.Provider>
  );
};
