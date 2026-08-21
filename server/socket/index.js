import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import allowedOrigins from "../config/allowedOrigins.js";

let io = null;

/* ==========================================
   Minimal Cookie Header Parser
========================================== */
// socket.io handshake-এ Express-এর cookie-parser middleware চলে না,
// তাই raw "Cookie" header নিজে parse করতে হচ্ছে। protect middleware-এর
// সমান লজিক — শুধু accessToken cookie-টা বের করলেই যথেষ্ট।
const parseCookieHeader = (cookieHeader = "") => {
  return cookieHeader.split(";").reduce((acc, part) => {
    const separatorIndex = part.indexOf("=");
    if (separatorIndex === -1) return acc;

    const key = part.slice(0, separatorIndex).trim();
    const value = part.slice(separatorIndex + 1).trim();
    if (!key) return acc;

    try {
      acc[key] = decodeURIComponent(value);
    } catch {
      acc[key] = value;
    }

    return acc;
  }, {});
};

/* ==========================================
   Socket Auth Middleware
========================================== */
// REST-এর protect middleware-এর সমান লজিক, শুধু req.cookies-এর বদলে
// socket.handshake থেকে cookie বের করা হচ্ছে।
const authenticateSocket = async (socket, next) => {
  try {
    const cookieHeader = socket.handshake.headers.cookie;
    if (!cookieHeader) {
      return next(new Error("Authentication required."));
    }

    const cookies = parseCookieHeader(cookieHeader);
    const accessToken = cookies.accessToken;

    if (!accessToken) {
      return next(new Error("Authentication required."));
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    if (decoded.type !== "access") {
      return next(new Error("Invalid token type."));
    }

    const user = await User.findById(decoded.id).select("_id isActive");

    if (!user || !user.isActive) {
      return next(new Error("User not found or inactive."));
    }

    socket.userId = user._id.toString();
    next();
  } catch (error) {
    // accessToken expired হলে REST-এর মতো silent refresh এখানে নেই —
    // client reconnect attempt-এ নতুন cookie নিয়ে আবার চেষ্টা করবে।
    next(new Error("Invalid or expired token."));
  }
};

/* ==========================================
   Init Socket.io
========================================== */
export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    // Passenger-এ পুরো app "/news" prefix-এর নিচে mount করা, তাই
    // socket.io-এর নিজস্ব endpoint-ও এই prefix-এর ভেতরেই রাখা হলো —
    // নাহলে production-এ reverse proxy request-টা ধরতেই পারবে না।
    path: "/news/socket.io",

    cors: {
      origin(origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        console.error(`Socket.io CORS rejected origin: ${origin}`);
        return callback(new Error("CORS: Origin not allowed"));
      },
      credentials: true,
    },
  });

  io.use(authenticateSocket);

  io.on("connection", (socket) => {
    // প্রতিটা user নিজের id-নামের room-এ join করে — নির্দিষ্ট writer-কে
    // notification পাঠাতে io.to(userId).emit(...) করলেই হবে, socket id
    // ম্যানুয়ালি track করা লাগবে না (multi-tab/device-এও কাজ করবে)।
    socket.join(socket.userId);
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io has not been initialized yet.");
  }
  return io;
};