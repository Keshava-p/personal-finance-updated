import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes - require JWT
export const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');
      req.userId = req.user._id;

      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Role-based authorization
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

// For backward compatibility
export const authenticate = async (req, res, next) => {
  try {
    // First try JWT authentication
    const token = req.headers.authorization?.split(' ')[1];
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = user;
        req.userId = user._id;
        return next();
      }
    }
    
    // Fallback to legacy authentication
    const userIdOrEmail = req.headers['x-user-id'] || req.body.userId;
    
    if (!userIdOrEmail) {
      // Create or get default test user (for development only)
      if (process.env.NODE_ENV === 'development') {
        let user = await User.findOne({ email: 'test@example.com' });
        if (!user) {
          user = await User.create({
            name: 'Test User',
            email: 'test@example.com',
            monthlySalary: 50000,
            currencyPreference: 'INR',
            languagePreference: 'en',
          });
        }
        req.userId = user._id.toString();
        req.user = user;
        return next();
      }
      return res.status(401).json({ message: 'Not authorized, no token or user ID provided' });
    }

    // Handle existing user ID or email
    if (userIdOrEmail.includes('@')) {
      const user = await User.findOne({ email: userIdOrEmail });
      if (user) {
        req.userId = user._id.toString();
        req.user = user;
        return next();
      }
    } else {
      req.userId = userIdOrEmail;
      const user = await User.findById(userIdOrEmail);
      if (user) {
        req.user = user;
      }
      return next();
    }
    
    res.status(401).json({ message: 'User not found' });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ message: 'Authentication failed' });
  }
};

