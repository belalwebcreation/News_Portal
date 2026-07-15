import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectDashboard = () => {
  const { isLoggedIn, loading } = useAuth();

  // Auth check শেষ না হওয়া পর্যন্ত অপেক্ষা করবে
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectDashboard;