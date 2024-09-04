import React, { createContext, useState } from "react";
import * as Sentry from "@sentry/react-native";

const LogContext = createContext();

export const LogContextProvider = ({ children }) => {
  const [logs, setLogs] = useState([]);
  const [isTestApi, setIsTestApi] = useState(true); // Default to test API

  const addLog = (message) => {
    setLogs((prevLogs) => [...prevLogs, { message, timestamp: new Date() }]);
  };

  const clearLogs = () => {
    setLogs([]);
  };


  const toggleApi = () => {
    setIsTestApi((prevState) => !prevState);
  };

  return (
    <LogContext.Provider value={{ logs, addLog, clearLogs, isTestApi, toggleApi}}>
      {children}
    </LogContext.Provider>
  );
};

export default LogContext;
