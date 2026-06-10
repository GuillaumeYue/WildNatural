const express = require('express');
const router = express.Router();

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../Controllers/productController');

const { protect, adminOnly } = require('../middleware/authMiddleware');

// /api/products
router
  .route('/')
  .get(getProducts)
  .post(protect, adminOnly, createProduct);

// /api/products/:id
router
  .route('/:id')
  .get(getProductById)
  .put(protect, adminOnly, updateProduct)
  .delete(protect, adminOnly, deleteProduct);

module.exports = router;
