const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { validateProfileUpdate, validateSettingsUpdate } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/users/me
// @desc    Get current user profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/users/me
// @desc    Update current user profile
// @access  Private
router.put('/me', auth, validateProfileUpdate, async (req, res) => {
  try {
    const { email, username, fullName, age, gender, primaryCaregiver } = req.body;

    // Check if email or username is being changed and already exists
    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }
    }

    if (username && username !== req.user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this username already exists'
        });
      }
    }

    // Update user
    const updateData = {};
    if (email) updateData.email = email;
    if (username) updateData.username = username;
    if (fullName) updateData.fullName = fullName;
    if (age !== undefined) updateData.age = age;
    if (gender) updateData.gender = gender;
    if (primaryCaregiver !== undefined) updateData.primaryCaregiver = primaryCaregiver;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `User with this ${field} already exists`
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during profile update'
    });
  }
});

// @route   PUT /api/users/me/settings
// @desc    Update user settings
// @access  Private
router.put('/me/settings', auth, validateSettingsUpdate, async (req, res) => {
  try {
    const { notifications, privacy, preferences } = req.body;

    const updateData = {};
    if (notifications) updateData['settings.notifications'] = { ...req.user.settings.notifications, ...notifications };
    if (privacy) updateData['settings.privacy'] = { ...req.user.settings.privacy, ...privacy };
    if (preferences) updateData['settings.preferences'] = { ...req.user.settings.preferences, ...preferences };

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during settings update'
    });
  }
});

// @route   DELETE /api/users/me
// @desc    Deactivate user account
// @access  Private
router.delete('/me', auth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { isActive: false });

    res.json({
      success: true,
      message: 'Account deactivated successfully'
    });
  } catch (error) {
    console.error('Deactivate account error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during account deactivation'
    });
  }
});

// @route   GET /api/users/stats
// @desc    Get user statistics (for admin or analytics)
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers,
        recentUsers
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;