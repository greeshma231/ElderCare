const express = require('express');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const { validateProfileUpdate } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/users/me
// @desc    Get current user profile
// @access  Private
router.get('/me', authenticateToken, async (req, res) => {
  try {
    console.log('🔄 Getting profile for user:', req.user.username);

    // User is already attached to req by auth middleware
    res.json({
      success: true,
      data: {
        user: req.user.toJSON()
      }
    });

  } catch (error) {
    console.error('❌ Get profile error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile'
    });
  }
});

// @route   PUT /api/users/me
// @desc    Update current user profile
// @access  Private
router.put('/me', authenticateToken, validateProfileUpdate, async (req, res) => {
  try {
    const { fullName, age, gender, primaryCaregiver } = req.body;
    
    console.log('🔄 Updating profile for user:', req.user.username);

    // Update user fields
    const updateFields = {};
    if (fullName !== undefined) updateFields.fullName = fullName;
    if (age !== undefined) updateFields.age = age;
    if (gender !== undefined) updateFields.gender = gender;
    if (primaryCaregiver !== undefined) updateFields.primaryCaregiver = primaryCaregiver;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateFields,
      { 
        new: true, // Return updated document
        runValidators: true // Run schema validators
      }
    ).select('-passwordHash');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('✅ Profile updated successfully for:', updatedUser.username);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: updatedUser.toJSON()
      }
    });

  } catch (error) {
    console.error('❌ Update profile error:', error.message);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

// @route   PUT /api/users/me/settings
// @desc    Update user settings
// @access  Private
router.put('/me/settings', authenticateToken, async (req, res) => {
  try {
    const { voiceAssistant, medicationAlerts, appointmentAlerts } = req.body;
    
    console.log('🔄 Updating settings for user:', req.user.username);

    // Build settings update object
    const settingsUpdate = {};
    if (voiceAssistant !== undefined) settingsUpdate['settings.voiceAssistant'] = voiceAssistant;
    if (medicationAlerts !== undefined) settingsUpdate['settings.medicationAlerts'] = medicationAlerts;
    if (appointmentAlerts !== undefined) settingsUpdate['settings.appointmentAlerts'] = appointmentAlerts;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      settingsUpdate,
      { new: true }
    ).select('-passwordHash');

    console.log('✅ Settings updated successfully for:', updatedUser.username);

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: {
        user: updatedUser.toJSON()
      }
    });

  } catch (error) {
    console.error('❌ Update settings error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update settings'
    });
  }
});

// @route   DELETE /api/users/me
// @desc    Deactivate user account
// @access  Private
router.delete('/me', authenticateToken, async (req, res) => {
  try {
    console.log('🔄 Deactivating account for user:', req.user.username);

    // Soft delete - just deactivate the account
    await User.findByIdAndUpdate(req.user._id, { isActive: false });

    console.log('✅ Account deactivated for:', req.user.username);

    res.json({
      success: true,
      message: 'Account deactivated successfully'
    });

  } catch (error) {
    console.error('❌ Account deactivation error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to deactivate account'
    });
  }
});

module.exports = router;