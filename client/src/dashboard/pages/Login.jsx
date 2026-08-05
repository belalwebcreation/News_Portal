import LoginForm from "../components/auth/LoginForm";

const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-amber-50 to-orange-100 flex items-center justify-center px-4">

      <div className="w-full max-w-md">
        <LoginForm />
      </div>

    </div>
  );
};

export default Login;