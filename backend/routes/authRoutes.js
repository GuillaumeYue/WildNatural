const express = require('express');
const router = express.Router();
// Destructure the exact names from the controller
const { register, login } = require('../controllers/authController');

// Check that these variables (register, login) are not undefined
router.post('/register', register);
router.post('/login', login);

module.exports = router;