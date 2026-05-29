const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.createCheckoutSession = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No cart items' });
    }

    const line_items = items.map((item) => ({
      price_data: {
        currency: 'cad',
        product_data: {
          name: item.name,
          images: item.image?.startsWith('http') ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.qty,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      success_url: `${process.env.CLIENT_URL}/order-confirmation?success=true`,
      cancel_url: `${process.env.CLIENT_URL}/checkout?canceled=true`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe Checkout Error:', error.message);
    res.status(500).json({ message: 'Stripe checkout failed' });
  }
};