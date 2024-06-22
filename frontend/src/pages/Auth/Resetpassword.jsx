import { useState } from "react";
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
        <div>
            <section className="pl-[10rem] flex flex-wrap">
                <div className="mr-[4rem] mt-[5rem]">
                    <h1 className="text-2xl font-semibold mb-4">Reset Password</h1>
                    <form onSubmit={submitHandler} className="container w-[40rem]">
                        <div className="my-[2rem]">
                            <label htmlFor="password" className="block text-sm font-medium">New Password</label>
                            <input
                                type="password"
                                id="password"
                                className="mt-1 p-2 border rounded w-full"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="my-[2rem]">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                className="mt-1 p-2 border rounded w-full"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <button
                            disabled={isLoading}
                            type="submit"
                            className="bg-pink-500 text-white px-4 py-2 rounded cursor-pointer my-[1rem]"
                        >
                            {isLoading ? "Resetting..." : "Reset Password"}
                        </button>
                        {isLoading && <Loader />}
                    </form>
                </div>
            </section>
        </div>
    );
};

export default ResetPassword;
