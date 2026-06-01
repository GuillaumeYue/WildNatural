const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env BEFORE requiring routes — stripeController initialises the
// Stripe SDK at module load time and needs STRIPE_SECRET_KEY to be set.
dotenv.config();

const connectDB = require('./config/db');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
//const stripeRoutes = require('./routes/stripeRoutes');
const userRoutes = require('./routes/userRoutes');

// Initialization
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request Logger (Highly recommended for debugging)
app.use((req, res, next) => {
    console.log(`📩 ${req.method} request to ${req.url}`);
    next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes); 
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
///app.use('/api/stripe', stripeRoutes);
app.use('/api/users', userRoutes);


// Health Check Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});