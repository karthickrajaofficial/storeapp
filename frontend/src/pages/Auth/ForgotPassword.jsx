import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { useForgotPasswordMutation } from "../../redux/api/usersApiSlice";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [forgotPassword] = useForgotPasswordMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await forgotPassword({ email }).unwrap();
      toast.success(res.message);
    } catch (err) {
      toast.error(err?.data?.message || "An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-pink-500 to-purple-500 animate-bg-gradient">
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-center mb-4">Forgot Password</h1>
        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 p-2 border rounded w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            disabled={isLoading}
            type="submit"
            className="bg-pink-600 text-white px-4 py-2 rounded w-full hover:shadow-lg transition-shadow duration-300"
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
          {isLoading && <Loader />}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
