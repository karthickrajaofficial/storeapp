import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { useResetPasswordMutation } from "../../redux/api/usersApiSlice";
import { useParams } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { token } = useParams();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const res = await resetPassword({ token, password }).unwrap();
      toast.success(res.message);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-pink-500 to-purple-500 animate-bg-gradient">
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-center mb-4">Reset Password</h1>
        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              New Password
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
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="mt-1 p-2 border rounded w-full"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            disabled={isLoading}
            type="submit"
            className="bg-pink-600 text-white px-4 py-2 rounded w-full hover:shadow-lg transition-shadow duration-300"
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
          {isLoading && <Loader />}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
