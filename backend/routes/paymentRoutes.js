// // routes/paymentRoutes.js
// import express from 'express';
// import Razorpay from 'razorpay';
// import dotenv from 'dotenv';

// dotenv.config();

// const router = express.Router();

// router.post('/create-order', async (req, res) => {
//   const { amount, currency, receipt, notes } = req.body;
//   try {
//     // const order = await razorpay.orders.create({ amount, currency, receipt, notes });
//     res.json(order);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });
// // router.get('/razorpay-key-id', (req, res) => {
// //     const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
// //     res.json({ razorpayKeyId });
// //   });
  
// export default router;
