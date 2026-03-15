const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, required: true }, // e.g., 'Cash', 'Bank Transfer', 'Cheque'
    expenseDate: { type: Date, default: Date.now },
    description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);