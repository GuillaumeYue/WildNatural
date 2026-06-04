const PromoCode = require('../models/PromoCode');

exports.getPromoCodes = async (req, res) => {
  try {
    const codes = await PromoCode.find({}).sort({ createdAt: -1 });
    res.json(codes);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching promo codes' });
  }
};

exports.createPromoCode = async (req, res) => {
  try {
    const { code, type, value, expiresAt, isActive } = req.body;

    const exists = await PromoCode.findOne({ code: code.toUpperCase() });

    if (exists) {
      return res.status(400).json({ message: 'Promo code already exists' });
    }

    const promo = await PromoCode.create({
      code,
      type,
      value,
      expiresAt,
      isActive,
    });

    res.status(201).json(promo);
  } catch (error) {
    res.status(500).json({ message: 'Server Error creating promo code' });
  }
};

exports.updatePromoCode = async (req, res) => {
  try {
    const promo = await PromoCode.findById(req.params.id);

    if (!promo) {
      return res.status(404).json({ message: 'Promo code not found' });
    }

    promo.code = req.body.code ?? promo.code;
    promo.type = req.body.type ?? promo.type;
    promo.value = req.body.value ?? promo.value;
    promo.expiresAt = req.body.expiresAt ?? promo.expiresAt;
    promo.isActive = req.body.isActive ?? promo.isActive;

    const updatedPromo = await promo.save();

    res.json(updatedPromo);
  } catch (error) {
    res.status(500).json({ message: 'Server Error updating promo code' });
  }
};

exports.deletePromoCode = async (req, res) => {
  try {
    const promo = await PromoCode.findById(req.params.id);

    if (!promo) {
      return res.status(404).json({ message: 'Promo code not found' });
    }

    await promo.deleteOne();

    res.json({ message: 'Promo code deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error deleting promo code' });
  }
};