const TotalExpense = require('../Model/TotalExpenseModel');

exports.addExpense = async (req, res) => {
    try {
        const newExpense = new TotalExpense(req.body);
        await newExpense.save();
        res.status(201).json(newExpense);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getExpenses = async (req, res) => {
    try {
        const expenses = await TotalExpense.find();
        res.status(200).json(expenses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};