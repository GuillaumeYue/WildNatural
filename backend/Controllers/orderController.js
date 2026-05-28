const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (User must be logged in)
exports.addOrderItems = async (req, res) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items found' });
        } else {
            const order = new Order({
                orderItems,
                user: req.user._id, // This comes from our 'protect' middleware!
                shippingAddress,
                paymentMethod,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
            });

            const createdOrder = await order.save();
            res.status(201).json(createdOrder);
        }
    } catch (error) {
        console.error('❌ Order Creation Error:', error.message);
        res.status(500).json({ message: 'Server Error creating order' });
    }
};