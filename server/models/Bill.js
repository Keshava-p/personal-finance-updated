import mongoose from 'mongoose';

const billSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        dueDate: {
            type: Date,
            required: true,
        },
        isPaid: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
billSchema.index({ userId: 1, dueDate: 1 });

const Bill = mongoose.model('Bill', billSchema);

export default Bill;
