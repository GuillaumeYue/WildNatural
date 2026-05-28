const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// The path here is relative to '/api/auth' in server.js
router.post('/register', registerUser); // MUST BE '/register'
router.post('/login', loginUser);

module.exports = router;