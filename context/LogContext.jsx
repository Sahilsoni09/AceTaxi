import React, { createContext, useState } from "react";
import * as Sentry from "@sentry/react-native";

const LogContext = createContext();

export const LogContextProvider = ({ children }) => {
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    setLogs((prevLogs) => [...prevLogs, { message, timestamp: new Date() }]);
  };

  // const logInfo = (message) => {
  //   addLog(message);

  //   Sentry.addBreadcrumb({
  //     category: 'log',
  //     message: message,
  //     level: Sentry.Severity.Info, 
  //   });
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
