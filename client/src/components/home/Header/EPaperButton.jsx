import { FiBookOpen } from "react-icons/fi";

const EPaperButton = () => {
  return (
    <button
      className="
      flex
      items-center
      gap-2
      px-4
      py-2
      rounded-md
      bg-red-700
      text-white
      text-sm
      font-medium
      hover:bg-red-800
      duration-300
      "
    >
      <FiBookOpen size={18} />

      ই-পেপার
    </button>
  );
};

export default EPaperButton;