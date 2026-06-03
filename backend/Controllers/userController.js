const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// REGISTER
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      city: user.city,
      postalCode: user.postalCode,
      languagePreference: user.languagePreference,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error registering user' });
  }
};

// LOGIN
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city,
        postalCode: user.postalCode,
        languagePreference: user.languagePreference,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error logging in' });
  }
};

// USER PROFILE
exports.getUserProfile = async (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    phone: req.user.phone,
    address: req.user.address,
    city: req.user.city,
    postalCode: req.user.postalCode,
    languagePreference: req.user.languagePreference,
    role: req.user.role,
  });
};

// UPDATE PROFILE
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.name = req.body.name ?? user.name;
    user.phone = req.body.phone ?? user.phone;
    user.address = req.body.address ?? user.address;
    user.city = req.body.city ?? user.city;
    user.postalCode = req.body.postalCode ?? user.postalCode;
    user.languagePreference =
      req.body.languagePreference ?? user.languagePreference;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      address: updatedUser.address,
      city: updatedUser.city,
      postalCode: updatedUser.postalCode,
      languagePreference: updatedUser.languagePreference,
      role: updatedUser.role,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error updating profile' });
  }
};

// ADMIN: GET ALL USERS
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching users' });
  }
};

// ADMIN: GET USER BY ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching user' });
  }
};

// ADMIN: UPDATE USER
exports.updateUserByAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = req.body.name ?? user.name;
    user.email = req.body.email ?? user.email;
    user.phone = req.body.phone ?? user.phone;
    user.address = req.body.address ?? user.address;
    user.city = req.body.city ?? user.city;
    user.postalCode = req.body.postalCode ?? user.postalCode;
    user.languagePreference =
      req.body.languagePreference ?? user.languagePreference;
    user.role = req.body.role ?? user.role;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      address: updatedUser.address,
      city: updatedUser.city,
      postalCode: updatedUser.postalCode,
      languagePreference: updatedUser.languagePreference,
      role: updatedUser.role,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error updating user' });
  }
};

// ADMIN: DELETE USER
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.deleteOne();

    res.json({ message: 'User removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error deleting user' });
  }
};