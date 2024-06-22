import React from "react";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetOrdersQuery,useMarkOrderAsPaidMutation, useDeliverOrderMutation } from "../../redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";

const OrderList = () => {
  const { data: orders, isLoading, error, refetch } = useGetOrdersQuery();
  const [markAsPaid, { isLoading: isPaying }] = useMarkOrderAsPaidMutation();
  const [deliverOrder, { isLoading: isDelivering }] = useDeliverOrderMutation(); // Ensure proper hook usage
  const markAsPaidHandler = async (orderId) => {
    try {
      await markAsPaid(orderId);
      console.log('Order marked as paid successfully');
      refetch(); // Refetch orders after marking as paid
    } catch (error) {
      console.error('Failed to mark order as paid:', error);
    }
  };
  const markAsDelivered = async (orderId) => {
    try {
      // Call the mutation to mark the order as delivered
      await deliverOrder(orderId); // Call the mutation with the orderId
      console.log("Order marked as delivered successfully");

      // Trigger a re-fetch of the orders data to update the UI
      refetch();
    } catch (error) {
      console.error("Failed to mark order as delivered:", error);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <table className="container ml-20 mx-auto">
          <AdminMenu />

          <thead className="w-full border">
            <tr className="mb-[5rem]">
              <th className="text-left pl-1">ITEMS</th>
              <th className="text-left pl-1">ID</th>
              <th className="text-left pl-1">USER</th>
              <th className="text-left pl-1">DATE</th>
              <th className="text-left pl-1">TOTAL</th>
              <th className="text-left pl-1">PAID</th>
              <th className="text-left pl-1">DELIVERED</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>
                  <img
                    src={order.orderItems[0].image}
                    alt={order._id}
                    className="w-[5rem] pt-4"
                  />
                </td>
                <td>{order._id}</td>
                <td>{order.user ? order.user.username : "N/A"}</td>
                <td>{order.createdAt ? order.createdAt.substring(0, 10) : "N/A"}</td>
                <td>₹ {order.totalPrice}</td>
                <td className="py-2">
                  {order.isPaid ? (
                    <p className="p-1 text-center bg-green-400 w-[6rem] rounded-full">
                      Completed
                    </p>
                  ) : (
                    <button
                      className={`p-1 text-center bg-red-400 w-[6rem] rounded-full ${isPaying ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => markAsPaidHandler(order._id)}
                      disabled={isPaying}
                    >
                      Mark Paid
                    </button>
                  )}
                </td>
                <td className="px-2 py-2">
                  {order.isDelivered ? (
                    <p className="p-1 text-center bg-green-400 w-[6rem] rounded-full">
                      Completed
                    </p>
                  ) : (
                    <button
                      className="p-1 text-center bg-red-400 w-[6rem] rounded-full"
                      onClick={() => markAsDelivered(order._id)}
                    >
                      Mark Delivered
                    </button>
                  )}
                </td>
                <td>
                  <Link to={`/order/${order._id}`}>
                    <button>More</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default OrderList;
