const express = require('express');
const pool = require('../config/db');
const { authenticateToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all users (Admin only)
router.get('/', authenticateToken, isAdmin, async (req, res) => {
    try {
        const [users] = await pool.query(
            `SELECT u.id, u.name, u.email, u.phone, u.role, u.created_at,
                    COUNT(l.id) as total_loans
             FROM users u 
             LEFT JOIN loans l ON u.id = l.user_id 
             WHERE u.role = 'user'
             GROUP BY u.id 
             ORDER BY u.created_at DESC`
        );
        res.json(users);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
    try {
        const { name, phone } = req.body;

        await pool.query(
            'UPDATE users SET name = ?, phone = ? WHERE id = ?',
            [name, phone, req.user.id]
        );

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user by ID (Admin only)
router.get('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const [users] = await pool.query(
            'SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?',
            [req.params.id]
        );
        
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json(users[0]);
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
