const express = require('express');
const router = express.Router();

const {
  createCustomization,
  getAllCustomizations,
  getCustomizationById,
  updateCustomizationStatus,
  deleteCustomization,
} = require('../Controllers/customizationController');

const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public/front-end form submit
router.post('/', createCustomization);

// Admin routes
router.get('/admin', protect, adminOnly, getAllCustomizations);

router
  .route('/:id')
  .get(protect, adminOnly, getCustomizationById)
  .delete(protect, adminOnly, deleteCustomization);

router.put('/:id/status', protect, adminOnly, updateCustomizationStatus);

module.exports = router;