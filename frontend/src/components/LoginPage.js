import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaLandmark, FaEnvelope, FaLock, FaPhone, FaUser, FaUserShield } from 'react-icons/fa';

const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('user');
    const [loading, setLoading] = useState(false);

    const { login, register, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate(user.role === 'admin' ? '/admin' : '/dashboard');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                const loggedUser = await login(email, password, role);
                navigate(loggedUser.role === 'admin' ? '/admin' : '/dashboard');
            } else {
                await register(name, email, password, phone);
                setIsLogin(true);
                // Clear form
                setEmail('');
                setPassword('');
                setName('');
                setPhone('');
            }
        } catch (error) {
            console.error('Auth error:', error);
        }

        setLoading(false);
    };

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setEmail('');
        setPassword('');
        setName('');
        setPhone('');
    };

    return (
        <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md fade-in">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 gradient-btn rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaLandmark className="text-white text-3xl" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">LoanPro</h1>
                    <p className="text-gray-500 mt-2">Loan Management System</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    {/* Name field (Register only) */}
                    {!isLogin && (
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-semibold mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <FaUser className="absolute left-3 top-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {/* Email field */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <FaEnvelope className="absolute left-3 top-4 text-gray-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                    </div>

                    {/* Phone field (Register only) */}
                    {!isLogin && (
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-semibold mb-2">
                                Phone
                            </label>
                            <div className="relative">
                                <FaPhone className="absolute left-3 top-4 text-gray-400" />
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your phone"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {/* Password field */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <FaLock className="absolute left-3 top-4 text-gray-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                    </div>

                    {/* Role selection (Login only) */}
                    {isLogin && (
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-semibold mb-2">
                                Login As
                            </label>
                            <div className="flex gap-4">
                                <label
                                    className={`flex-1 cursor-pointer p-4 border-2 rounded-lg text-center transition-all ${
                                        role === 'user' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="role"
                                        value="user"
                                        checked={role === 'user'}
                                        onChange={() => setRole('user')}
                                        className="hidden"
                                    />
                                    <FaUser className="text-2xl text-blue-600 mx-auto mb-2" />
                                    <p className="font-semibold">User</p>
                                </label>
                                <label
                                    className={`flex-1 cursor-pointer p-4 border-2 rounded-lg text-center transition-all ${
                                        role === 'admin' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="role"
                                        value="admin"
                                        checked={role === 'admin'}
                                        onChange={() => setRole('admin')}
                                        className="hidden"
                                    />
                                    <FaUserShield className="text-2xl text-blue-600 mx-auto mb-2" />
                                    <p className="font-semibold">Admin</p>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full gradient-btn text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all disabled:opacity-50"
                    >
                        {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Register'}
                    </button>
                </form>

                {/* Toggle link */}
                <p className="text-center mt-4 text-gray-600">
                    {isLogin ? "Don't have an account? " : 'Already have an account? '}
                    <button
                        onClick={toggleForm}
                        className="text-blue-600 font-semibold hover:underline"
                    >
                        {isLogin ? 'Register' : 'Sign In'}
                    </button>
                </p>

            </div>
        </div>
    );
};

export default LoginPage;
