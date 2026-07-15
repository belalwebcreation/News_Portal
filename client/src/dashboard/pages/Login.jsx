import AuthHeader from "../components/auth/AuthHeader";
import LoginForm from "../components/auth/LoginForm";
import AuthFooter from "../components/auth/AuthFooter";


const Login = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 via-amber-50 to-orange-100 flex flex-col">

      <div className="max-w-7xl mx-auto px-5 py-4 lg:py-6 w-full flex-1 flex flex-col">

        {/* Header */}
        <AuthHeader />

        {/* Main Content */}
        <div className="mt-4 lg:mt-6 grid lg:grid-cols-2 gap-6 lg:gap-10 items-center flex-1">

          {/* Left Side */}
          <div className="hidden lg:flex flex-col justify-center">

            <span className="inline-block w-fit rounded-full bg-amber-100 text-amber-800 px-4 py-1.5 font-semibold text-sm">
              RAJSHAHI COLLEGE
            </span>

            <h1 className="mt-4 text-4xl xl:text-5xl font-black leading-tight text-slate-900">
              Welcome to
              <span className="block text-amber-700">
                Rajshahi College News Portal
              </span>
            </h1>

            <p className="mt-4 text-base xl:text-lg text-slate-600 leading-7">
              Stay connected with the latest campus news, official notices,
              events, research updates and student activities through one
              secure platform.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4">

              <div className="rounded-2xl bg-white shadow-lg p-4 xl:p-5 border">
                <h2 className="text-2xl xl:text-3xl font-black text-amber-700">
                  24/7
                </h2>
                <p className="mt-1 text-sm xl:text-base text-slate-600">
                  Online Access
                </p>
              </div>

              <div className="rounded-2xl bg-white shadow-lg p-4 xl:p-5 border">
                <h2 className="text-2xl xl:text-3xl font-black text-amber-700">
                  100%
                </h2>
                <p className="mt-1 text-sm xl:text-base text-slate-600">
                  Secure Authentication
                </p>
              </div>

              <div className="rounded-2xl bg-white shadow-lg p-4 xl:p-5 border">
                <h2 className="text-2xl xl:text-3xl font-black text-amber-700">
                  Admin
                </h2>
                <p className="mt-1 text-sm xl:text-base text-slate-600">
                  Content Management
                </p>
              </div>

              <div className="rounded-2xl bg-white shadow-lg p-4 xl:p-5 border">
                <h2 className="text-2xl xl:text-3xl font-black text-amber-700">
                  Live
                </h2>
                <p className="mt-1 text-sm xl:text-base text-slate-600">
                  Campus News Updates
                </p>
              </div>

            </div>

          </div>

          {/* Right Side */}
          <div className="flex items-center">
            <div className="w-full">
              <LoginForm />
            </div>
          </div>

        </div>

        {/* Footer */}
        <AuthFooter />

      </div>

    </div>
  );
};

export default Login;