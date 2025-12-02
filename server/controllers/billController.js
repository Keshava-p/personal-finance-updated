import Bill from '../models/Bill.js';

// Get all bills for the authenticated user
export const getBills = async (req, res) => {
    try {
        const userId = req.user.id;
        const bills = await Bill.find({ userId }).sort({ dueDate: 1 });

        res.json({
            success: true,
            bills,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

// Create a new bill
export const createBill = async (req, res) => {
    try {
        const userId = req.user.id;
        const { title, amount, dueDate } = req.body;

        // Validation
        if (!title || !amount || !dueDate) {
            return res.status(400).json({
                success: false,
                error: 'Please provide title, amount, and due date',
            });
        }

        const bill = await Bill.create({
            userId,
            title,
            amount,
            dueDate,
        });

        res.status(201).json({
            success: true,
            bill,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

// Update a bill
export const updateBill = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const bill = await Bill.findOneAndUpdate(
            { _id: id, userId },
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!bill) {
            return res.status(404).json({
                success: false,
                error: 'Bill not found',
            });
        }

        res.json({
            success: true,
            bill,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

// Delete a bill
export const deleteBill = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const bill = await Bill.findOneAndDelete({ _id: id, userId });

        if (!bill) {
            return res.status(404).json({
                success: false,
                error: 'Bill not found',
            });
        }

        res.json({
            success: true,
            message: 'Bill deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};
