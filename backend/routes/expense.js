const Expense = require("../models/ExpenseSchema")
const express = require('express');
const router = express.Router();
const passport = require('passport');


// POST / - create expense (mounted at /expense)
// Requires authentication via JWT
router.post("/", passport.authenticate("jwt", {session: false}), async (req, res) => {
    const user = req.user._id;
    const {title, amount, category, description, date}  = req.body;
    const expense = Expense({
        title,
        user,
        amount,
        category,
        description,
        date
    })
    try {
        // Validate required fields and amount
        if(!title || !category || !description || !date || !user){
            return res.status(400).json({message: 'All fields are required!'})
        }
        if (typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({message: 'Amount must be a positive number!'})
        }
        await expense.save()
        res.status(201).json({message: 'Expense Added'})
    } catch (error) {
        res.status(500).json({message: 'Server Error'})
    }
});


// GET / - list expenses (mounted at /expense)
// Requires authentication via JWT
router.get("/", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const user = req.user._id;
    try {
        const expenses = await Expense.find({ user: user })
            .sort({ createdAt: -1 });
        res.status(200).json({ data: expenses });
    } catch (error) {
        console.error("Error fetching expenses:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});


// DELETE /:id - delete expense (mounted at /expense)
// Requires authentication via JWT
router.delete("/:id", passport.authenticate("jwt", {session: false}),  async (req, res) =>{
    const {id} = req.params;
    try {
        const expense = await Expense.findByIdAndDelete(id);
        if (!expense) {
            return res.status(404).json({message: 'Expense not found'});
        }
        res.status(200).json({message: 'Expense Deleted'});
    } catch (err) {
        res.status(500).json({message: 'Server Error'});
    }
});

module.exports = router;
