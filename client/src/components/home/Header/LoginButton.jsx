import { Link } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import { useAuth } from "../../../context/AuthContext"; // path adjust করবে
import ProfileMenu from "./ProfileMenu";

const LoginButton = () => {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return <ProfileMenu />;
  }

  return (
    <Link
      to="/login"
      className="
        flex
        items-center
        gap-2
        px-4
        py-2
        rounded-md
        text-sm
        font-medium
        border
        border-gray-300
        hover:border-red-600
        hover:text-red-700
        duration-300
      "
    >
      <FiUser size={18} />
      লগইন
    </Link>
  );
};

export default LoginButton;