const express = require('express');
const router = express.Router();
const { 
    getProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct 
} = require('../controllers/productController');

// Import your security middleware
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Base Route: /api/products
router.route('/')
    .get(getProducts)                         // Public
    .post(protect, adminOnly, createProduct); // Admin Only

// ID Route: /api/products/:id
router.route('/:id')
    .get(getProductById)                      // Public
    .put(protect, adminOnly, updateProduct)   // Admin Only
    .delete(protect, adminOnly, deleteProduct); // Admin Only

module.exports = router;