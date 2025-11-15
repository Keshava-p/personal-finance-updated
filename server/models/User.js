import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  dob: Date,
  monthlySalary: { type: Number, default: 0 },
  incomeType: { type: String, enum: ['salary', 'business'], default: 'salary' },
  taxRegime: { type: String, enum: ['old', 'new', 'none'], default: 'none' },
  currencyPreference: { type: String, default: 'INR' },
  languagePreference: { type: String, default: 'en' },
  themePreference: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
  password: String,
  twoFactorEnabled: { type: Boolean, default: false },
  savingsAccountDetails: String,
  pan: String,
  emergencyFundTarget: { type: Number, default: 0 },
  bankDetails: String,
}, {
  timestamps: true,
});

export default mongoose.model('User', userSchema);

