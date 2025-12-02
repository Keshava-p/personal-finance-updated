import mongoose from 'mongoose';

const debtSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  debtType: {
    type: String,
    enum: ['credit_card', 'personal_loan', 'student_loan', 'mortgage', 'auto_loan', 'medical', 'other'],
    default: 'other'
  },
  creditor: { type: String }, // Lender/creditor name
  principal: { type: Number, required: true },
  currentBalance: { type: Number }, // Current outstanding balance
  monthlyPayment: { type: Number, required: true },
  minimumPayment: { type: Number }, // Minimum required payment
  apr: { type: Number, required: true }, // Annual Percentage Rate
  dueDate: { type: Number, min: 1, max: 31 }, // Day of month payment is due
  startDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['active', 'paid_off', 'defaulted'],
    default: 'active'
  },
  currency: { type: String, default: 'INR' },
  notes: String,
  paymentHistory: [{
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    principalPaid: Number,
    interestPaid: Number,
    notes: String
  }]
}, {
  timestamps: true,
});

// Auto-set currentBalance to principal if not provided
debtSchema.pre('save', function (next) {
  if (this.isNew && !this.currentBalance) {
    this.currentBalance = this.principal;
  }
  next();
});

export default mongoose.model('Debt', debtSchema);

