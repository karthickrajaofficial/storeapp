import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
} from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";

const Order = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const [whatsappMessage, setWhatsappMessage] = useState("");

  useEffect(() => {
    if (order) {
      const message = `Hello, I have a question about my order ${orderId}. Here are the details:\n\n`;
      const orderDetails = [
        `Order ID: ${order._id}`,
        `Name: ${order.user.username}`,
        `Email: ${order.user.email}`,
        `Address: ${order.shippingAddress.address}, ${order.shippingAddress.city} ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`,
        `Payment Method: ${order.paymentMethod}`,
        `Items Price: ₹ ${order.itemsPrice}`,
        `Shipping Price: ₹ ${order.shippingPrice}`,
        `Total Price: ₹ ${order.totalPrice}`,
        `Is Paid: ${order.isPaid ? 'Yes' : 'No'}`,
        `Is Delivered: ${order.isDelivered ? 'Yes' : 'No'}`
      ];

      const fullMessage = message + orderDetails.join("\n");
      setWhatsappMessage(fullMessage);
    }
  }, [order, orderId]);

  const handleWhatsAppClick = () => {
    const phoneNumber = "919360988787"; // Replace with the recipient's phone number in international format
    const encodedMessage = encodeURIComponent(whatsappMessage);

    console.log(`Encoded WhatsApp Message: ${encodedMessage}`); // Debug log to check the message encoding

    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(url, "_blank");

    // Clear the cart
    dispatch(clearCartItems());

    // Redirect to home
    navigate("/");
  };

  const dateOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  };

  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success("Order marked as delivered successfully.");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to mark order as delivered. Please try again later."
      );
    }
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error.data.message}</Message>
  ) : (
    <div className="container flex flex-col ml-[2rem] mt-[2rem] md:flex-row">
      <Link
        to="/placeorder"
        className="text-pink-900 font-semibold hover:underline mb-10 mt-2"
      >
        ⬅️ Go Back
      </Link>
      <div className="md:w-2/3 pr-4">
        <div className="border gray-300 mt-5 pb-4 mb-5">
          {order.orderItems.length === 0 ? (
            <Message>Order is empty</Message>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full md:w-[80%]">
                <thead className="border-b-2">
                  <tr>
                    <th className="p-2">Image</th>
                    <th className="p-2">Product</th>
                    <th className="p-2 text-center">Quantity</th>
                    <th className="p-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderItems.map((item, index) => (
                    <tr key={index}>
                      <td className="p-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover"
                        />
                      </td>
                      <td className="p-2">
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </td>
                      <td className="p-2 text-center">{item.qty}</td>
                      <td className="p-2 text-center">
                        ₹ {(item.qty * item.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <div className="md:w-1/3">
        <div className="mt-5 border-gray-300 pb-4 mb-4">
          <h2 className="text-xl font-bold mb-2">Shipping</h2>
          <p className="mb-4 mt-4">
            <strong className="text-pink-500">Order:</strong> {order._id}
          </p>
          <p className="mb-4">
            <strong className="text-pink-500">Name:</strong> {order.user.username}
          </p>
          <p className="mb-4">
            <strong className="text-pink-500">Email:</strong> {order.user.email}
          </p>
          <p className="mb-4">
            <strong className="text-pink-500">Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.postalCode}, {order.shippingAddress.country}
          </p>
          <p className="mb-4">
            <strong className="text-pink-500">Method:</strong> {order.paymentMethod}
          </p>
         
          <div>
            <button
              onClick={handleWhatsAppClick}
              className="mt-4 bg-green-500 text-white w-full mb-20 border-black"
            >
              Pay via WhatsApp
            </button>
          </div>
       
          <div className="mb-4">
          {order.isPaid ? (
              <Message variant="success">
                Paid on {order.paidAt ? new Date(order.paidAt).toLocaleDateString('en-US', dateOptions) : 'Whatsapp'}
              </Message>
            ) : (
              <Message variant="danger">Not paid</Message>
            )}
          </div>
          <div className="mb-4">
            {order.isDelivered ? (
              <Message variant="success">
                Delivered on {new Date(order.deliveredAt).toLocaleDateString('en-US', dateOptions)}
              </Message>
            ) : (
              <Message variant="danger">Not delivered</Message>
            )}
          </div>
        </div>
        <h2 className="text-xl font-bold mb-2 mt-[3rem]">Order Summary</h2>
        <div className="flex justify-between mb-2">
          <span>Items</span>
          <span>₹ {order.itemsPrice}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Shipping</span>
          <span>₹ {order.shippingPrice}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Total</span>
          <span>₹ {order.totalPrice}</span>
        </div>
        {!order.isPaid && (
          <div>
            <button
              onClick={handleWhatsAppClick}
              className="mt-4 bg-green-500 text-white w-full mb-20 border-black"
            >
              Contact via WhatsApp
            </button>
          </div>
        )}
        {loadingDeliver && <Loader />}
        {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
          <div>
            <button
              type="button"
              className="bg-pink-500 text-white w-full py-2"
              onClick={deliverHandler}
            >
              Mark As Delivered
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
