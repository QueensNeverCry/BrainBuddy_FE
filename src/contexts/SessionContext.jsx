import React, { createContext, useState, useEffect } from "react";

// 1. Context 생성
export const SessionContext = createContext();

// 2. Provider 컴포넌트
export const SessionProvider = ({ children }) => {
  const [selectedTime, setSelectedTime] = useState(
    localStorage.getItem("selectedTime") || ""
  );
  const [selectedPlace, setSelectedPlace] = useState(
    localStorage.getItem("selectedPlace") || ""
  );
  const [selectedSubject, setSelectedSubject] = useState(
    localStorage.getItem("selectedSubject") || ""
  );
  const [recentReports, setRecentReports] = useState(
    JSON.parse(localStorage.getItem("recentReports")) || []
  );

  // 로컬스토리지 연동
  useEffect(() => {
    localStorage.setItem("selectedTime", selectedTime);
  }, [selectedTime]);

  useEffect(() => {
    localStorage.setItem("selectedPlace", selectedPlace);
  }, [selectedPlace]);

  useEffect(() => {
    localStorage.setItem("selectedSubject", selectedSubject);
  }, [selectedSubject]);

  useEffect(() => {
    localStorage.setItem("recentReports", JSON.stringify(recentReports));
  }, [recentReports]);

  const addReport = (report) => {
    const newReports = [report, ...recentReports];
    setRecentReports(newReports);
  };

  return (
    <SessionContext.Provider
      value={{
        selectedTime,
        setSelectedTime,
        selectedPlace,
        setSelectedPlace,
        selectedSubject,
        setSelectedSubject,
        recentReports,
        addReport,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
