const express = require('express');
const router = express.Router();

const {
  getPromoCodes,
  createPromoCode,
  updatePromoCode,
  deletePromoCode,
} = require('../Controllers/promoCodeController');

const { protect, adminOnly } = require('../middleware/authMiddleware');

router
  .route('/')
  .get(protect, adminOnly, getPromoCodes)
  .post(protect, adminOnly, createPromoCode);

router
  .route('/:id')
  .put(protect, adminOnly, updatePromoCode)
  .delete(protect, adminOnly, deletePromoCode);

module.exports = router;