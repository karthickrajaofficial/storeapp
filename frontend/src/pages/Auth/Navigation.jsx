import { useState, useRef, useEffect } from "react";
import { AiOutlineHome, AiOutlineUser, AiOutlineShopping, AiOutlineLogin, AiOutlineUserAdd, AiOutlineShoppingCart } from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import FavoritesCount from "../Products/FavoritesCount";
import logoImage from "../../assets/logo.png"; // Adjust the path to match your project structure
import "./Navigation.css"; // Import your CSS file

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Example breakpoint for mobile devices

  const [logoutApiCall] = useLogoutMutation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust the breakpoint as needed
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const closeDropdown = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", closeDropdown);

    return () => {
      document.removeEventListener("mousedown", closeDropdown);
    };
  }, []);

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const getCartCount = (cartItems) => cartItems.reduce((a, c) => a + c.qty, 0);
  const cartLabel = ` (${getCartCount(cartItems)})`;

  const NavLink = ({ to, icon, label, children }) => (
    <Link to={to} className="nav-link flex items-center py-3 px-4 text-pink-600">
      <span className="mr-2">{icon}</span>
      {!isMobile && <span>{label}</span>}
      {isMobile && label === cartLabel && <span>{label}</span>}
      {children}
    </Link>
  );

  const Logo = () => (
    <a href="/" className={`logo ${isMobile ? "fixed top-0 left-0 w-full bg-pink-200 h-10 flex items-center justify-center z-50" : "hidden"}`}>
      <img src={logoImage} alt="Logo" className="h-10 md:h-16 lg:h-20 mr-2" />
      <span className="text-pink-900  font-poppins text-xl md:text-xl lg:text-2xl ">
        Jewel By Shree
      </span>{" "}
      {/* Adjust font size and family as needed */}
    </a>
  );

  return (
    <nav className={`bg-pink-200 text-pink-600 shadow-lg fixed w-full z-50 ${isMobile ? "bottom-0" : "top-0"}`}>
      <div className="container mx-auto flex justify-between items-center px-4 py-1">
        <div className="flex items-center">
          <Logo /> {/* Render the logo component */}
          <div className="hidden md:flex items-center">
            <a href="/">
              <div className=" rounded-md p-2 flex items-center">
                <img src={logoImage} alt="Logo" className="h-10 md:h-10 lg:h-10 mr-2" />
                <div>
                  <p className="text-xl font-serif text-pink-500 font-bold ">
                    Jewel by{" "}
                    <span className="font-semibold font-poppins text-pink-500">
                      Shree
                    </span>
                    <span className="ml-1"> </span>
                  </p>
                </div>
              </div>
            </a>
          </div>
          {userInfo && (
            <div ref={dropdownRef} className={`dropdown-menu ${dropdownOpen ? "open" : ""} ${isMobile ? "dropdown-mobile" : "dropdown-desktop"}`}>
              {userInfo.isAdmin && (
                <>
                  <Link to="/admin/dashboard">Dashboard</Link>
                  <Link to="/admin/productlist">Products</Link>
                  <Link to="/admin/categorylist">Category</Link>
                  <Link to="/admin/orderlist">Orders</Link>
                  <Link to="/admin/userlist">Users</Link>
                </>
              )}
              <Link to="/profile" className="block text-pink-600 hover:text-pink-800 py-2 px-4">Profile</Link>
              <button onClick={logoutHandler} className="block text-pink-600 hover:text-pink-800 py-2 px-4">Logout</button>
            </div>
          )}
        </div>
        <div className="flex items-center text-bold font-poppins ">
          <NavLink to="/" icon={<AiOutlineHome size={24} />} label="HOME" />
          <NavLink to="/favorite" icon={<FaHeart size={24} />} label="Favorites">
            <FavoritesCount />
          </NavLink>
          <NavLink to="/shop" icon={<AiOutlineShopping size={24} />} label="SHOP" />
          <NavLink to="/cart" icon={<AiOutlineShoppingCart size={24} />} label={cartLabel} />
          {userInfo && (
            <div className="mr-2 flex items-center">
              <button className="user-icon-button flex items-center" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <AiOutlineUser style={{ color: "pink-600", fontSize: "24px" }} />
                <span className="ml-2 text-pink-600">{userInfo.username}</span>
              </button>
            </div>
          )}
          {!userInfo && (
            <div className="ml-4 flex items-center">
              <NavLink to="/login" icon={<AiOutlineLogin size={24} />} label="LOGIN" />
              <NavLink to="/register" icon={<AiOutlineUserAdd size={24} />} label="REGISTER" />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
