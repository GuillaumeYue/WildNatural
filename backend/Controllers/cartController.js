const Cart = require('../models/Cart');

// @desc    Get logged in user's cart
// @route   GET /api/cart
// @access  Private
exports.getUserCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id });
        
        // If user has no cart yet, return an empty one
        if (!cart) {
            cart = { user: req.user._id, cartItems: [] };
        }
        
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching cart' });
    }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
exports.addToCart = async (req, res) => {
    try {
        const { product, name, image, price, qty } = req.body;
        
        // Find the user's cart
        let cart = await Cart.findOne({ user: req.user._id });

        if (cart) {
            // Cart exists for user. Check if item is already in cart.
            const itemIndex = cart.cartItems.findIndex(p => p.product.toString() === product);

            if (itemIndex > -1) {
                // Item exists, update the quantity
                cart.cartItems[itemIndex].qty += qty;
            } else {
                // Item does not exist, push to array
                cart.cartItems.push({ product, name, image, price, qty });
            }
            cart = await cart.save();
            return res.status(201).json(cart);
        } else {
            // No cart for user, create a new one
            const newCart = await Cart.create({
                user: req.user._id,
                cartItems: [{ product, name, image, price, qty }]
            });
            return res.status(201).json(newCart);
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error adding to cart' });
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
exports.removeFromCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id });

        if (cart) {
            // Filter out the item we want to remove
            cart.cartItems = cart.cartItems.filter(
                item => item.product.toString() !== req.params.productId
            );
            
            await cart.save();
            res.json(cart);
        } else {
            res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error removing from cart' });
    }
};