import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import FacebookLoginModule from "@greatsumini/react-facebook-login";
import {
  FaGoogle,
  FaFacebookF,
  FaGithub,
  FaMicrosoft,
} from "react-icons/fa";
import { Loader2 } from "lucide-react";

import { useAuth } from "../../../context/AuthContext";
import { baseUrl } from "../../../config/Config";
import { getRoleHomePath } from "../../../constants/roles";

// The package's default export isn't resolving as a plain function through
// this project's bundler interop — `import FacebookLogin from "..."` was
// coming through as the whole module object ({ default, FacebookLoginClient })
// instead of just the component, which is what caused the
// "Element type is invalid ... got: object" crash. Unwrapping `.default`
// manually here fixes it regardless of how the bundler pre-bundled the package.
const FacebookLogin = FacebookLoginModule.default || FacebookLoginModule;

const SocialLogin = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState("");

  const [facebookLoading, setFacebookLoading] = useState(false);
  const [facebookError, setFacebookError] = useState("");

  // Debugging: App ID ঠিকমতো load হচ্ছে কিনা তা চেক করা
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log("Loaded Facebook App ID:", import.meta.env.VITE_FACEBOOK_APP_ID);
    }
  }, []);

  // Role অনুযায়ী Dashboard-এ Redirect
  // ✅ Fix: আগে এখানে নিজস্ব if/else ছিল যেখানে "superadmin" role missing ছিল,
  // ফলে superadmin ভুলভাবে /dashboard/reader এ চলে যেত এবং Unauthorized দেখাতো।
  // এখন LoginForm.jsx আর App.jsx এর মতোই shared helper ব্যবহার করা হচ্ছে,
  // যাতে ভবিষ্যতে কোনো role এখানে miss না হয়।
  const redirectByRole = (role) => {
    const homePath = getRoleHomePath(role);
    navigate(`/dashboard/${homePath}`);
  };

  // Google Login Handler
  const handleGoogleLogin = useGoogleLogin({
    flow: "implicit",
    scope: "openid email profile",
    onSuccess: async (tokenResponse) => {
      setGoogleError("");
      setGoogleLoading(true);
      try {
        const { data } = await axios.post(`${baseUrl}/api/auth/google`, {
          accessToken: tokenResponse.access_token,
        });

        loginUser(data.user);
        redirectByRole(data.user.role);
      } catch (error) {
        setGoogleError(
          error.response?.data?.message ||
            "Google login failed. Please try again."
        );
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      setGoogleError("Google login was cancelled or failed.");
    },
  });

  // Facebook Login Handler
  const handleFacebookSuccess = async (response) => {
    // ⚠️ পরিবর্তন ১: Response payload debug করার জন্য
    console.log("Facebook Response:", response);

    setFacebookError("");
    setFacebookLoading(true);

    const token = response.accessToken || response.access_token;

    if (!token) {
      setFacebookError("Facebook access token not found.");
      setFacebookLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(`${baseUrl}/api/auth/facebook`, {
        accessToken: token,
      });

      loginUser(data.user);
      redirectByRole(data.user.role);
    } catch (error) {
      setFacebookError(
        error.response?.data?.message ||
          "Facebook login failed. Please try again."
      );
    } finally {
      setFacebookLoading(false);
    }
  };

  const handleGithubLogin = () => {
    console.log("GitHub Login");
  };

  const handleMicrosoftLogin = () => {
    console.log("Microsoft Login");
  };

  return (
    <div className="mt-8">
      {/* Divider */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-gray-300 dark:bg-slate-600" />
        <span className="text-sm text-gray-500 dark:text-slate-400 font-medium">
          OR CONTINUE WITH
        </span>
        <div className="flex-1 h-px bg-gray-300 dark:bg-slate-600" />
      </div>

      {/* Error Messages */}
      {googleError && (
        <div className="mb-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 px-4 py-2 text-sm">
          {googleError}
        </div>
      )}

      {facebookError && (
        <div className="mb-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 px-4 py-2 text-sm">
          {facebookError}
        </div>
      )}

      {/* Social Buttons Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Google Button */}
        <button
          type="button"
          onClick={() => handleGoogleLogin()}
          disabled={googleLoading || facebookLoading}
          className="
            flex
            items-center
            justify-center
            gap-3
            py-3
            rounded-xl
            border
            border-gray-300
            dark:border-slate-600
            bg-white
            dark:bg-slate-800
            hover:bg-red-50
            dark:hover:bg-red-950/30
            hover:border-red-500
            dark:hover:border-red-500
            transition-all
            duration-300
            shadow-sm
            disabled:opacity-60
            disabled:cursor-not-allowed
          "
        >
          {googleLoading ? (
            <Loader2 size={18} className="animate-spin text-red-500" />
          ) : (
            <FaGoogle className="text-red-500 text-lg" />
          )}
          <span className="font-medium text-slate-700 dark:text-slate-200">
            {googleLoading ? "Signing in..." : "Google"}
          </span>
        </button>

        {/* Facebook Button */}
        <FacebookLogin
          appId={import.meta.env.VITE_FACEBOOK_APP_ID || ""}
          scope="public_profile,email"
          fields="name,email,picture"
          onSuccess={handleFacebookSuccess}
          onFail={(error) => {
            console.error("Facebook Login Failed:", error);
            setFacebookError("Facebook login was cancelled or failed.");
            setFacebookLoading(false);
          }}
          render={({ onClick }) => (
            <button
              type="button"
              onClick={onClick}
              disabled={googleLoading || facebookLoading}
              className="
                flex
                items-center
                justify-center
                gap-3
                py-3
                rounded-xl
                border
                border-gray-300
                dark:border-slate-600
                bg-white
                dark:bg-slate-800
                hover:bg-blue-50
                dark:hover:bg-blue-950/30
                hover:border-blue-600
                dark:hover:border-blue-600
                transition-all
                duration-300
                shadow-sm
                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            >
              {facebookLoading ? (
                <Loader2 size={18} className="animate-spin text-blue-600" />
              ) : (
                <FaFacebookF className="text-blue-600 text-lg" />
              )}
              <span className="font-medium text-slate-700 dark:text-slate-200">
                {facebookLoading ? "Signing in..." : "Facebook"}
              </span>
            </button>
          )}
        />

        {/* GitHub Button */}
        <button
          type="button"
          onClick={handleGithubLogin}
          disabled={googleLoading || facebookLoading}
          className="flex items-center justify-center gap-3 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all duration-300 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <FaGithub className="text-black dark:text-white text-lg" />
          <span className="font-medium text-slate-700 dark:text-slate-200">GitHub</span>
        </button>

        {/* Microsoft Button */}
        <button
          type="button"
          onClick={handleMicrosoftLogin}
          disabled={googleLoading || facebookLoading}
          className="flex items-center justify-center gap-3 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-green-50 dark:hover:bg-green-950/30 hover:border-green-600 dark:hover:border-green-600 transition-all duration-300 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <FaMicrosoft className="text-green-600 text-lg" />
          <span className="font-medium text-slate-700 dark:text-slate-200">Microsoft</span>
        </button>
      </div>
    </div>
  );
};

export default SocialLogin;