import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";

const Login = () => {
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login] = useLoginMutation();

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    // Check if userInfo already exists in localStorage
    const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (storedUserInfo) {
      dispatch(setCredentials(storedUserInfo));
      navigate(redirect);
    }
  }, [dispatch, navigate, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();

    // Basic form validation
    if (!emailOrMobile || !password) {
      toast.error("Please enter email or mobile and password.");
      return;
    }

    // Determine if the input is an email or mobile number
    const isEmail = emailOrMobile.includes("@");
    const isMobile = /^\d+$/.test(emailOrMobile);

    if (!isEmail && !isMobile) {
      toast.error("Invalid email or mobile format.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await login({
        email: isEmail ? emailOrMobile : undefined,
        mobile: isMobile ? emailOrMobile : undefined,
        password
      }).unwrap();
      // Store user data in localStorage for session persistence
      localStorage.setItem("userInfo", JSON.stringify(res));
      dispatch(setCredentials(res));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-pink-500 to-purple-500 animate-bg-gradient">
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-center mb-4">Sign In</h1>
        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label htmlFor="emailOrMobile" className="block text-sm font-medium text-gray-700">
              Email Address or Mobile Number
            </label>
            <input
              type="text"
              id="emailOrMobile"
              className="mt-1 p-2 border rounded w-full"
              value={emailOrMobile}
              onChange={(e) => setEmailOrMobile(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 p-2 border rounded w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            disabled={isLoading}
            type="submit"
            className="bg-pink-600 text-white px-4 py-2 rounded w-full hover:shadow-lg transition-shadow duration-300"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
          {isLoading && <Loader />} {/* Show loader while waiting for login response */}
        </form>
        <div className="mt-4 text-center">
          <p className="text-gray-700">
            New Customer?{" "}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
              className="text-pink-700 hover:underline"
            >
              Register
            </Link>
          </p>
          <p className="text-gray-700">
            Forgot your password?{" "}
            <Link
              to={redirect ? `/forgot-password?redirect=${redirect}` : "/forgot-password"}
              className="text-pink-700 hover:underline"
            >
              Reset Password
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
