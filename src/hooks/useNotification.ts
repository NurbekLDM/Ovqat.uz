import { useState, useCallback } from "react";

interface Notification {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration: number;
}

let notificationId = 0;

export const useNotification = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (
      message: string,
      type: "success" | "error" | "info" | "warning" = "info",
      duration = 5000
    ) => {
      const id = (++notificationId).toString();
      const notification: Notification = { id, message, type, duration };

      setNotifications((prev) => [...prev, notification]);

      return id;
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  const showSuccess = useCallback(
    (message: string) => {
      return addNotification(message, "success");
    },
    [addNotification]
  );

  const showError = useCallback(
    (message: string) => {
      return addNotification(message, "error");
    },
    [addNotification]
  );

  const showWarning = useCallback(
    (message: string) => {
      return addNotification(message, "warning");
    },
    [addNotification]
  );

  const showInfo = useCallback(
    (message: string) => {
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
