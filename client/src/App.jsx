import { Routes, Route, Navigate } from "react-router-dom";

// Context
import { AuthProvider, useAuth } from "./context/AuthContext";

// Layout
import MainLayout from "./dashboard/layout/MainLayout";

// Middleware
import ProtectDashboard from "./middleware/ProtectDashboard";
import ProtectRole from "./middleware/ProtectRole";

// ================= PUBLIC PAGES =================
import Home from "./pages/Home";
import CategoryNews from "./pages/CategoryNews";

// Auth Pages
import Login from "./dashboard/pages/Login";
import Register from "./dashboard/pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Unauthorized from "./dashboard/pages/Unauthorized";

// ================= ADMIN =================
import AdminIndex from "./dashboard/pages/AdminIndex";
import AddWriter from "./dashboard/pages/AddWriter";
import Writers from "./dashboard/pages/Writers";
import AdminProfile from "./dashboard/pages/AdminProfile";
import News from "./dashboard/pages/News";
import SiteSettings from "./dashboard/pages/admin/SiteSettings";

// ================= WRITER =================
import WriterIndex from "./dashboard/pages/WriterIndex";
import CreateNews from "./dashboard/pages/CreateNews";
import WriterProfile from "./dashboard/pages/WriterProfile";

// ================= READER =================
import ReaderIndex from "./dashboard/pages/ReaderIndex";
import ReaderProfile from "./dashboard/pages/ReaderProfile";
import ReaderBookmarks from "./dashboard/pages/ReaderBookmarks";
import ReaderComments from "./dashboard/pages/ReaderComments";
import ReaderHistory from "./dashboard/pages/ReaderHistory";
import ReaderSettings from "./dashboard/pages/ReaderSettings";
// import VerifyEmail from "./pages/auth/VerifyEmail";
import VerifyEmail from "./dashboard/pages/auth/VerifyEmail";
import ContentManagement from "./dashboard/pages/ContentManagement";
import { SiteSettingsProvider } from "./context/SiteSettingsContext";

const ROLE_HOME_PATH = {
  admin: "admin",
  writer: "writer",
  reader: "reader",
};

function AppRoutes() {
  const { userInfo } = useAuth();

  const defaultRoute =
    ROLE_HOME_PATH[userInfo?.role] ?? "unable-access";

  return (
    <Routes>

      {/* ========================= */}
      {/* PUBLIC WEBSITE ROUTES */}
      {/* ========================= */}

      <Route path="/" element={<Home />} />

      <Route
        path="/category/:slug"
        element={<CategoryNews />}
      />

      {/* ========================= */}
      {/* AUTH ROUTES */}
      {/* ========================= */}

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />

      {/* ========================= */}
      {/* DASHBOARD */}
      {/* ========================= */}

      <Route path="/dashboard" element={<ProtectDashboard />}>
        <Route element={<MainLayout />}>

          <Route
            index
            element={<Navigate to={defaultRoute} replace />}
          />

          <Route
            path="unable-access"
            element={<Unauthorized />}
          />

          {/* ========== ADMIN ========== */}

          <Route element={<ProtectRole role="admin" />}>

            <Route path="admin" element={<AdminIndex />} />

            <Route
              path="admin/content-management"
               element={<ContentManagement />}
                />

            <Route path="admin/news" element={<News />} />

            <Route
              path="admin/profile"
              element={<AdminProfile />}
            />

            <Route
              path="admin/add-writer"
              element={<AddWriter />}
            />

            <Route
              path="admin/writers"
              element={<Writers />}
            />

          </Route>
          <Route
              path="admin/site-settings"
               element={<SiteSettings />}
                />

          {/* ========== WRITER ========== */}

          <Route element={<ProtectRole role="writer" />}>

            <Route
              path="writer"
              element={<WriterIndex />}
            />

            <Route
              path="writer/add-news"
              element={<CreateNews />}
            />

            <Route
              path="writer/profile"
              element={<WriterProfile />}
            />

          </Route>

          {/* ========== READER ========== */}

          <Route element={<ProtectRole role="reader" />}>

            <Route
              path="reader"
              element={<ReaderIndex />}
            />

            <Route
              path="reader/profile"
              element={<ReaderProfile />}
            />

            <Route
              path="reader/bookmarks"
              element={<ReaderBookmarks />}
            />

            <Route
              path="reader/comments"
              element={<ReaderComments />}
            />

            <Route
              path="reader/history"
              element={<ReaderHistory />}
            />

            <Route
              path="reader/settings"
              element={<ReaderSettings />}
            />

          </Route>

        </Route>
      </Route>

      {/* ========================= */}
      {/* 404 */}
      {/* ========================= */}

      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
  <SiteSettingsProvider>
    <AppRoutes />
  </SiteSettingsProvider>
</AuthProvider>
  );
}

export default App;