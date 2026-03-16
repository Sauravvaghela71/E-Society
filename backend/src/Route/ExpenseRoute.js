const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expenseController");

// Stats route (put this BEFORE /:id so it doesn't think "stats" is an ID)
router.get("/stats", expenseController.getExpenseStats);

router.route("/")
    .post(expenseController.createExpense)
    .get(expenseController.getAllExpenses);

router.route("/:id")
    .put(expenseController.updateExpense)
    .delete(expenseController.deleteExpense);

module.exports = router;