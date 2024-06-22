import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import { useRegisterMutation } from "../../redux/api/usersApiSlice";

const Register = () => {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);
  
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";
  
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);
  
  const submitHandler = async (e) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else if (!email && !mobile) {
      toast.error("Please provide either an email address or a mobile number");
    } else {
      try {
        const res = await register({ username, email, mobile, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
        toast.success("User successfully registered");
      } catch (err) {
        console.log(err);
        toast.error(err.data.message);
      }
    }
  };

  return (
    <section className="px-4 sm:px-10 flex flex-wrap">
      <div className="mx-auto mt-10 sm:mt-20">
        <h1 className="text-2xl font-semibold mb-4">Register</h1>
        <form onSubmit={submitHandler} className="w-full sm:w-96">
          <div className="my-4">
            <label htmlFor="name" className="block text-sm font-medium text-white">Name</label>
            <input
              type="text"
              id="name"
              className="mt-1 p-2 border rounded w-full"
              placeholder="Enter name"
              value={username}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="my-4">
            <label htmlFor="email" className="block text-sm font-medium text-white">Email Address</label>
            <input
              type="email"
              id="email"
              className="mt-1 p-2 border rounded w-full"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="my-4">
            <label htmlFor="mobile" className="block text-sm font-medium text-white">Mobile Number</label>
            <input
              type="tel"
              id="mobile"
              className="mt-1 p-2 border rounded w-full"
              placeholder="Enter mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>
          <div className="my-4">
            <label htmlFor="password" className="block text-sm font-medium text-white">Password</label>
            <input
              type="password"
              id="password"
              className="mt-1 p-2 border rounded w-full"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="my-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              className="mt-1 p-2 border rounded w-full"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button
            disabled={isLoading}
            type="submit"
            className="bg-pink-500 text-white px-4 py-2 rounded cursor-pointer my-4 w-full sm:w-auto"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
          {isLoading && <Loader />}
        </form>
        <div className="mt-4">
          <p className="text-white">
            Already have an account?{" "}
            <Link to={redirect ? `/login?redirect=${redirect}` : "/login"} className="text-pink-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Register;
