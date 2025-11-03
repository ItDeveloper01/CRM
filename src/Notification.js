import React, { createContext, useContext, useState } from "react";
import MessageBox from "./MessageBox";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  const showMessage = (msg, msgType ) => {
    setMessage(msg);
    setType(msgType);
    setShow(true);
  };

  const closeMessage = () => setShow(false);

  return (
    <NotificationContext.Provider value={{ showMessage }}>
      {children}
      <MessageBox
        show={show}
        type={type}
        message={message}
        onClose={closeMessage}
      />
    </NotificationContext.Provider>
  );
};

export const useMessageBox = () => useContext(NotificationContext);
