import { apiSlice } from "./apiSlice";
// import { ORDERS_URL, RAZORPAY_URL } from "../constants";
import { ORDERS_URL} from "../constants";

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL,
        method: "POST",
        body: order,
      }),
    }),

    getOrderDetails: builder.query({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}`,
      }),
    }),

    payOrder: builder.mutation({
      query: ({ orderId, details }) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: "PUT",
        body: details,
      }),
    }),

    // getPaypalClientId: builder.query({
    //   query: () => ({
    //     url: PAYPAL_URL,
    //   }),
    // }),

    getMyOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/mine`,
      }),
      keepUnusedDataFor: 5,
    }),

    getOrders: builder.query({
      query: () => ({
        url: ORDERS_URL,
      }),
    }),
    markOrderAsPaid: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/mark-paid`,
        method: 'PUT',
      }),
    }),
    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/deliver`,
        method: "PUT",
      }),
    }),

    getTotalOrders: builder.query({
      query: () => `${ORDERS_URL}/total-orders`,
    }),

    getTotalSales: builder.query({
      query: () => `${ORDERS_URL}/total-sales`,
    }),

    getTotalSalesByDate: builder.query({
      query: () => `${ORDERS_URL}/total-sales-by-date`,
    }),

    // createRazorpayOrder: builder.mutation({
    //   query: (order) => ({
    //     url: RAZORPAY_URL, // Replace RAZORPAY_URL with actual URL for creating Razorpay orders
    //     method: "POST",
    //     body: order,
    //   }),
    // }),
  }),
});

export const {
  useGetTotalOrdersQuery,
  useGetTotalSalesQuery,
  useGetTotalSalesByDateQuery,
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPaypalClientIdQuery,
  useGetMyOrdersQuery,
  useDeliverOrderMutation,
  useMarkOrderAsPaidMutation, // Ensure this line is present
  useGetOrdersQuery,
  useCreateRazorpayOrderMutation,
} = orderApiSlice;
