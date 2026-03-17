const express = require('express');
const router = express.Router();
const { addExpense, getExpenses } = require('../Controller/TotalExpenseController');

router.post('/add', addExpense);
router.get('/all', getExpenses);

module.exports = router;