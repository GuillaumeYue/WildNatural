const Customization = require('../models/Customization');

const createCustomization = async (req, res) => {
  try {
    const customization = await Customization.create({
      ...req.body,
      user: req.user?._id || null,
    });

    res.status(201).json(customization);
  } catch (error) {
    console.error('Create customization error:', error.message);
    res.status(500).json({
      message: 'Failed to create customization request',
    });
  }
};

const getAllCustomizations = async (req, res) => {
  try {
    const customizations = await Customization.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(customizations);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch customization requests',
    });
  }
};

const getCustomizationById = async (req, res) => {
  try {
    const customization = await Customization.findById(req.params.id);

    if (!customization) {
      return res.status(404).json({
        message: 'Customization request not found',
      });
    }

    res.json(customization);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch customization request',
    });
  }
};

const updateCustomizationStatus = async (req, res) => {
  try {
    const customization = await Customization.findById(req.params.id);

    if (!customization) {
      return res.status(404).json({
        message: 'Customization request not found',
      });
    }

    customization.status = req.body.status || customization.status;

    const updatedCustomization = await customization.save();

    res.json(updatedCustomization);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update customization request',
    });
  }
};

const deleteCustomization = async (req, res) => {
  try {
    const customization = await Customization.findById(req.params.id);

    if (!customization) {
      return res.status(404).json({
        message: 'Customization request not found',
      });
    }

    await customization.deleteOne();

    res.json({
      message: 'Customization request deleted',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete customization request',
    });
  }
};

module.exports = {
  createCustomization,
  getAllCustomizations,
  getCustomizationById,
  updateCustomizationStatus,
  deleteCustomization,
};