import asyncHandler from "../middlewares/asyncHandler.js";
import User from "../models/userModels.js";
import pkg from 'bcryptjs';
import createToken from '../utils/createToken.js';
import sendEmail from '../utils/sendEmail.js';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
const bcrypt = pkg;
const createUser = asyncHandler(async (req, res) => {
  const { username, email, mobile, password } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  // Validate mobile format (example: 10-digit number)
  const mobileRegex = /^\d{10}$/;
  if (!mobileRegex.test(mobile)) {
    return res.status(400).json({ message: "Invalid mobile format" });
  }

  try {
    if (!username || !email || !mobile || !password) {
      throw new Error("Please fill in all the inputs");
    }

    const userExists = await User.findOne({ $or: [{ email }, { mobile }] });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, mobile, password: hashedPassword });

    await newUser.save();
    createToken(res, newUser._id);

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      mobile: newUser.mobile,
      isAdmin: newUser.isAdmin,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, mobile, password } = req.body;

  if ((!email && !mobile) || (email && mobile)) {
    return res.status(400).json({ message: "Please provide either email or mobile, but not both" });
  }

  // Find user by email or mobile number
  let existingUser;
  if (email) {
    existingUser = await User.findOne({ email });
  } else if (mobile) {
    existingUser = await User.findOne({ mobile });
  }

  if (existingUser) {
    // Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);

    if (isPasswordValid) {
      createToken(res, existingUser._id);
      // Password is correct, send user data (excluding password)
      res.status(200).json({
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        mobile: existingUser.mobile,
        isAdmin: existingUser.isAdmin,
      });
    } else {
      // Password is incorrect
      res.status(401).json({ message: "Invalid password" });
    }
  } else {
    // User not found
    res.status(404).json({ message: "User not found" });
  }
});



const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found.");
  }
});

const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.mobile = req.body.mobile || user.mobile;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      user.password = hashedPassword;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      mobile: updatedUser.mobile,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error("Cannot delete admin user");
    }

    await User.deleteOne({ _id: user._id });
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found.");
  }
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const updateUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Generate and hash reset token
  const resetToken = crypto.randomBytes(20).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // Set reset token and expiry
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();

  // Construct reset URL with fixed host and port
  const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

  // Example email message
  const message = `You requested a password reset. Please make a PUT request to:\n\n${resetUrl}`;

  try {
    // Send email (implementation of sendEmail function not shown)
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Request',
      message,
    });

    res.status(200).json({ message: 'Email sent' });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.status(500).json({ message: 'Email could not be sent' });
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const receivedToken = req.params.token;

  // Hash the received token to match with stored hashed token
  const hashedToken = crypto.createHash('sha256').update(receivedToken).digest('hex');

  // Find user with matching hashed token and valid expiry
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: 'Invalid token or token has expired' });
  }

  // Hash the new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // Update user's password and clear reset token fields
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({ message: 'Password updated successfully' });
});

export {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
  requestPasswordReset,
  resetPassword
};
