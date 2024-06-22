import { ToastContainer } from "react-toastify";
import { Outlet } from "react-router-dom";
import Navigation from "./pages/Auth/Navigation";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

// axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
// axios.defaults.withCredentials = true;

function App() {
  return (
    <>
      <ToastContainer />
      <Navigation />
      <main className="py-3">
        <Outlet />
      </main>
    </>
  );
}

export default App;
