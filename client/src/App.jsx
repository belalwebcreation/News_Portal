import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useCallback } from "react";

// Contexts
import { AuthProvider, useAuth } from "./context/AuthContext";
import { SiteSettingsProvider } from "./context/SiteSettingsContext";
import { CategoryProvider } from "./context/CategoryContext";

// Layout & Middleware
import PublicLayout from "./layouts/PublicLayout";
import MainLayout from "./dashboard/layout/MainLayout";
import ProtectDashboard from "./middleware/ProtectDashboard";
import ProtectRole from "./middleware/ProtectRole";

// Constants
import { getRoleHomePath } from "./constants/roles";

// Config — baseUrl + api endpoints (আগে এখানে import-ই ছিল না)
import { baseUrl, api } from "./config/Config";

// Public Pages
import Home from "./pages/Home";
import CategoryNews from "./pages/CategoryNews";
import Profile from "./pages/profile/Profile";
import ArticleDetails from "./features/article/pages/ArticleDetails";
import PublicProfilePage from "./pages/PublicProfilePage";
import About from "./features/footer/About";
import DeveloperProfile from "./features/footer/DeveloperProfile";
import EditorialStandards from "./features/footer/EditorialStandards"; 
import Careers from "./features/footer/Careers";
import Advertise from "./features/footer/Advertise";
import Privacy from "./features/footer/Privacy";
import Terms from "./features/footer/Terms";
import Corrections from "./features/footer/Corrections";
import Cookies from "./features/footer/Cookies";

// Auth
import Login from "./dashboard/pages/Login";
import Register from "./dashboard/pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Unauthorized from "./dashboard/pages/Unauthorized";
import VerifyEmail from "./dashboard/pages/auth/VerifyEmail";
import AccountSettings from "./components/profile/AccountSettings";

// Admin Managers
import AdminIndex from "./dashboard/pages/AdminIndex";
// import AddWriter from "./dashboard/pages/AddWriter";
import Users from "./dashboard/pages/Users";
import AdminProfile from "./dashboard/pages/AdminProfile";
import News from "./dashboard/pages/News";
import SiteSettings from "./dashboard/pages/admin/SiteSettings";
import ContentManagement from "./dashboard/pages/ContentManagement";
import CategoryManagement from "./features/category/CategoryManagement";

// Writer & Reader
import WriterDashboard from "./dashboard/components/WriterDashboard";
import CreateNewsHub from "./features/article/CreateNewsHub";
import ArticleEditorRoute from "./features/article/ArticleEditorRoute";
import ManageNews from "./features/article/ManageNews";
import WriterProfile from "./dashboard/pages/WriterProfile";
import ReaderIndex from "./dashboard/pages/ReaderIndex";
// import ReaderProfile from "./dashboard/pages/ReaderProfile";
import ReaderBookmarks from "./dashboard/pages/ReaderBookmarks";
import ReaderComments from "./dashboard/pages/ReaderComments";
import ReaderHistory from "./dashboard/pages/ReaderHistory";
// import ReaderSettings from "./dashboard/pages/ReaderSettings";

// publish article
import { newsService } from "./features/news/services/newsService";

/*
|--------------------------------------------------------------------------
| Upload News Image
|--------------------------------------------------------------------------
|
| আগে এখানে:
|   - localStorage.getItem("token") দিয়ে Bearer header পাঠানো হতো
|     (পুরনো token-based auth-এর leftover, এখন httpOnly cookie
|     ব্যবহার হচ্ছে বলে এটা সবসময় null/অকার্যকর)
|   - URL hardcoded ছিল "/api/news/image", যেটাতে "/news" prefix
|     মিসিং ছিল, ফলে backend route (/news/api/news/image) এ
|     কখনোই ঠিকমতো hit হতো না।
|
| Fix:
|   - baseUrl + api.uploadNewsImage দিয়ে সঠিক URL বানানো হলো
|   - credentials: "include" দিয়ে explicitly cookie পাঠানো
|     নিশ্চিত করা হলো (httpOnly accessToken cookie এভাবেই যাবে)
|
*/

const uploadNewsImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${baseUrl}${api.uploadNewsImage}`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Upload failed");
  }

  const data = await res.json();

  return {
    id: data.mediaId,
    mediaId: data.mediaId,
    public_id: data.cloudinaryPublicId,
    url: data.url,
    secureUrl: data.secureUrl,
    name: file.name,
    local: false,
  };
};

// 👇 buildPayload কে component-এর বাইরে আনা হলো — এটা কোনো state/prop ব্যবহার করে না,
// তাই বাইরে থাকলে প্রতি render-এ নতুন function তৈরি হবে না।
const buildPayload = (articleData, status) => ({
  title: articleData.title,
  summary: articleData.excerpt,
  content: articleData.body,
  category: articleData.category,
  thumbnail: articleData.coverImage?.mediaId || null,
  status,
  isFeatured: Boolean(articleData.isFeatured),
  showInVideoSection: Boolean(articleData.showInVideoSection), // ✅ যোগ করা হলো
  tags: articleData.tags || [],
});

function AppRoutes() {
  const { userInfo } = useAuth();
  const navigate = useNavigate();
  console.log("userInfo =", userInfo);

  const defaultRoute = getRoleHomePath(userInfo?.role);

  // 👇 useCallback দিয়ে wrap করা হলো — dependency array খালি, কারণ buildPayload আর
  // newsService দুটোই module-level এবং কখনো বদলায় না। ফলে saveArticle এখন
  // প্রতি render-এ একই reference রাখবে, আর child component-এর effect/dependency
  // অকারণে re-trigger হবে না।
  const saveArticle = useCallback(async (articleData) => {
    try {
      const payload = buildPayload(articleData, "draft");
      return articleData.id
        ? await newsService.updateNews(articleData.id, payload)
        : await newsService.createNews(payload);
    } catch (error) {
      console.error("Save Draft Error:", error);
      throw error;
    }
  }, []);

  // 👇 useCallback দিয়ে wrap করা হলো — navigate ছাড়া আর কোনো external dependency নেই।
  const publishArticle = useCallback(async (articleData) => {
    console.log("===== BODY START =====");
    console.log(articleData.body.substring(0, 300));
    console.log("===== BODY END =====");

    try {
      const payload = buildPayload(articleData, "published");
      const result = articleData.id
        ? await newsService.updateNews(articleData.id, payload)
        : await newsService.createNews(payload);

      setTimeout(() => navigate("/dashboard/writer/add-news"), 1200);

      return result;
    } catch (error) {
      console.error("Publish Error:", error);
      throw error;
    }
  }, [navigate]);

  return (
    <Routes>
      {/* PUBLIC — PublicLayout এর ভেতরে নেস্টেড */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/category/:slug" element={<CategoryNews />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/news/:slug" element={<ArticleDetails />} />
        <Route path="/profile/:username" element={<PublicProfilePage />} />

        {/* FOOTER PAGES — Footer.jsx এর COMPANY_LINKS / POLICY_LINKS এর সাথে মিল রেখে */}
        <Route path="/about" element={<About />} />
        <Route path="/developer" element={<DeveloperProfile />} />
        
        <Route path="/editorial-standards" element={<EditorialStandards />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/advertise" element={<Advertise />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/corrections" element={<Corrections />} />
        <Route path="/cookies" element={<Cookies />} />
      </Route>

      {/* AUTH */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* DASHBOARD CONTAINER */}
      <Route path="/dashboard" element={<ProtectDashboard />}>
        <Route element={<MainLayout />}>
          <Route index element={<Navigate to={defaultRoute} replace />} />
          <Route path="unable-access" element={<Unauthorized />} />
          <Route path="account-settings" element={<AccountSettings />} />

          {/* ADMIN + SUPERADMIN */}
          <Route element={<ProtectRole roles={["admin", "superadmin"]} />}>
            <Route path="admin" element={<AdminIndex />} />
            <Route path="admin/content-management" element={<ContentManagement />} />
            <Route path="admin/categories" element={<CategoryManagement />} />
            <Route path="admin/news" element={<News />} />
            <Route path="admin/profile" element={<AdminProfile />} />
            {/* <Route path="admin/add-writer" element={<AddWriter />} /> */}
            <Route path="admin/users" element={<Users />} />
          </Route>

          <Route path="admin/site-settings" element={<SiteSettings />} />

          {/* WRITER (admin ও superadmin ও পূর্ণ writer access পাবে) */}
          <Route element={<ProtectRole roles={["writer", "admin", "superadmin"]} />}>
            <Route path="writer" element={<WriterDashboard />} /> {/* ✅ NEW — Writer Dashboard (stats + my news) */}
            <Route path="writer/add-news" element={<CreateNewsHub />} />
            <Route
              path="writer/add-news/editor"
              element={
                <ArticleEditorRoute
                  currentUserId={userInfo?.id}
                  uploadImage={uploadNewsImage}
                  onSave={saveArticle}
                  onPublish={publishArticle}
                />
              }
            />
            <Route
              path="writer/add-news/manage"
              element={<ManageNews currentUserId={userInfo?.id} />}
            />
            <Route path="writer/profile" element={<WriterProfile />} />
        
          </Route>

          {/* READER */}
          <Route element={<ProtectRole roles={["reader"]} />}>
            <Route path="reader" element={<ReaderIndex />} />
            {/* <Route path="reader/profile" element={<ReaderProfile />} /> */}
            <Route path="reader/bookmarks" element={<ReaderBookmarks />} />
            <Route path="reader/comments" element={<ReaderComments />} />
            <Route path="reader/history" element={<ReaderHistory />} />
            {/* <Route path="reader/settings" element={<ReaderSettings />} /> */}
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <SiteSettingsProvider>
        <CategoryProvider>
          <AppRoutes />
        </CategoryProvider>
      </SiteSettingsProvider>
    </AuthProvider>
  );
}

export default App;