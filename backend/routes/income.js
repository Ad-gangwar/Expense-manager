const Income= require("../models/IncomeSchema")
const express = require('express');
const router = express.Router();
const passport = require('passport');

// POST / - create income (mounted at /income)
// Requires authentication via JWT
router.post("/", passport.authenticate("jwt", {session: false}), async (req, res) => {
    const {title, amount, category, description, date}  = req.body
    const user = req.user._id;
    const income = Income({
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
        await income.save()
        res.status(201).json({message: 'Income Added'})
    } catch (error) {
        res.status(500).json({message: 'Server Error'})
    }
});


// GET / - list incomes (mounted at /income)
// Requires authentication via JWT
router.get("/", passport.authenticate("jwt", {session: false}), async (req, res) =>{
    const user= req.user._id;
    try {
        const incomes = await Income.find({user: user}).sort({createdAt: -1})
        res.status(200).json({data: incomes})
    } catch (error) {
        res.status(500).json({message: 'Server Error'})
    }
});


// DELETE /:id - delete income (mounted at /income)
// Requires authentication via JWT
router.delete("/:id", passport.authenticate("jwt", {session: false}),  async (req, res) =>{
    const {id} = req.params;
    try {
        const income = await Income.findByIdAndDelete(id);
        if (!income) {
            return res.status(404).json({message: 'Income not found'});
        }
        res.status(200).json({message: 'Income Deleted'});
    } catch (err) {
        res.status(500).json({message: 'Server Error'});
    }
});


module.exports = router;