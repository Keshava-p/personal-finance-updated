import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, DollarSign, Plus, Trash2, CheckCircle, X } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import { NeonButton } from './ui/NeonButton';
import { billService, Bill, CreateBillData } from '../services/billService';
import { useCurrency } from '../hooks/useCurrency';

export function BillReminder() {
    const { format } = useCurrency();
    const [bills, setBills] = useState<Bill[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newBill, setNewBill] = useState<CreateBillData>({
        title: '',
        amount: 0,
        dueDate: '',
    });

    useEffect(() => {
        loadBills();
    }, []);

    const loadBills = async () => {
        setLoading(true);
        const fetchedBills = await billService.getBills();
        setBills(fetchedBills);
        setLoading(false);
    };

    const handleAddBill = async () => {
        if (!newBill.title || newBill.amount <= 0 || !newBill.dueDate) {
            return;
        }

        const createdBill = await billService.createBill(newBill);
        if (createdBill) {
            setBills([...bills, createdBill]);
            setNewBill({ title: '', amount: 0, dueDate: '' });
            setShowAddForm(false);
        }
    };

    const handleTogglePaid = async (bill: Bill) => {
        const updated = await billService.updateBill(bill._id, { isPaid: !bill.isPaid });
        if (updated) {
            setBills(bills.map(b => b._id === bill._id ? updated : b));
        }
    };

    const handleDeleteBill = async (id: string) => {
        const success = await billService.deleteBill(id);
        if (success) {
            setBills(bills.filter(b => b._id !== id));
        }
    };

    const isOverdue = (dueDate: string) => {
        return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
    };

    const sortedBills = [...bills].sort((a, b) => {
        // Unpaid bills first, then by due date
        if (a.isPaid !== b.isPaid) return a.isPaid ? 1 : -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

    return (
        <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-400/30">
                        <Calendar className="h-5 w-5 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Bill Reminders</h3>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/30 transition-all duration-200"
                    aria-label="Add bill"
                >
                    {showAddForm ? (
                        <X className="h-4 w-4 text-cyan-400" />
                    ) : (
                        <Plus className="h-4 w-4 text-cyan-400" />
                    )}
                </button>
            </div>

            {/* Add Bill Form */}
            <AnimatePresence>
                {showAddForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-4 overflow-hidden"
                    >
                        <div className="p-4 rounded-xl bg-white/5 border border-white/20 space-y-3">
                            <input
                                type="text"
                                placeholder="Bill title (e.g., Electricity)"
                                value={newBill.title}
                                onChange={(e) => setNewBill({ ...newBill, title: e.target.value })}
                                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 text-sm"
                            />
                            <input
                                type="number"
                                placeholder="Amount"
                                value={newBill.amount || ''}
                                onChange={(e) => setNewBill({ ...newBill, amount: parseFloat(e.target.value) || 0 })}
                                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 text-sm"
                            />
                            <input
                                type="date"
                                value={newBill.dueDate}
                                onChange={(e) => setNewBill({ ...newBill, dueDate: e.target.value })}
                                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 text-sm"
                            />
                            <NeonButton onClick={handleAddBill} className="w-full">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Bill
                            </NeonButton>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bills List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
                {loading ? (
                    <div className="text-center py-8 text-white/60">Loading bills...</div>
                ) : sortedBills.length === 0 ? (
                    <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-blue-400 mx-auto mb-3 opacity-50" />
                        <p className="text-white/60">No bills added yet</p>
                        <p className="text-sm text-white/40 mt-1">Click the + button to add your first bill</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {sortedBills.map((bill) => {
                            const overdue = isOverdue(bill.dueDate);
                            const dueDate = new Date(bill.dueDate);
                            const today = new Date();
                            const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

                            return (
                                <motion.div
                                    key={bill._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className={`p-4 rounded-xl border transition-all duration-200 ${bill.isPaid
                                        ? 'bg-green-500/10 border-green-400/30 opacity-60'
                                        : overdue
                                            ? 'bg-red-500/20 border-red-400/40 animate-pulse'
                                            : 'bg-white/5 border-white/20 hover:bg-white/10'
                                        }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className={`font-semibold ${bill.isPaid ? 'text-white/60 line-through' : 'text-white'}`}>
                                                    {bill.title}
                                                </h4>
                                                {overdue && !bill.isPaid && (
                                                    <span className="px-2 py-0.5 text-xs font-medium bg-red-500/30 text-red-400 rounded-full">
                                                        Overdue
                                                    </span>
                                                )}
                                                {bill.isPaid && (
                                                    <CheckCircle className="h-4 w-4 text-green-400" />
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4 text-sm">
                                                <div className="flex items-center gap-1 text-white/70">
                                                    <DollarSign className="h-3 w-3" />
                                                    <span>{format(bill.amount)}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-white/70">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>{dueDate.toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            {!bill.isPaid && (
                                                <p className="text-xs text-white/50 mt-1">
                                                    {overdue ? `${Math.abs(daysUntilDue)} days overdue` : `Due in ${daysUntilDue} days`}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleTogglePaid(bill)}
                                                className={`p-2 rounded-lg transition-all duration-200 ${bill.isPaid
                                                    ? 'bg-green-500/20 hover:bg-green-500/30 border border-green-400/30'
                                                    : 'bg-white/5 hover:bg-white/10 border border-white/20'
                                                    }`}
                                                aria-label={bill.isPaid ? 'Mark as unpaid' : 'Mark as paid'}
                                            >
                                                <CheckCircle className={`h-4 w-4 ${bill.isPaid ? 'text-green-400' : 'text-white/60'}`} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteBill(bill._id)}
                                                className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 transition-all duration-200"
                                                aria-label="Delete bill"
                                            >
                                                <Trash2 className="h-4 w-4 text-red-400" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                )}
            </div>

            {/* Summary */}
            {bills.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                        <span className="text-white/60">
                            {bills.filter(b => !b.isPaid).length} pending
                        </span>
                        <span className="text-white/60">
                            {bills.filter(b => isOverdue(b.dueDate) && !b.isPaid).length} overdue
                        </span>
                    </div>
                    <div className="text-white/80 font-semibold">
                        Total: {format(bills.filter(b => !b.isPaid).reduce((sum, b) => sum + b.amount, 0))}
                    </div>
                </div>
            )}
        </GlassCard>
    );
}
