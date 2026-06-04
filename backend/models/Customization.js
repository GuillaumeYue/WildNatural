const mongoose = require('mongoose');

const customizationSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: String,
      required: true,
    },

    address: {
      postalCode: { type: String, required: true },
      province: { type: String, required: true },
      city: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String, default: '' },
      country: { type: String, default: 'Canada' },
    },

    ingredients: {
      type: [String],
      default: [],
    },

    preferredDates: {
      type: [String],
      required: true,
    },

    preferredTimes: {
      type: [[String]],
      required: true,
    },

    hasAllergies: {
      type: String,
      enum: ['yes', 'no'],
      required: true,
    },

    allergyDescription: {
      type: String,
      default: '',
    },

    status: {
      type: String,
      enum: ['new', 'progress', 'done', 'cancelled'],
      default: 'new',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Customization', customizationSchema);