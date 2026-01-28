const express = require('express');
const pool = require('../config/db');
const { authenticateToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// User dashboard stats
router.get('/user', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const [totalLoans] = await pool.query(
            'SELECT COUNT(*) as count FROM loans WHERE user_id = ?', 
            [userId]
        );
        const [activeLoans] = await pool.query(
            'SELECT COUNT(*) as count FROM loans WHERE user_id = ? AND status = "approved"', 
            [userId]
        );
        const [pendingLoans] = await pool.query(
            'SELECT COUNT(*) as count FROM loans WHERE user_id = ? AND status = "pending"', 
            [userId]
        );
        const [totalAmount] = await pool.query(
            'SELECT COALESCE(SUM(amount), 0) as total FROM loans WHERE user_id = ?', 
            [userId]
        );
        const [totalPayments] = await pool.query(
            'SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE user_id = ?', 
            [userId]
        );

        res.json({
            totalLoans: totalLoans[0].count,
            activeLoans: activeLoans[0].count,
            pendingLoans: pendingLoans[0].count,
            totalAmount: totalAmount[0].total,
            totalPayments: totalPayments[0].total
        });
    } catch (error) {
        console.error('User stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin dashboard stats
router.get('/admin', authenticateToken, isAdmin, async (req, res) => {
    try {
        const [totalApps] = await pool.query('SELECT COUNT(*) as count FROM loans');
        const [pendingApps] = await pool.query('SELECT COUNT(*) as count FROM loans WHERE status = "pending"');
        const [approvedApps] = await pool.query('SELECT COUNT(*) as count FROM loans WHERE status = "approved"');
        const [rejectedApps] = await pool.query('SELECT COUNT(*) as count FROM loans WHERE status = "rejected"');
        const [totalUsers] = await pool.query('SELECT COUNT(*) as count FROM users WHERE role = "user"');
        const [totalDisbursed] = await pool.query('SELECT COALESCE(SUM(amount), 0) as total FROM loans WHERE status = "approved"');
        const [totalRequested] = await pool.query('SELECT COALESCE(SUM(amount), 0) as total FROM loans');
        const [totalPayments] = await pool.query('SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE status = "completed"');

        res.json({
            totalApplications: totalApps[0].count,
            pendingApplications: pendingApps[0].count,
            approvedApplications: approvedApps[0].count,
            rejectedApplications: rejectedApps[0].count,
            totalUsers: totalUsers[0].count,
            totalDisbursed: totalDisbursed[0].total,
            totalRequested: totalRequested[0].total,
            totalPayments: totalPayments[0].total
        });
    } catch (error) {
        console.error('Admin stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
