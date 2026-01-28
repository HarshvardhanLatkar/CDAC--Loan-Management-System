import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loansAPI, paymentsAPI, statsAPI, usersAPI } from '../services/api';
import { toast } from 'react-toastify';
import Sidebar from './common/Sidebar';
import Modal from './common/Modal';
import StatCard from './common/StatCard';
import StatusBadge from './common/StatusBadge';
import {
    FaHome, FaPlusCircle, FaFileInvoiceDollar, FaCreditCard,
    FaUser, FaBell, FaCheck, FaFileAlt, FaMoneyBillWave, FaEye
} from 'react-icons/fa';

const UserDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    const [activeSection, setActiveSection] = useState('dashboard');
    const [stats, setStats] = useState({ totalLoans: 0, activeLoans: 0, pendingLoans: 0, totalAmount: 0 });
    const [loans, setLoans] = useState([]);
    const [payments, setPayments] = useState([]);
    const [selectedLoan, setSelectedLoan] = useState(null);

    // Form states
    const [loanForm, setLoanForm] = useState({
        loan_type: 'personal',
        amount: '',
        term: '12',
        employment_status: 'employed',
        monthly_income: '',
        purpose: ''
    });
    const [paymentForm, setPaymentForm] = useState({ loan_id: '', amount: '' });
    const [profileForm, setProfileForm] = useState({ name: user?.name || '', phone: user?.phone || '' });

    // Sidebar links
    const sidebarLinks = [
        { id: 'dashboard', icon: FaHome, label: 'Dashboard' },
        { id: 'apply', icon: FaPlusCircle, label: 'Apply for Loan' },
        { id: 'myloans', icon: FaFileInvoiceDollar, label: 'My Loans' },
        { id: 'payments', icon: FaCreditCard, label: 'Payments' },
        { id: 'profile', icon: FaUser, label: 'Profile' },
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, loansRes, paymentsRes] = await Promise.all([
                statsAPI.getUserStats(),
                loansAPI.getMyLoans(),
                paymentsAPI.getMyPayments()
            ]);
            setStats(statsRes.data);
            setLoans(loansRes.data);
            setPayments(paymentsRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const calculateEMI = () => {
        const amount = parseFloat(loanForm.amount) || 0;
        const term = parseInt(loanForm.term);
        const rate = 8.5 / 100 / 12;
        if (amount > 0) {
            return ((amount * rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1)).toFixed(2);
        }
        return '0.00';
    };

    const handleLoanSubmit = async (e) => {
        e.preventDefault();
        try {
            await loansAPI.create({
                ...loanForm,
                amount: parseFloat(loanForm.amount),
                monthly_income: parseFloat(loanForm.monthly_income)
            });
            toast.success('Loan application submitted!');
            setLoanForm({ loan_type: 'personal', amount: '', term: '12', employment_status: 'employed', monthly_income: '', purpose: '' });
            fetchData();
            setActiveSection('myloans');
        } catch (error) {
            toast.error('Failed to submit application');
        }
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        try {
            await paymentsAPI.create({
                loan_id: parseInt(paymentForm.loan_id),
                amount: parseFloat(paymentForm.amount)
            });
            toast.success('Payment successful!');
            setPaymentForm({ loan_id: '', amount: '' });
            fetchData();
        } catch (error) {
            toast.error('Payment failed');
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            await usersAPI.updateProfile(profileForm);
            toast.success('Profile updated!');
        } catch (error) {
            toast.error('Failed to update profile');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const approvedLoans = loans.filter(l => l.status === 'approved');

    return (
        <div className="flex min-h-screen">
            <Sidebar
                links={sidebarLinks}
                activeSection={activeSection}
                onSectionChange={setActiveSection}
                onLogout={handleLogout}
                title="LoanPro"
                subtitle="User Portal"
                gradientClass="gradient-btn"
            />

            <div className="ml-64 flex-1 p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.name}</h1>
                        <p className="text-gray-500">Manage your loans and payments</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <FaBell className="text-gray-500 text-xl cursor-pointer hover:text-blue-600" />
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                                {stats.pendingLoans}
                            </span>
                        </div>
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </div>

                {/* Dashboard Section */}
                {activeSection === 'dashboard' && (
                    <div className="fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <StatCard title="Total Loans" value={stats.totalLoans} icon={FaFileInvoiceDollar} iconBgColor="bg-blue-100" iconColor="text-blue-600" />
                            <StatCard title="Active Loans" value={stats.activeLoans} icon={FaCheck} iconBgColor="bg-green-100" iconColor="text-green-600" valueColor="text-green-600" />
                            <StatCard title="Pending" value={stats.pendingLoans} icon={FaFileAlt} iconBgColor="bg-yellow-100" iconColor="text-yellow-600" valueColor="text-yellow-600" />
                            <StatCard title="Total Amount" value={`$${Number(stats.totalAmount).toLocaleString()}`} icon={FaMoneyBillWave} iconBgColor="bg-purple-100" iconColor="text-purple-600" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Loan Applications</h3>
                                {loans.length === 0 ? (
                                    <p className="text-gray-500 text-center py-8">No loan applications yet</p>
                                ) : (
                                    <div className="space-y-4">
                                        {loans.slice(0, 3).map(loan => (
                                            <div key={loan.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div>
                                                    <p className="font-semibold">{loan.loan_type.charAt(0).toUpperCase() + loan.loan_type.slice(1)} Loan</p>
                                                    <p className="text-sm text-gray-500">${Number(loan.amount).toLocaleString()}</p>
                                                </div>
                                                <StatusBadge status={loan.status} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Payments</h3>
                                {payments.length === 0 ? (
                                    <p className="text-gray-500 text-center py-8">No payments yet</p>
                                ) : (
                                    <div className="space-y-4">
                                        {payments.slice(0, 3).map(payment => (
                                            <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div>
                                                    <p className="font-semibold">Payment #{payment.id}</p>
                                                    <p className="text-sm text-gray-500">{new Date(payment.created_at).toLocaleDateString()}</p>
                                                </div>
                                                <span className="font-bold text-green-600">${Number(payment.amount).toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Apply for Loan Section */}
                {activeSection === 'apply' && (
                    <div className="fade-in">
                        <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Apply for a New Loan</h2>
                            <form onSubmit={handleLoanSubmit}>
                                <div className="grid grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">Loan Type</label>
                                        <select value={loanForm.loan_type} onChange={(e) => setLoanForm({...loanForm, loan_type: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg">
                                            <option value="personal">Personal Loan</option>
                                            <option value="home">Home Loan</option>
                                            <option value="car">Car Loan</option>
                                            <option value="education">Education Loan</option>
                                            <option value="business">Business Loan</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">Loan Amount ($)</label>
                                        <input type="number" value={loanForm.amount} onChange={(e) => setLoanForm({...loanForm, amount: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg" placeholder="Enter amount" min="1000" required />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">Loan Term</label>
                                        <select value={loanForm.term} onChange={(e) => setLoanForm({...loanForm, term: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg">
                                            <option value="12">12 Months</option>
                                            <option value="24">24 Months</option>
                                            <option value="36">36 Months</option>
                                            <option value="48">48 Months</option>
                                            <option value="60">60 Months</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">Employment Status</label>
                                        <select value={loanForm.employment_status} onChange={(e) => setLoanForm({...loanForm, employment_status: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg">
                                            <option value="employed">Employed</option>
                                            <option value="self-employed">Self-Employed</option>
                                            <option value="business">Business Owner</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <label className="block text-gray-700 font-semibold mb-2">Monthly Income ($)</label>
                                    <input type="number" value={loanForm.monthly_income} onChange={(e) => setLoanForm({...loanForm, monthly_income: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg" placeholder="Enter monthly income" required />
                                </div>
                                <div className="mb-6">
                                    <label className="block text-gray-700 font-semibold mb-2">Purpose of Loan</label>
                                    <textarea value={loanForm.purpose} onChange={(e) => setLoanForm({...loanForm, purpose: e.target.value})} rows="3" className="w-full p-3 border border-gray-300 rounded-lg" placeholder="Describe the purpose" />
                                </div>
                                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                                    <h4 className="font-semibold text-blue-800 mb-2">Estimated Monthly Payment</h4>
                                    <p className="text-3xl font-bold text-blue-600">${calculateEMI()}</p>
                                    <p className="text-sm text-gray-600 mt-1">*Interest rate: 8.5% APR</p>
                                </div>
                                <button type="submit" className="w-full gradient-btn text-white py-3 rounded-lg font-semibold">Submit Application</button>
                            </form>
                        </div>
                    </div>
                )}

                {/* My Loans Section */}
                {activeSection === 'myloans' && (
                    <div className="fade-in">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="p-6 border-b">
                                <h2 className="text-2xl font-bold text-gray-800">My Loan Applications</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Loan ID</th>
                                            <th>Type</th>
                                            <th>Amount</th>
                                            <th>Term</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loans.length === 0 ? (
                                            <tr><td colSpan="7" className="text-center py-12 text-gray-500">No loan applications found</td></tr>
                                        ) : (
                                            loans.map(loan => (
                                                <tr key={loan.id}>
                                                    <td className="font-semibold">#{loan.id}</td>
                                                    <td>{loan.loan_type.charAt(0).toUpperCase() + loan.loan_type.slice(1)}</td>
                                                    <td>${Number(loan.amount).toLocaleString()}</td>
                                                    <td>{loan.term} months</td>
                                                    <td>{new Date(loan.created_at).toLocaleDateString()}</td>
                                                    <td><StatusBadge status={loan.status} /></td>
                                                    <td>
                                                        <button onClick={() => setSelectedLoan(loan)} className="text-blue-600 hover:text-blue-800"><FaEye /></button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Payments Section */}
                {activeSection === 'payments' && (
                    <div className="fade-in grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="p-6 border-b">
                                <h2 className="text-xl font-bold text-gray-800">Payment History</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Payment ID</th>
                                            <th>Loan ID</th>
                                            <th>Amount</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payments.length === 0 ? (
                                            <tr><td colSpan="5" className="text-center py-12 text-gray-500">No payments found</td></tr>
                                        ) : (
                                            payments.map(payment => (
                                                <tr key={payment.id}>
                                                    <td className="font-semibold">#{payment.id}</td>
                                                    <td>#{payment.loan_id}</td>
                                                    <td>${Number(payment.amount).toLocaleString()}</td>
                                                    <td>{new Date(payment.created_at).toLocaleDateString()}</td>
                                                    <td><StatusBadge status="completed" /></td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Make a Payment</h3>
                            <form onSubmit={handlePaymentSubmit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-semibold mb-2">Select Loan</label>
                                    <select value={paymentForm.loan_id} onChange={(e) => setPaymentForm({...paymentForm, loan_id: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg" required>
                                        <option value="">Select a loan</option>
                                        {approvedLoans.map(loan => (
                                            <option key={loan.id} value={loan.id}>Loan #{loan.id} - ${Number(loan.amount).toLocaleString()}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-semibold mb-2">Amount ($)</label>
                                    <input type="number" value={paymentForm.amount} onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg" placeholder="Enter amount" required />
                                </div>
                                <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700">Make Payment</button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Profile Section */}
                {activeSection === 'profile' && (
                    <div className="fade-in">
                        <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h2>
                            <div className="flex items-center gap-6 mb-8">
                                <div className="w-24 h-24 gradient-btn rounded-full flex items-center justify-center text-white text-3xl font-bold">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">{user?.name}</h3>
                                    <p className="text-gray-500">{user?.email}</p>
                                </div>
                            </div>
                            <form onSubmit={handleProfileUpdate}>
                                <div className="grid grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                                        <input type="text" value={profileForm.name} onChange={(e) => setProfileForm({...profileForm, name: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg" />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">Phone</label>
                                        <input type="tel" value={profileForm.phone} onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg" />
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <label className="block text-gray-700 font-semibold mb-2">Email</label>
                                    <input type="email" value={user?.email} className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100" readOnly />
                                </div>
                                <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700">Update Profile</button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Loan Details Modal */}
                <Modal isOpen={!!selectedLoan} onClose={() => setSelectedLoan(null)} title="Loan Details">
                    {selectedLoan && (
                        <div className="space-y-4">
                            <div className="flex justify-between"><span className="text-gray-600">Loan ID:</span><span className="font-semibold">#{selectedLoan.id}</span></div>
                            <div className="flex justify-between"><span className="text-gray-600">Type:</span><span className="font-semibold">{selectedLoan.loan_type}</span></div>
                            <div className="flex justify-between"><span className="text-gray-600">Amount:</span><span className="font-semibold">${Number(selectedLoan.amount).toLocaleString()}</span></div>
                            <div className="flex justify-between"><span className="text-gray-600">Term:</span><span className="font-semibold">{selectedLoan.term} months</span></div>
                            <div className="flex justify-between"><span className="text-gray-600">Monthly Payment:</span><span className="font-semibold">${Number(selectedLoan.monthly_payment).toLocaleString()}</span></div>
                            <div className="flex justify-between"><span className="text-gray-600">Status:</span><StatusBadge status={selectedLoan.status} /></div>
                            <div className="flex justify-between"><span className="text-gray-600">Date:</span><span className="font-semibold">{new Date(selectedLoan.created_at).toLocaleDateString()}</span></div>
                            {selectedLoan.purpose && <div className="pt-4 border-t"><span className="text-gray-600">Purpose:</span><p className="mt-2 text-gray-800">{selectedLoan.purpose}</p></div>}
                        </div>
                    )}
                </Modal>
            </div>
        </div>
    );
};

export default UserDashboard;
