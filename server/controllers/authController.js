import crypto from 'crypto';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';
import bcrypt from "bcryptjs";

/* ============================
    REGISTER USER
=============================*/
export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      monthlySalary,
      currencyPreference,
      languagePreference,
    } = req.body;

    // Check for existing user
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      monthlySalary: monthlySalary || 0,
      currencyPreference: currencyPreference || "INR",
      languagePreference: languagePreference || "en",
    });

    // Generate JWT
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        monthlySalary: user.monthlySalary,
        currencyPreference: user.currencyPreference,
        languagePreference: user.languagePreference,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

/* ============================
    LOGIN USER
=============================*/
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Get user + password
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if password exists (it should be selected by +password)
    if (!user.password) {
      console.error(`Login error: User ${email} found but has no password hash.`);
      return res.status(500).json({
        success: false,
        message: "Account data error. Please contact support.",
      });
    }

    // Compare password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT
    const token = generateToken(user._id);
    user.password = undefined;

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        monthlySalary: user.monthlySalary,
        currencyPreference: user.currencyPreference,
        languagePreference: user.languagePreference,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

/* ============================
    GET LOGGED-IN USER
=============================*/
export const getMe = async (req, res) => {
  try {
    // user is attached by middleware (protect)
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: user,
    });
  } catch (error) {
    console.error("Get user profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching user profile",
    });
  }
};

/* ============================
    FORGOT PASSWORD
=============================*/
export const forgotPassword = async (req, res) => {
  try {
    console.log('Forgot password request received:', req.body);
    const { email } = req.body;

    if (!email) {
      console.log('No email provided');
      return res.status(400).json({
        success: false,
        message: "Please provide an email address",
      });
    }

    // Check user
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user doesn't exist for security
      console.log('No user found with email:', email);
      return res.status(200).json({
        success: true,
        message: "If an account with that email exists, a reset link has been sent",
      });
    }

    // Create raw token
    const resetToken = crypto.randomBytes(32).toString("hex");
    console.log('Generated reset token for user:', user.email);

    // Hash token (never store raw token)
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();
    console.log('Reset token saved for user:', user.email);

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
    console.log('Reset URL:', resetUrl);

    const message = `You requested a password reset.\n\nClick this link to reset your password:\n${resetUrl}\n\nThis link will expire in 10 minutes.\n\nIf you did NOT request this, please ignore this email.`;

    console.log('Sending reset email to:', user.email);
    await sendEmail(user.email, "Password Reset Link", message);
    console.log('Reset email sent successfully to:', user.email);

    res.status(200).json({
      success: true,
      message: "Password reset email sent",
    });
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing password reset request',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/* ============================
    RESET PASSWORD
=============================*/
export const resetPassword = async (req, res) => {
  try {
    console.log('Reset password request received');
    const { token } = req.params;
    const { password } = req.body;

    if (!token) {
      console.log('No reset token provided');
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token',
      });
    }

    if (!password) {
      console.log('No new password provided');
      return res.status(400).json({
        success: false,
        message: 'Please provide a new password',
      });
    }

    // Hash provided token to check match
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    console.log('Looking for user with token:', hashedToken);

    // Find user with token and valid expiry
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }, // not expired
    });

    if (!user) {
      console.log('Invalid or expired reset token');
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token',
      });
    }

    console.log('User found, updating password for:', user.email);

    // Update password with hashing
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    console.log('Password updated successfully for user:', user.email);

    // Send confirmation email
    try {
      const message = `Your password has been successfully reset.\n\n` +
        `If you did not make this change, please contact support immediately.`;

      await sendEmail(user.email, 'Password Reset Confirmation', message);
      console.log('Password reset confirmation email sent to:', user.email);
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Don't fail the request if email sending fails
    }

    res.status(200).json({
      success: true,
      message: 'Password has been updated successfully',
    });
  } catch (error) {
    console.error('Error in resetPassword:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting password',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
