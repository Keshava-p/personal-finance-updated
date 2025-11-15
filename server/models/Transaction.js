import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
  currency: { type: String, default: 'INR' },
  merchant: String,
}, {
  timestamps: true,
});

export default mongoose.model('Transaction', transactionSchema);

