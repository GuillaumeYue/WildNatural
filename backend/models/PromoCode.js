const mongoose = require('mongoose');

const promoCodeSchema = mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ['percent', 'amount', 'free_shipping'],
      required: true,
    },

    value: {
      type: Number,
      default: 0,
    },

    expiresAt: {
      type: Date,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    usedCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PromoCode', promoCodeSchema);