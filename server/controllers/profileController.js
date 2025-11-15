import User from '../models/User.js';

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSalary = async (req, res) => {
  try {
    const { monthlySalary } = req.body;
    if (typeof monthlySalary !== 'number' || monthlySalary < 0) {
      return res.status(400).json({ error: 'Invalid salary amount' });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: { monthlySalary } },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ 
      message: 'Salary updated successfully',
      user,
      // Trigger recalculation hints
      recalculate: ['budget', 'dti', 'savings', 'goals'],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePreferences = async (req, res) => {
  try {
    const { currencyPreference, languagePreference, themePreference } = req.body;
    const update = {};
    
    if (currencyPreference) update.currencyPreference = currencyPreference;
    if (languagePreference) update.languagePreference = languagePreference;
    if (themePreference) update.themePreference = themePreference;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: update },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ 
      message: 'Preferences updated successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

