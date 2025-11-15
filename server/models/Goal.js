import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  currentSaved: { type: Number, default: 0 },
  deadline: Date,
  category: String,
  currency: { type: String, default: 'INR' },
}, {
  timestamps: true,
});

export default mongoose.model('Goal', goalSchema);

