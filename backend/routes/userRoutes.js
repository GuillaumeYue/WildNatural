const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  updateUserByAdmin,
  deleteUser,
} = require('../Controllers/userController');

const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);

router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// ADMIN CUSTOMER CRUD
router.route('/').get(protect, adminOnly, getUsers);

router
  .route('/:id')
  .get(protect, adminOnly, getUserById)
  .put(protect, adminOnly, updateUserByAdmin)
  .delete(protect, adminOnly, deleteUser);

module.exports = router;