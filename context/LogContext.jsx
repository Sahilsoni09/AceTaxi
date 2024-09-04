import React, { createContext, useState } from "react";
import * as Sentry from "@sentry/react-native";

const LogContext = createContext();

export const LogContextProvider = ({ children }) => {
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    setLogs((prevLogs) => [...prevLogs, { message, timestamp: new Date() }]);
  };

  // const addLog = (message) => {
  //   const logEntry = { message, timestamp: new Date() };
  //   setLogs((prevLogs) => [...prevLogs, logEntry]);

  //   // Capture the log message in Sentry
  //   Sentry.captureMessage(`Log: ${message}`, "log");
  // };

  // const addError = (errorMessage) => {
  //   const errorEntry = { message: errorMessage, timestamp: new Date(), type: 'error' };
  //   setLogs((prevLogs) => [...prevLogs, errorEntry]);

  //   // Capture the error in Sentry
  //   Sentry.captureException(new Error(errorMessage));
  // };

  // const clearLogs = () => {
  //   setLogs([]);
  // };



  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <LogContext.Provider value={{ logs, addLog, clearLogs}}>
      {children}
    </LogContext.Provider>
  );
};

export default LogContext;
