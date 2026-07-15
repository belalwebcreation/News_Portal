import { FiMenu } from "react-icons/fi";

const MobileMenu = () => {
  return (
    <button
      className="
      lg:hidden
      w-11
      h-11
      rounded-md
      flex
      items-center
      justify-center
      hover:bg-gray-100
      duration-300
      "
    >
      <FiMenu size={24} />
    </button>
  );
};

export default MobileMenu;