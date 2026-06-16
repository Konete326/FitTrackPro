const User = require('../Models/User_Model');
const Notification = require('../Models/Notification_Model');
const { uploadToCloudinary, deleteFromCloudinary } = require('../Utils/Cloudinary');
const { sendTokenResponse } = require('../Utils/Token');
const crypto = require('crypto');

const registration = async (req, res, next) => {
  try {
    const { Username, Email, Password, Profile } = req.body;
    const existingUser = await User.findOne({ $or: [{ Email }, { Username }] });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email or Username already exists' });
    }
    let profilePictureUrl = '';
    if (req.file) {
      profilePictureUrl = await uploadToCloudinary(req.file.buffer, 'fittrack-pro/profiles');
    }
    const user = await User.create({
      Username, Email, Password,
      Profile: { ...Profile, ProfilePicture: profilePictureUrl },
    });
    await Notification.create({
      UserId: user._id, Type: 'System', Title: 'Welcome!', Message: `Welcome to FitTrack Pro, ${Profile.Name}!`,
    });
    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { Email, Password } = req.body;
    const user = await User.findOne({ Email }).select('+Password');
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    if (!user.IsActive) return res.status(403).json({ success: false, message: 'Account has been deactivated' });
    const isMatch = await user.comparePassword(Password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    user.LastLogin = Date.now();
    await user.save({ validateBeforeSave: false });
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res) => {
  res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

const get_user = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ success: true, user: user.getSafeUser() });
  } catch (error) {
    next(error);
  }
};

const update_Profile = async (req, res, next) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      if (req.user.Profile.ProfilePicture) {
        await deleteFromCloudinary(req.user.Profile.ProfilePicture);
      }
      updateData['Profile.ProfilePicture'] = await uploadToCloudinary(req.file.buffer, 'fittrack-pro/profiles');
    }
    const user = await User.findByIdAndUpdate(req.user._id, { $set: updateData }, { new: true, runValidators: true });
    res.status(200).json({ success: true, user: user.getSafeUser() });
  } catch (error) {
    next(error);
  }
};

const Update_Password = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+Password');
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    user.Password = newPassword;
    await user.save();
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

const Forgot_Password = async (req, res, next) => {
  try {
    const user = await User.findOne({ Email: req.body.Email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.ResetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.ResetPasswordExpire = Date.now() + 60 * 60 * 1000;
    await user.save({ validateBeforeSave: false });
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await Notification.create({
      UserId: user._id, Type: 'Password-Reset', Title: 'Password Reset',
      Message: `Reset your password: ${resetUrl}`, Link: resetUrl,
    });
    res.status(200).json({ success: true, message: 'Password reset link sent via notification' });
  } catch (error) {
    next(error);
  }
};

const reset_Password = async (req, res, next) => {
  try {
    const resetTokenHash = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');
    const user = await User.findOne({ ResetPasswordToken: resetTokenHash, ResetPasswordExpire: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    user.Password = req.body.Password;
    user.ResetPasswordToken = undefined;
    user.ResetPasswordExpire = undefined;
    await user.save();
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

const delete_Account = async (req, res, next) => {
  try {
    if (req.user.Profile.ProfilePicture) {
      await deleteFromCloudinary(req.user.Profile.ProfilePicture);
    }
    await User.findByIdAndUpdate(req.user._id, { IsActive: false });
    await Notification.create({
      UserId: req.user._id, Type: 'System', Title: 'Account Deactivated', Message: 'Your account has been deactivated.',
    });
    res.status(200).json({ success: true, message: 'Account deactivated successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { registration, login, logout, get_user, update_Profile, Update_Password, Forgot_Password, reset_Password, delete_Account };
