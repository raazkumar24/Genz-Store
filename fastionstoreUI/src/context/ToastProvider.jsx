import React, { useState, useCallback } from "react";
import { ToastContext } from "./ToastContext";

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", icon = null) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, icon }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast Notification Container UI yahan render kar sakte hain */}
    </ToastContext.Provider>
  );
};