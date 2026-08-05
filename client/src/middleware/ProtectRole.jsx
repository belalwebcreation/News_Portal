import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectRole = ({ role, roles }) => {
  const { userInfo } = useAuth();

  const allowed = roles ?? (role ? [role] : []);

  if (allowed.includes(userInfo?.role)) {
    return <Outlet />;
  }

  return <Navigate to="/dashboard/unable-access" replace />;
};

export default ProtectRole;