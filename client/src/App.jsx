import {
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import { useCallback } from "react";

// ============================================================
// CONTEXTS
// ============================================================

import {
  AuthProvider,
  useAuth,
} from "./context/AuthContext";

import {
  SiteSettingsProvider,
} from "./context/SiteSettingsContext";

import {
  CategoryProvider,
} from "./context/CategoryContext";

// ============================================================
// LAYOUT & MIDDLEWARE
// ============================================================

import PublicLayout from "./layouts/PublicLayout";
import MainLayout from "./dashboard/layout/MainLayout";

import ProtectDashboard from "./middleware/ProtectDashboard";
import ProtectRole from "./middleware/ProtectRole";

// ============================================================
// CONSTANTS
// ============================================================

import {
  getRoleHomePath,
} from "./constants/roles";

// ============================================================
// CONFIG
// ============================================================

import {
  baseUrl,
  api,
} from "./config/Config";

// ============================================================
// PUBLIC PAGES
// ============================================================

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

// ============================================================
// AUTH
// ============================================================

import Login from "./dashboard/pages/Login";
import Register from "./dashboard/pages/auth/Register";

import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import Unauthorized from "./dashboard/pages/Unauthorized";
import VerifyEmail from "./dashboard/pages/auth/VerifyEmail";

import AccountSettings from "./components/profile/AccountSettings";

// ============================================================
// ADMIN
// ============================================================

import AdminIndex from "./dashboard/pages/AdminIndex";
import Users from "./dashboard/pages/Users";
import AdminProfile from "./dashboard/pages/AdminProfile";
import News from "./dashboard/pages/News";

import SiteSettings from "./dashboard/pages/admin/SiteSettings";
import ContentManagement from "./dashboard/pages/ContentManagement";

import CategoryManagement from "./features/category/CategoryManagement";

// ============================================================
// WRITER / READER
// ============================================================

import WriterDashboard from "./dashboard/components/WriterDashboard";

import CreateNewsHub from "./features/article/CreateNewsHub";
import ArticleEditorRoute from "./features/article/ArticleEditorRoute";
import ManageNews from "./features/article/ManageNews";

import WriterProfile from "./dashboard/pages/WriterProfile";

import ReaderIndex from "./dashboard/pages/ReaderIndex";
import ReaderBookmarks from "./dashboard/pages/ReaderBookmarks";
import ReaderComments from "./dashboard/pages/ReaderComments";
import ReaderHistory from "./dashboard/pages/ReaderHistory";

// ============================================================
// NEWS SERVICE
// ============================================================

import {
  newsService,
} from "./features/news/services/newsService";

// ============================================================
// UPLOAD NEWS IMAGE
// ============================================================

const uploadNewsImage = async (file) => {
  const formData = new FormData();

  formData.append("image", file);

  const response = await fetch(
    `${baseUrl}${api.uploadNewsImage}`,
    {
      method: "POST",

      /*
       * Auth এখন httpOnly cookie based.
       * তাই localStorage token / Authorization header
       * এখানে ব্যবহার করা হবে না।
       */
      credentials: "include",

      body: formData,
    }
  );

  if (!response.ok) {
    let message = "Upload failed";

    try {
      const errorData =
        await response.json();

      message =
        errorData?.message ||
        message;
    } catch {
      // Ignore JSON parsing error.
    }

    throw new Error(message);
  }

  const data =
    await response.json();

  return {
    id: data.mediaId,

    mediaId: data.mediaId,

    public_id:
      data.cloudinaryPublicId,

    url: data.url,

    secureUrl:
      data.secureUrl,

    name: file.name,

    local: false,
  };
};

// ============================================================
// BUILD NEWS PAYLOAD
// ============================================================
//
// Important:
// status এখানে caller থেকে আসবে.
//
// AutoSave:
//    status = "draft"
//
// Publish:
//    status = "published"
//
// ============================================================

const buildPayload = (
  articleData,
  status
) => {
  return {
    title:
      articleData?.title || "",

    summary:
      articleData?.excerpt || "",

    content:
      articleData?.body || "",

    category:
      articleData?.category || null,

    thumbnail:
      articleData?.coverImage?.mediaId ||
      null,

    status:
      status ||
      articleData?.status ||
      "draft",

    isFeatured:
      Boolean(
        articleData?.isFeatured
      ),

    showInVideoSection:
      Boolean(
        articleData?.showInVideoSection
      ),

    tags:
      Array.isArray(articleData?.tags)
        ? articleData.tags
        : [],
  };
};

// ============================================================
// APP ROUTES
// ============================================================

function AppRoutes() {
  const {
    userInfo,
  } = useAuth();

  const navigate =
    useNavigate();

  /*
   * Debug only.
   *
   * চাইলে পরে remove করতে পারো।
   */
  console.log(
    "userInfo =",
    userInfo
  );

  const defaultRoute =
    getRoleHomePath(
      userInfo?.role
    );

  // ==========================================================
  // SAVE ARTICLE
  // ==========================================================
  //
  // This function is used by ArticleManagement.
  //
  // Existing article:
  //
  // PUT /api/news/:id
  //
  // New article:
  //
  // POST /api/news
  //
  // IMPORTANT:
  // status is NOT hardcoded to draft.
  // ArticleManagement decides whether this is a draft save
  // or a publish operation.
  //
  // ==========================================================

  const saveArticle = useCallback(
    async (articleData) => {
      try {
        const status =
          articleData?.status ||
          "draft";

        const payload =
          buildPayload(
            articleData,
            status
          );

        /*
         * IMPORTANT:
         *
         * ArticleManagement stores the MongoDB _id
         * as article.id after the first POST.
         *
         * So every following autosave goes through PUT.
         */

        const articleId =
          articleData?.id ||
          articleData?._id ||
          null;

        let result;

        if (articleId) {
          result =
            await newsService.updateNews(
              articleId,
              payload
            );
        } else {
          result =
            await newsService.createNews(
              payload
            );
        }

        return result;
      } catch (error) {
        console.error(
          "Save Article Error:",
          error
        );

        throw error;
      }
    },
    []
  );

  // ==========================================================
  // PUBLISH ARTICLE
  // ==========================================================
  //
  // ArticleManagement already waits for an active autosave
  // before calling this function.
  //
  // Therefore this function should ONLY publish.
  //
  // ==========================================================

  const publishArticle = useCallback(
    async (articleData) => {
      try {
        console.log(
          "===== PUBLISH START ====="
        );

        console.log(
          "Article ID:",
          articleData?.id ||
            articleData?._id ||
            "NEW ARTICLE"
        );

        console.log(
          "Title:",
          articleData?.title
        );

        console.log(
          "===== BODY START ====="
        );

        console.log(
          (
            articleData?.body ||
            ""
          ).substring(0, 300)
        );

        console.log(
          "===== BODY END ====="
        );

        // ----------------------------------------------------
        // ALWAYS publish here.
        // ----------------------------------------------------

        const payload =
          buildPayload(
            articleData,
            "published"
          );

        const articleId =
          articleData?.id ||
          articleData?._id ||
          null;

        let result;

        // ----------------------------------------------------
        // Existing article
        // ----------------------------------------------------

        if (articleId) {
          console.log(
            "Publishing existing article:",
            articleId
          );

          result =
            await newsService.updateNews(
              articleId,
              payload
            );
        }

        // ----------------------------------------------------
        // Brand new article
        //
        // Normally ArticleManagement should already have
        // created the draft first, but this fallback keeps
        // publishing functional even if no ID exists.
        // ----------------------------------------------------

        else {
          console.log(
            "Publishing new article..."
          );

          result =
            await newsService.createNews(
              payload
            );
        }

        console.log(
          "===== PUBLISH SUCCESS ====="
        );

        /*
         * Navigate only after the server confirms success.
         */
        setTimeout(() => {
          navigate(
            "/dashboard/writer/add-news"
          );
        }, 1200);

        return result;
      } catch (error) {
        console.error(
          "Publish Error:",
          error
        );

        throw error;
      }
    },
    [navigate]
  );

  // ==========================================================
  // ROUTES
  // ==========================================================

  return (
    <Routes>

      {/* ==================================================== */}
      {/* PUBLIC */}
      {/* ==================================================== */}

      <Route
        element={<PublicLayout />}
      >
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/category/:slug"
          element={<CategoryNews />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/news/:slug"
          element={<ArticleDetails />}
        />

        <Route
          path="/profile/:username"
          element={<PublicProfilePage />}
        />

        {/* Footer */}

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/developer"
          element={<DeveloperProfile />}
        />

        <Route
          path="/editorial-standards"
          element={<EditorialStandards />}
        />

        <Route
          path="/careers"
          element={<Careers />}
        />

        <Route
          path="/advertise"
          element={<Advertise />}
        />

        <Route
          path="/privacy"
          element={<Privacy />}
        />

        <Route
          path="/terms"
          element={<Terms />}
        />

        <Route
          path="/corrections"
          element={<Corrections />}
        />

        <Route
          path="/cookies"
          element={<Cookies />}
        />
      </Route>

      {/* ==================================================== */}
      {/* AUTH */}
      {/* ==================================================== */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/verify-email/:token"
        element={<VerifyEmail />}
      />

      <Route
        path="/reset-password/:token"
        element={<ResetPassword />}
      />

      {/* ==================================================== */}
      {/* DASHBOARD */}
      {/* ==================================================== */}

      <Route
        path="/dashboard"
        element={<ProtectDashboard />}
      >
        <Route element={<MainLayout />}>

          {/* Dashboard default */}

          <Route
            index
            element={
              <Navigate
                to={defaultRoute}
                replace
              />
            }
          />

          <Route
            path="unable-access"
            element={<Unauthorized />}
          />

          <Route
            path="account-settings"
            element={<AccountSettings />}
          />

          {/* ================================================= */}
          {/* ADMIN + SUPERADMIN */}
          {/* ================================================= */}

          <Route
            element={
              <ProtectRole
                roles={[
                  "admin",
                  "superadmin",
                ]}
              />
            }
          >
            <Route
              path="admin"
              element={<AdminIndex />}
            />

            <Route
              path="admin/content-management"
              element={
                <ContentManagement />
              }
            />

            <Route
              path="admin/categories"
              element={
                <CategoryManagement />
              }
            />

            <Route
              path="admin/news"
              element={<News />}
            />

            <Route
              path="admin/profile"
              element={<AdminProfile />}
            />

            <Route
              path="admin/users"
              element={<Users />}
            />
          </Route>

          {/* ================================================= */}
          {/* SITE SETTINGS */}
          {/* ================================================= */}

          <Route
            path="admin/site-settings"
            element={<SiteSettings />}
          />

          {/* ================================================= */}
          {/* WRITER */}
          {/* ================================================= */}

          <Route
            element={
              <ProtectRole
                roles={[
                  "writer",
                  "admin",
                  "superadmin",
                ]}
              />
            }
          >

            <Route
              path="writer"
              element={
                <WriterDashboard />
              }
            />

            <Route
              path="writer/add-news"
              element={
                <CreateNewsHub />
              }
            />

            {/* --------------------------------------------- */}
            {/* ARTICLE EDITOR */}
            {/* --------------------------------------------- */}

            <Route
              path="writer/add-news/editor"
              element={
                <ArticleEditorRoute
                  currentUserId={
                    userInfo?.id ||
                    userInfo?._id ||
                    null
                  }

                  uploadImage={
                    uploadNewsImage
                  }

                  onSave={
                    saveArticle
                  }

                  onPublish={
                    publishArticle
                  }
                />
              }
            />

            {/* --------------------------------------------- */}
            {/* MANAGE NEWS */}
            {/* --------------------------------------------- */}

            <Route
              path="writer/add-news/manage"
              element={
                <ManageNews
                  currentUserId={
                    userInfo?.id ||
                    userInfo?._id ||
                    null
                  }
                />
              }
            />

            <Route
              path="writer/profile"
              element={
                <WriterProfile />
              }
            />

          </Route>

          {/* ================================================= */}
          {/* READER */}
          {/* ================================================= */}

          <Route
            element={
              <ProtectRole
                roles={["reader"]}
              />
            }
          >
            <Route
              path="reader"
              element={
                <ReaderIndex />
              }
            />

            <Route
              path="reader/bookmarks"
              element={
                <ReaderBookmarks />
              }
            />

            <Route
              path="reader/comments"
              element={
                <ReaderComments />
              }
            />

            <Route
              path="reader/history"
              element={
                <ReaderHistory />
              }
            />
          </Route>

        </Route>
      </Route>

      {/* ==================================================== */}
      {/* FALLBACK */}
      {/* ==================================================== */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
}

// ============================================================
// APP
// ============================================================

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

// ============================================================
// EXPORT
// ============================================================

export default App;