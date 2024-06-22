import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

// Import routes and utility functions
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
// import paymentRoutes from './routes/paymentRoutes.js';

dotenv.config();
const port =  5000;
connectDB();
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Middleware configuration for CORS
// const allowedOrigins = ['http://localhost:5173', 'https://jewelbyshree.vercel.app'];
// app.use(cors({
//   origin: allowedOrigins,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true // Allow credentials (cookies, authorization headers, etc.)
// }));
app.use(cors({
  credentials: true,
  origin: true,
}));
// Handle OPTIONS requests
app.options('*', cors({
  origin: true ,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/orders', orderRoutes);

// Example route to fetch PayPal client ID
// Uncomment if needed
// app.get('/api/config/paypal', (req, res) => {
//   res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
// });

// Example route to fetch Razorpay key ID
// app.get('/api/config/razorpay-key-id', (req, res) => {
//   const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
//   res.json({ razorpayKeyId });
// });

// Payment routes
// app.use('/api/payment', paymentRoutes);

// Serve uploaded files
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve static files from the 'dist' directory (for frontend)
const staticPath = path.join(__dirname, "frontend", "dist");
app.use(express.static(staticPath));

// Serve the 'index.html' file for all other requests (for SPA routing)
const indexPath = path.resolve(__dirname, "frontend", "dist", "index.html");
app.get('*', (req, res) => {
  res.sendFile(indexPath);
});
// Start server
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});