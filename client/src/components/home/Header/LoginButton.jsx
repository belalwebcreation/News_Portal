import { FiUser } from "react-icons/fi";

const LoginButton = () => {
  return (
    <button Link to="http://localhost:5173/login"
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
    </button>
  );
};

export default LoginButton;