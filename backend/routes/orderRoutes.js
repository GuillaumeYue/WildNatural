const express = require('express');
const router = express.Router();
const { addOrderItems } = require('../controllers/orderController');

// Bring in the security guard! You must be logged in to place an order.
const { protect } = require('../middleware/authMiddleware');

// POST request to create an order
router.route('/').post(protect, addOrderItems);

module.exports = router;