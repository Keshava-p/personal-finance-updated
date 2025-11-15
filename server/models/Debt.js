import mongoose from 'mongoose';

const debtSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  principal: { type: Number, required: true },
  monthlyPayment: { type: Number, required: true },
  apr: { type: Number, required: true }, // Annual Percentage Rate
  startDate: { type: Date, default: Date.now },
  currency: { type: String, default: 'INR' },
  notes: String,
}, {
  timestamps: true,
});

export default mongoose.model('Debt', debtSchema);

