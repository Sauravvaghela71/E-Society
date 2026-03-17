const Expense = require("../Model/ExpenseModel");

// 1. Create a new Expense
exports.createExpense = async (req, res) => {
    try {
        const expense = new Expense(req.body);
        await expense.save();
        res.status(201).json({ success: true, data: expense });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// 2. Get all Expenses (with optional category filter)
exports.getAllExpenses = async (req, res) => {
    try {
        const { category } = req.query;
        const filter = category ? { category } : {};
        
        const expenses = await Expense.find(filter).sort({ expenseDate: -1 });
        res.status(200).json({ success: true, count: expenses.length, data: expenses });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 3. Get total sum of expenses (Useful for dashboards!)
exports.getExpenseStats = async (req, res) => {
    try {
        const stats = await Expense.aggregate([
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" },
                    averageAmount: { $avg: "$amount" }
                }
            }
        ]);
        res.status(200).json({ success: true, data: stats[0] || { totalAmount: 0 } });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 4. Update an Expense
exports.updateExpense = async (req, res) => {
    try {
        const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!expense) return res.status(404).json({ message: "Expense not found" });
        res.status(200).json({ success: true, data: expense });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// 5. Delete an Expense
exports.deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findByIdAndDelete(req.params.id);
        if (!expense) return res.status(404).json({ message: "Expense not found" });
        res.status(200).json({ success: true, message: "Expense deleted" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};