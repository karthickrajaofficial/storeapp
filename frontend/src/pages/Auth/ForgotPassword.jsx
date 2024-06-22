import { useState } from "react";
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
        <div>
            <section className="pl-[10rem] flex flex-wrap">
                <div className="mr-[4rem] mt-[5rem]">
                    <h1 className="text-2xl font-semibold mb-4">Forgot Password</h1>
                    <form onSubmit={submitHandler} className="container w-[40rem]">
                        <div className="my-[2rem]">
                            <label htmlFor="email" className="block text-sm font-medium">Email Address</label>
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
                            className="bg-pink-500 text-white px-4 py-2 rounded cursor-pointer my-[1rem]"
                        >
                            {isLoading ? "Sending..." : "Send Reset Link"}
                        </button>
                        {isLoading && <Loader />}
                    </form>
                </div>
            </section>
        </div>
    );
};

export default ForgotPassword;
