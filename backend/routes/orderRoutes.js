import express from "express";
const router = express.Router()

import { countTotalOrders,calculateTotalSales,markOrderAsPaid,markOrderAsPaidM,markOrderAsDelivered, createOrder,getAllOrders,getUserOrders, calcualteTotalSalesByDate, findOrderById } from "../controllers/orderController.js";
import {authenticate,authorizeAdmin} from '../middlewares/authMiddleware.js'

router.route('/').post(authenticate,createOrder)
.get(authenticate,authorizeAdmin,getAllOrders)

router.route('/mine').get(authenticate,getUserOrders)
router.route('/total-orders').get(countTotalOrders)
router.route('/total-sales').get(calculateTotalSales)
router.route('/total-sales-by-date').get(calcualteTotalSalesByDate)
router.route("/:id").get(authenticate, findOrderById);
router.route("/:id/pay").put(authenticate, markOrderAsPaid);
router.route("/:id/mark-paid").put(authenticate, authorizeAdmin, markOrderAsPaidM);
router
  .route("/:id/deliver")
  .put(authenticate, authorizeAdmin, markOrderAsDelivered);

 
  
  

export default router;