import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Route, RouterProvider, createRoutesFromElements } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import axios from "axios";
//private route
import PrivateRoute from "./components/PrivateRoute.jsx";
//Auth
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";   
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/Resetpassword.jsx";     
import Profile from "./pages/User/Profile.jsx"
import AdminRoute from "./pages/Admin/AdminRoute.jsx";
import UserList from "./pages/Admin/UserList.jsx";
import CategoryList from "./pages/Admin/CategoryList.jsx";
import ProductList from "./pages/Admin/ProductList.jsx";
import ProductUpdate from "./pages/Admin/ProductUpdate.jsx";
import AllProducts from "./pages/Admin/AllProducts.jsx";
import Home from "./pages/Home.jsx";
import Favorites from "./pages/Products/Favorites.jsx";
import ProductDetails from "./pages/Products/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import Shop from "./pages/Shop.jsx";
import Shipping from "./pages/Orders/Shipping.jsx";
import PlaceOrder from "./pages/Orders/PlaceOrder.jsx";
// import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import Order from "./pages/Orders/Order.jsx";
import UserOrder from "./pages/User/UserOrder.jsx";
import OrderList from "./pages/Admin/OrderList.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import CategoryProducts from "./pages/CategoryProducts";


const router = createBrowserRouter(
  createRoutesFromElements(
   <Route path="/" element={<App />}>
    
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route index={true} path="/" element={<Home />} />
    <Route path="/favorite" element={<Favorites />}/> 
    <Route path="/category/:id" element={<CategoryProducts />} />
    <Route path="/product/:id" element={<ProductDetails />}/> 
    <Route path="/cart" element={<Cart />}/> 
    <Route path="/shop" element={<Shop />}/> 
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/reset-password/:token" element={<ResetPassword />} />

    {/* http://localhost:5173/reset-password/213c3d8154f33cb41017891d72fd1fb0cb29a281 */}
    <Route path="" element={<PrivateRoute />}> 
    <Route path="/profile" element={<Profile />} />
    <Route path="/shipping" element={<Shipping/>} />
    <Route path="/placeorder" element={<PlaceOrder/>} />
    <Route path="/order/:id" element={<Order/>} />
    <Route path="/user-orders" element={<UserOrder/>} />
    
  </Route>
    {/* Admin routes  */}
    <Route path="/admin" element = {<AdminRoute/>}>
    <Route path="userlist" element={<UserList />} />
    <Route path="categorylist" element={<CategoryList/>} />
    <Route path="productlist" element={<ProductList/>} />
    <Route path="allproductslist" element={<AllProducts/>} />
    <Route path="orderlist" element={<OrderList/>} />

    <Route path="product/update/:_id" element={<ProductUpdate/>} />
    <Route path="dashboard" element={<AdminDashboard/>} />
    
    </Route>
  </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store = {store}>


<RouterProvider router={router} /> 

  </Provider>
 );
