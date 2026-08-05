
import RegisterForm from "../../components/auth/RegisterForm";


const Register = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-amber-50 to-orange-100 flex flex-col">

      <div className="max-w-7xl mx-auto px-5 py-4 lg:py-6 w-full flex-1 flex flex-col">

     

        <div className="flex-1 flex items-center justify-center py-6">
          <RegisterForm />
        </div>

      

      </div>

    </div>
  );
};

export default Register;