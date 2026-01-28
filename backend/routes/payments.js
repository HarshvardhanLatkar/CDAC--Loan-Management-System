const express = require('express');
const pool = require('../config/db');
const { authenticateToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Create payment
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { loan_id, amount, payment_method, notes } = req.body;
        const user_id = req.user.id;

        // Verify loan belongs to user and is approved
        const [loans] = await pool.query(
            'SELECT * FROM loans WHERE id = ? AND user_id = ? AND status = "approved"',
            [loan_id, user_id]
        );

        if (loans.length === 0) {
            return res.status(400).json({ message: 'Invalid loan or loan not approved' });
        }

        const transaction_id = 'TXN' + Date.now();

        const [result] = await pool.query(
            `INSERT INTO payments (loan_id, user_id, amount, payment_method, transaction_id, notes) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [loan_id, user_id, amount, payment_method || 'bank_transfer', transaction_id, notes]
        );

        res.status(201).json({ 
            message: 'Payment successful', 
            paymentId: result.insertId, 
            transaction_id 
        });
    } catch (error) {
        console.error('Create payment error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user's payments
router.get('/my-payments', authenticateToken, async (req, res) => {
    try {
        const [payments] = await pool.query(
            `SELECT p.*, l.loan_type, l.amount as loan_amount 
             FROM payments p 
             JOIN loans l ON p.loan_id = l.id 
             WHERE p.user_id = ? 
             ORDER BY p.created_at DESC`,
            [req.user.id]
        );
        res.json(payments);
    } catch (error) {
        console.error('Get payments error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all payments (Admin only)
router.get('/', authenticateToken, isAdmin, async (req, res) => {
    try {
        const [payments] = await pool.query(
            `SELECT p.*, u.name as user_name, u.email as user_email, l.loan_type 
             FROM payments p 
             JOIN users u ON p.user_id = u.id 
             JOIN loans l ON p.loan_id = l.id 
             ORDER BY p.created_at DESC`
        );
        res.json(payments);
    } catch (error) {
        console.error('Get all payments error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
