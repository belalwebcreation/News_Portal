import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectRole = ({ role }) => {
  const { userInfo } = useAuth();

  if (userInfo?.role === role) {
    return <Outlet />;
  }

  return <Navigate to="/dashboard/unable-access" replace />;
};

export default ProtectRole;