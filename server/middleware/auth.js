// Simple auth stub - in production, use JWT
export const authenticate = async (req, res, next) => {
  try {
    // For development: use userId from header or default to test user
    const userIdOrEmail = req.headers['x-user-id'] || req.body.userId;
    
    if (!userIdOrEmail) {
      // Create or get default test user
      const User = (await import('../models/User.js')).default;
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
    } else {
      // Check if it's an email or ObjectId
      const User = (await import('../models/User.js')).default;
      if (userIdOrEmail.includes('@')) {
        // It's an email, find user by email
        let user = await User.findOne({ email: userIdOrEmail });
        if (!user) {
          // Create user if doesn't exist
          user = await User.create({
            name: userIdOrEmail.split('@')[0],
            email: userIdOrEmail,
            monthlySalary: 50000,
            currencyPreference: 'INR',
            languagePreference: 'en',
          });
        }
        req.userId = user._id.toString();
      } else {
        // Assume it's an ObjectId
        req.userId = userIdOrEmail;
      }
    }
    
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

