// client/src/dashboard/pages/auth/VerifyEmail.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

import { baseUrl } from "../../../config/Config";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("Verifying your email...");

  const hasVerified = useRef(false);

  useEffect(() => {
    if (hasVerified.current) return;

    hasVerified.current = true;

    const verify = async () => {
      try {
        const { data } = await axios.get(
          `${baseUrl}/api/auth/verify-email/${token}`
        );

        setSuccess(true);
        setMessage(data.message);

        setTimeout(() => {
          navigate("/login");
        }, 3000);

      } catch (err) {
        setSuccess(false);

        setMessage(
          err.response?.data?.message ||
            "Email verification failed."
        );
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <Loader2
            size={60}
            className="animate-spin text-amber-700 mx-auto"
          />

          <h2 className="mt-6 text-2xl font-bold">
            Verifying Email...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-amber-50 to-orange-100 px-5">

      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">

        {success ? (
          <>
            <CheckCircle
              size={80}
              className="mx-auto text-green-600"
            />

            <h1 className="mt-6 text-3xl font-black">
              Email Verified
            </h1>

            <p className="mt-4 text-slate-600">
              {message}
            </p>

            <p className="mt-6 text-sm text-slate-500">
              Redirecting to Login...
            </p>
          </>
        ) : (
          <>
            <XCircle
              size={80}
              className="mx-auto text-red-600"
            />

            <h1 className="mt-6 text-3xl font-black">
              Verification Failed
            </h1>

            <p className="mt-4 text-slate-600">
              {message}
            </p>
          </>
        )}

      </div>

    </div>
  );
};

export default VerifyEmail;