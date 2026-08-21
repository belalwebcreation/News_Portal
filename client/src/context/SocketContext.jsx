import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { socketPath } from "../config/Config";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Logged out — কোনো connection রাখার দরকার নেই।
    if (!isAuthenticated) {
      setSocket((prev) => {
        prev?.disconnect();
        return null;
      });
      setIsConnected(false);
      return;
    }

    // io() কে কোনো URL না দিলে এটা same-origin (যেখান থেকে page লোড
    // হয়েছে) কানেক্ট করার চেষ্টা করে — dev-এ Vite proxy, prod-এ same
    // domain, দুই জায়গাতেই কাজ করে।
    const newSocket = io({
      path: socketPath,
      withCredentials: true,
      // websocket ব্লকড থাকলে (যেমন কিছু shared-hosting environment)
      // স্বয়ংক্রিয়ভাবে polling-এ fallback করবে।
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => setIsConnected(true));
    newSocket.on("disconnect", () => setIsConnected(false));
    newSocket.on("connect_error", (err) => {
      console.error("Socket connect error:", err.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export default SocketContext;