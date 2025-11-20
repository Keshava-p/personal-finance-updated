import User from '../models/User.js';

export const updateSalary = async (req, res) => {
  try {
    const { salary } = req.body;
    
    if (!salary || isNaN(salary) || salary <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid salary amount'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { salary },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Salary updated successfully',
      user
    });

  } catch (error) {
    console.error('Update salary error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
