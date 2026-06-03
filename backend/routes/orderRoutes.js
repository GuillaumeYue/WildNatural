const express = require('express');
const router = express.Router();

const {
  addOrderItems,
  getOrders,
  getOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
  deleteOrder,
} = require('../Controllers/orderController');

const { protect, adminOnly } = require('../middleware/authMiddleware');

// USER ROUTE
router.route('/').post(protect, addOrderItems);

// ADMIN ROUTES
router.route('/admin').get(protect, adminOnly, getOrders);

router
  .route('/admin/:id')
  .get(protect, adminOnly, getOrderById)
  .delete(protect, adminOnly, deleteOrder);

router
  .route('/admin/:id/pay')
  .put(protect, adminOnly, markOrderAsPaid);

router
  .route('/admin/:id/deliver')
  .put(protect, adminOnly, markOrderAsDelivered);

module.exports = router;