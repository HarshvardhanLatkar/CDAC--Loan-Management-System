const express = require('express');
const pool = require('../config/db');
const { authenticateToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Create loan application
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { loan_type, amount, term, employment_status, monthly_income, purpose } = req.body;
        const user_id = req.user.id;

        // Calculate monthly payment (EMI)
        const interest_rate = 8.5;
        const monthlyRate = interest_rate / 100 / 12;
        const monthly_payment = (amount * monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);

        const [result] = await pool.query(
            `INSERT INTO loans (user_id, loan_type, amount, term, interest_rate, monthly_payment, employment_status, monthly_income, purpose) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [user_id, loan_type, amount, term, interest_rate, monthly_payment.toFixed(2), employment_status, monthly_income, purpose]
        );

        res.status(201).json({ message: 'Loan application submitted', loanId: result.insertId });
    } catch (error) {
        console.error('Create loan error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user's loans
router.get('/my-loans', authenticateToken, async (req, res) => {
    try {
        const [loans] = await pool.query(
            'SELECT * FROM loans WHERE user_id = ? ORDER BY created_at DESC',
            [req.user.id]
        );
        res.json(loans);
    } catch (error) {
        console.error('Get loans error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all loans (Admin only)
router.get('/', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { status } = req.query;
        let query = `
            SELECT l.*, u.name as user_name, u.email as user_email 
            FROM loans l 
            JOIN users u ON l.user_id = u.id
        `;
        const params = [];

        if (status && status !== 'all') {
            query += ' WHERE l.status = ?';
            params.push(status);
        }

        query += ' ORDER BY l.created_at DESC';

        const [loans] = await pool.query(query, params);
        res.json(loans);
    } catch (error) {
        console.error('Get all loans error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single loan
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const [loans] = await pool.query(
            `SELECT l.*, u.name as user_name, u.email as user_email, u.phone as user_phone
             FROM loans l 
             JOIN users u ON l.user_id = u.id 
             WHERE l.id = ?`,
            [req.params.id]
        );

        if (loans.length === 0) {
            return res.status(404).json({ message: 'Loan not found' });
        }

        // Check if user owns the loan or is admin
        if (req.user.role !== 'admin' && loans[0].user_id !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json(loans[0]);
    } catch (error) {
        console.error('Get loan error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update loan status (Admin only)
router.patch('/:id/status', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { status, admin_notes } = req.body;
        const loanId = req.params.id;

        await pool.query(
            `UPDATE loans SET status = ?, admin_notes = ?, approved_by = ?, approved_at = NOW() WHERE id = ?`,
            [status, admin_notes || null, req.user.id, loanId]
        );

        res.json({ message: `Loan ${status} successfully` });
    } catch (error) {
        console.error('Update loan status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
