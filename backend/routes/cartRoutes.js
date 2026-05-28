const express = require('express');
const router = express.Router();
const { getUserCart, addToCart, removeFromCart } = require('../controllers/cartController');

// Import the security middleware
const { protect } = require('../middleware/authMiddleware');

// Base Route: /api/cart
router.route('/')
    .get(protect, getUserCart)   // View Cart
    .post(protect, addToCart);   // Add to Cart

// Delete Route: /api/cart/:productId
router.route('/:productId')
    .delete(protect, removeFromCart); // Remove specific item

module.exports = router;