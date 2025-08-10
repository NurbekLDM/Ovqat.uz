import { useState, useCallback } from "react";

let notificationId = 0;

export const useNotification = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback(
    (message, type = "info", duration = 5000) => {
      const id = (++notificationId).toString();
      const notification = { id, message, type, duration };

      setNotifications((prev) => [...prev, notification]);

      return id;
    },
    []
  );

  const removeNotification = useCallback((id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  const showSuccess = useCallback(
    (message) => {
      return addNotification(message, "success");
    },
    [addNotification]
  );

  const showError = useCallback(
    (message) => {
      return addNotification(message, "error");
    },
    [addNotification]
  );

  const showWarning = useCallback(
    (message) => {
      return addNotification(message, "warning");
    },
    [addNotification]
  );

  const showInfo = useCallback(
    (message) => {
      return addNotification(message, "info");
    },
    [addNotification]
  );

  return {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};
