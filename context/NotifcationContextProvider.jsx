import React, { useState } from "react";
import notificationContext from "./NotificationContext";

const NotifcationContextProvider = ({ children }) => {
  const [jobDetails, setJobDetails] = useState({ from: "", to: "" });
  const [modalVisible, setModalVisible] = useState(false);
  const [expoToken, setExpoToken] = useState("");

  

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  return (
    <notificationContext.Provider
      value={{
        expoToken,
        setExpoToken,
        jobDetails,
        setJobDetails,
        modalVisible,
        setModalVisible,
        showModal,
        hideModal,
      }}
    >
      {children}
    </notificationContext.Provider>
  );
};

export default NotifcationContextProvider;
