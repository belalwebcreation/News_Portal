import AuthHeader from "../../components/auth/AuthHeader";
import RegisterForm from "../../components/auth/RegisterForm";
import AuthFooter from "../../components/auth/AuthFooter";

const Register = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-amber-50 to-orange-100 flex flex-col">

      <div className="max-w-7xl mx-auto px-5 py-4 lg:py-6 w-full flex-1 flex flex-col">

        <AuthHeader />

        <div className="flex-1 flex items-center justify-center py-6">
          <RegisterForm />
        </div>

        <AuthFooter />

      </div>

    </div>
  );
};

export default Register;