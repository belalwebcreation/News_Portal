import {
  FaGoogle,
  FaFacebookF,
  FaGithub,
  FaMicrosoft,
} from "react-icons/fa";

const SocialLogin = () => {
  const handleGoogleLogin = () => {
    console.log("Google Login");
  };

  const handleFacebookLogin = () => {
    console.log("Facebook Login");
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

        <div className="flex-1 h-px bg-gray-300" />

        <span className="text-sm text-gray-500 font-medium">
          OR CONTINUE WITH
        </span>

        <div className="flex-1 h-px bg-gray-300" />

      </div>

      {/* Social Buttons */}

      <div className="grid grid-cols-2 gap-4">

        {/* Google */}

        <button
          onClick={handleGoogleLogin}
          className="
            flex
            items-center
            justify-center
            gap-3
            py-3
            rounded-xl
            border
            border-gray-300
            bg-white
            hover:bg-red-50
            hover:border-red-500
            transition-all
            duration-300
            shadow-sm
          "
        >
          <FaGoogle className="text-red-500 text-lg" />

          <span className="font-medium">
            Google
          </span>

        </button>

        {/* Facebook */}

        <button
          onClick={handleFacebookLogin}
          className="
            flex
            items-center
            justify-center
            gap-3
            py-3
            rounded-xl
            border
            border-gray-300
            bg-white
            hover:bg-blue-50
            hover:border-blue-600
            transition-all
            duration-300
            shadow-sm
          "
        >
          <FaFacebookF className="text-blue-600 text-lg" />

          <span className="font-medium">
            Facebook
          </span>

        </button>

        {/* GitHub */}

        <button
          onClick={handleGithubLogin}
          className="
            flex
            items-center
            justify-center
            gap-3
            py-3
            rounded-xl
            border
            border-gray-300
            bg-white
            hover:bg-gray-100
            transition-all
            duration-300
            shadow-sm
          "
        >
          <FaGithub className="text-black text-lg" />

          <span className="font-medium">
            GitHub
          </span>

        </button>

        {/* Microsoft */}

        <button
          onClick={handleMicrosoftLogin}
          className="
            flex
            items-center
            justify-center
            gap-3
            py-3
            rounded-xl
            border
            border-gray-300
            bg-white
            hover:bg-green-50
            hover:border-green-600
            transition-all
            duration-300
            shadow-sm
          "
        >
          <FaMicrosoft className="text-green-600 text-lg" />

          <span className="font-medium">
            Microsoft
          </span>

        </button>

      </div>

    </div>
  );
};

export default SocialLogin;