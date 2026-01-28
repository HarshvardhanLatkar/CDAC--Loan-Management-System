const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const loanRoutes = require('./routes/loans');
const paymentRoutes = require('./routes/payments');
const userRoutes = require('./routes/users');
const statsRoutes = require('./routes/stats');
const pool = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stats', statsRoutes);

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Function to create default users
const createDefaultUsers = async () => {
    try {
        // Check if admin exists
        const [existingAdmin] = await pool.query('SELECT id FROM users WHERE email = ?', ['admin@loan.com']);
        
        if (existingAdmin.length === 0) {
            const adminPassword = await bcrypt.hash('admin123', 10);
            await pool.query(
                'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
                ['Admin User', 'admin@loan.com', adminPassword, '1234567890', 'admin']
            );
            console.log('✅ Admin user created: admin@loan.com / admin123');
        } else {
            // Update existing admin password
            const adminPassword = await bcrypt.hash('admin123', 10);
            await pool.query('UPDATE users SET password = ? WHERE email = ?', [adminPassword, 'admin@loan.com']);
            console.log('✅ Admin password updated: admin@loan.com / admin123');
        }

        // Check if test user exists
        const [existingUser] = await pool.query('SELECT id FROM users WHERE email = ?', ['user@loan.com']);
        
        if (existingUser.length === 0) {
            const userPassword = await bcrypt.hash('user123', 10);
            await pool.query(
                'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
                ['John Doe', 'user@loan.com', userPassword, '9876543210', 'user']
            );
            console.log('✅ Test user created: user@loan.com / user123');
        } else {
            // Update existing user password
            const userPassword = await bcrypt.hash('user123', 10);
            await pool.query('UPDATE users SET password = ? WHERE email = ?', [userPassword, 'user@loan.com']);
            console.log('✅ User password updated: user@loan.com / user123');
        }
        
        console.log('🎉 Default users ready!');
    } catch (error) {
        console.error('❌ Error creating default users:', error.message);
    }
};

// Start server
app.listen(PORT, async () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    
    // Create default users on startup
    await createDefaultUsers();
});