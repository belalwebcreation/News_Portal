import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import { useSocket } from "./SocketContext";
import { notificationService } from "../features/notification/services/notificationService";

const NotificationContext = createContext(null);

const LIMIT = 15;

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { socket } = useSocket();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const fetchNotifications = useCallback(async (nextPage = 1) => {
    setLoading(true);
    try {
      const res = await notificationService.getNotifications({
        page: nextPage,
        limit: LIMIT,
      });

      const list = res?.data || [];

      setNotifications((prev) =>
        nextPage === 1 ? list : [...prev, ...list]
      );
      setUnreadCount(res?.meta?.unreadCount || 0);
      setHasMore(nextPage < (res?.meta?.pages || 1));
      setPage(nextPage);
    } catch (error) {
      console.error("Failed to load notifications:", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Login/session-restore হওয়ার পরই একবার fetch — dropdown না খুললেও
  // bell icon-এ unread count সাথে সাথে দেখাবে।
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications(1);
    } else {
      setNotifications([]);
      setUnreadCount(0);
      setPage(1);
      setHasMore(true);
    }
  }, [isAuthenticated, fetchNotifications]);

  // Real-time push + reconnect-এ catch-up refresh
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    const handleReconnect = () => {
      // disconnect থাকার সময় miss হওয়া notification catch up করতে
      fetchNotifications(1);
    };

    socket.on("new_notification", handleNewNotification);
    socket.io.on("reconnect", handleReconnect);

    return () => {
      socket.off("new_notification", handleNewNotification);
      socket.io.off("reconnect", handleReconnect);
    };
  }, [socket, fetchNotifications]);

  const markAsRead = useCallback(async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await notificationService.markAsRead(id);
    } catch (error) {
      console.error("Failed to mark notification as read:", error.message);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);

    try {
      await notificationService.markAllAsRead();
    } catch (error) {
      console.error("Failed to mark all as read:", error.message);
    }
  }, []);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchNotifications(page + 1);
    }
  }, [loading, hasMore, page, fetchNotifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        hasMore,
        markAsRead,
        markAllAsRead,
        loadMore,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};

export default NotificationContext;