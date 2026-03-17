const express = require("express");
const router = express.Router();
const expenseController = require("../Controller/ExpenseController");

// Stats route (put this BEFORE /:id so it doesn't think "stats" is an ID)
router.get("/stats", expenseController.getExpenseStats);

// router.route("/")
//     .post(expenseController.createExpense)
//     .get(expenseController.getAllExpenses);

// router.route("/:id")
//     .put(expenseController.updateExpense)
//     .delete(expenseController.deleteExpense);

router.post("/create",expenseController.createExpense)
router.get("/all",expenseController.getAllExpenses)
router.put("/update/:id",expenseController.updateExpense)
router.delete("/delete/:id",expenseController.deleteExpense)
module.exports = router;