import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loansAPI, paymentsAPI, statsAPI, usersAPI } from '../services/api';
import { toast } from 'react-toastify';
import Sidebar from './common/Sidebar';
import Modal from './common/Modal';
import StatCard from './common/StatCard';
import StatusBadge from './common/StatusBadge';
import {
    FaChartLine, FaFileAlt, FaUsers, FaMoneyBillWave,
    FaChartBar, FaBell, FaEye, FaCheck, FaTimes
} from 'react-icons/fa';

const AdminDashboard = () => {
    const { logout } = useAuth(); // ✅ removed unused user
    const navigate = useNavigate();

    const [activeSection, setActiveSection] = useState('dashboard');
    const [stats, setStats] = useState({});
    const [loans, setLoans] = useState([]);
    const [users, setUsers] = useState([]);
    const [payments, setPayments] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedLoan, setSelectedLoan] = useState(null);

    // Sidebar links
    const sidebarLinks = [
        { id: 'dashboard', icon: FaChartLine, label: 'Dashboard' },
        { id: 'applications', icon: FaFileAlt, label: 'Applications' },
        { id: 'users', icon: FaUsers, label: 'Users' },
        { id: 'payments', icon: FaMoneyBillWave, label: 'Payments' },
        { id: 'reports', icon: FaChartBar, label: 'Reports' },
    ];

    const fetchData = useCallback(async () => {
        try {
            const [statsRes, loansRes, usersRes, paymentsRes] = await Promise.all([
                statsAPI.getAdminStats(),
                loansAPI.getAll(),
                usersAPI.getAll(),
                paymentsAPI.getAll()
            ]);
            setStats(statsRes.data);
            setLoans(loansRes.data);
            setUsers(usersRes.data);
            setPayments(paymentsRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, []);

    const fetchLoans = useCallback(async () => {
        try {
            const res = await loansAPI.getAll(statusFilter);
            setLoans(res.data);
        } catch (error) {
            console.error('Error fetching loans:', error);
        }
    }, [statusFilter]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        fetchLoans();
    }, [fetchLoans]);

    const updateLoanStatus = async (loanId, status) => {
        try {
            await loansAPI.updateStatus(loanId, { status });
            toast.success(`Loan ${status} successfully!`);
            fetchData();
            setSelectedLoan(null);
        } catch (error) {
            toast.error('Failed to update loan status');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Calculate percentages
    const total = stats.totalApplications || 1;
    const approvedPercent = ((stats.approvedApplications || 0) / total * 100).toFixed(0);
    const pendingPercent = ((stats.pendingApplications || 0) / total * 100).toFixed(0);
    const rejectedPercent = ((stats.rejectedApplications || 0) / total * 100).toFixed(0);

    return (
        <div className="flex min-h-screen">
            <Sidebar
                links={sidebarLinks}
                activeSection={activeSection}
                onSectionChange={setActiveSection}
                onLogout={handleLogout}
                title="LoanPro"
                subtitle="Admin Panel"
                gradientClass="bg-gradient-to-r from-purple-500 to-pink-500"
            />

            <div className="ml-64 flex-1 p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                        <p className="text-gray-500">Manage loans, users and payments</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <FaBell className="text-gray-500 text-xl cursor-pointer hover:text-purple-600" />
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                                {stats.pendingApplications || 0}
                            </span>
                        </div>
                        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">A</div>
                    </div>
                </div>

                {/* Dashboard Section */}
                {activeSection === 'dashboard' && (
                    <div className="fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <StatCard title="Total Applications" value={stats.totalApplications || 0} icon={FaFileAlt} iconBgColor="bg-blue-100" iconColor="text-blue-600" />
                            <StatCard title="Pending Review" value={stats.pendingApplications || 0} icon={FaFileAlt} iconBgColor="bg-yellow-100" iconColor="text-yellow-600" valueColor="text-yellow-600" />
                            <StatCard title="Total Users" value={stats.totalUsers || 0} icon={FaUsers} iconBgColor="bg-green-100" iconColor="text-green-600" valueColor="text-green-600" />
                            <StatCard title="Total Disbursed" value={`$${Number(stats.totalDisbursed || 0).toLocaleString()}`} icon={FaMoneyBillWave} iconBgColor="bg-purple-100" iconColor="text-purple-600" valueColor="text-purple-600" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Recent Applications */}
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Applications</h3>
                                {loans.length === 0 ? (
                                    <p className="text-gray-500 text-center py-8">No applications yet</p>
                                ) : (
                                    <div className="space-y-4">
                                        {loans.slice(0, 4).map(loan => (
                                            <div key={loan.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <span className="font-bold text-blue-600">{loan.user_name?.charAt(0)}</span>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold">{loan.user_name}</p>
                                                        <p className="text-sm text-gray-500">{loan.loan_type} - ${Number(loan.amount).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                                <StatusBadge status={loan.status} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Status Overview */}
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Loan Status Overview</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Approved</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-48 h-3 bg-gray-200 rounded-full overflow-hidden">
                                                <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${approvedPercent}%` }}></div>
                                            </div>
                                            <span className="text-sm font-semibold w-12">{approvedPercent}%</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Pending</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-48 h-3 bg-gray-200 rounded-full overflow-hidden">
                                                <div className="h-full bg-yellow-500 rounded-full transition-all" style={{ width: `${pendingPercent}%` }}></div>
                                            </div>
                                            <span className="text-sm font-semibold w-12">{pendingPercent}%</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Rejected</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-48 h-3 bg-gray-200 rounded-full overflow-hidden">
                                                <div className="h-full bg-red-500 rounded-full transition-all" style={{ width: `${rejectedPercent}%` }}></div>
                                            </div>
                                            <span className="text-sm font-semibold w-12">{rejectedPercent}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Applications Section */}
                {activeSection === 'applications' && (
                    <div className="fade-in">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="p-6 border-b flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-gray-800">Loan Applications</h2>
                                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="p-2 border rounded-lg">
                                    <option value="all">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                            <div className="overflow-x-auto">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Loan ID</th>
                                            <th>Applicant</th>
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
                                            <tr><td colSpan="8" className="text-center py-12 text-gray-500">No applications found</td></tr>
                                        ) : (
                                            loans.map(loan => (
                                                <tr key={loan.id}>
                                                    <td className="font-semibold">#{loan.id}</td>
                                                    <td>{loan.user_name}</td>
                                                    <td>{loan.loan_type.charAt(0).toUpperCase() + loan.loan_type.slice(1)}</td>
                                                    <td>${Number(loan.amount).toLocaleString()}</td>
                                                    <td>{loan.term} months</td>
                                                    <td>{new Date(loan.created_at).toLocaleDateString()}</td>
                                                    <td><StatusBadge status={loan.status} /></td>
                                                    <td>
                                                        <div className="flex gap-2">
                                                            <button onClick={() => setSelectedLoan(loan)} className="text-blue-600 hover:text-blue-800" title="View"><FaEye /></button>
                                                            {loan.status === 'pending' && (
                                                                <>
                                                                    <button onClick={() => updateLoanStatus(loan.id, 'approved')} className="text-green-600 hover:text-green-800" title="Approve"><FaCheck /></button>
                                                                    <button onClick={() => updateLoanStatus(loan.id, 'rejected')} className="text-red-600 hover:text-red-800" title="Reject"><FaTimes /></button>
                                                                </>
                                                            )}
                                                        </div>
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

                {/* Users Section */}
                {activeSection === 'users' && (
                    <div className="fade-in">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="p-6 border-b">
                                <h2 className="text-2xl font-bold text-gray-800">Registered Users</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>User ID</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Total Loans</th>
                                            <th>Joined</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.length === 0 ? (
                                            <tr><td colSpan="6" className="text-center py-12 text-gray-500">No users found</td></tr>
                                        ) : (
                                            users.map(u => (
                                                <tr key={u.id}>
                                                    <td className="font-semibold">#{u.id}</td>
                                                    <td>
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                                                {u.name?.charAt(0)}
                                                            </div>
                                                            {u.name}
                                                        </div>
                                                    </td>
                                                    <td>{u.email}</td>
                                                    <td>{u.phone}</td>
                                                    <td>{u.total_loans}</td>
                                                    <td>{new Date(u.created_at).toLocaleDateString()}</td>
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
                    <div className="fade-in">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="p-6 border-b">
                                <h2 className="text-2xl font-bold text-gray-800">All Payments</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Payment ID</th>
                                            <th>User</th>
                                            <th>Loan ID</th>
                                            <th>Amount</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payments.length === 0 ? (
                                            <tr><td colSpan="6" className="text-center py-12 text-gray-500">No payments found</td></tr>
                                        ) : (
                                            payments.map(payment => (
                                                <tr key={payment.id}>
                                                    <td className="font-semibold">#{payment.id}</td>
                                                    <td>{payment.user_name}</td>
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
                    </div>
                )}

                {/* Reports Section */}
                {activeSection === 'reports' && (
                    <div className="fade-in grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Loan Summary Report</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between p-4 bg-gray-50 rounded-lg">
                                    <span className="text-gray-600">Total Loan Applications</span>
                                    <span className="font-bold">{stats.totalApplications || 0}</span>
                                </div>
                                <div className="flex justify-between p-4 bg-green-50 rounded-lg">
                                    <span className="text-gray-600">Approved Loans</span>
                                    <span className="font-bold text-green-600">{stats.approvedApplications || 0}</span>
                                </div>
                                <div className="flex justify-between p-4 bg-yellow-50 rounded-lg">
                                    <span className="text-gray-600">Pending Loans</span>
                                    <span className="font-bold text-yellow-600">{stats.pendingApplications || 0}</span>
                                </div>
                                <div className="flex justify-between p-4 bg-red-50 rounded-lg">
                                    <span className="text-gray-600">Rejected Loans</span>
                                    <span className="font-bold text-red-600">{stats.rejectedApplications || 0}</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Financial Summary</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between p-4 bg-blue-50 rounded-lg">
                                    <span className="text-gray-600">Total Amount Requested</span>
                                    <span className="font-bold text-blue-600">${Number(stats.totalRequested || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between p-4 bg-green-50 rounded-lg">
                                    <span className="text-gray-600">Total Amount Disbursed</span>
                                    <span className="font-bold text-green-600">${Number(stats.totalDisbursed || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between p-4 bg-purple-50 rounded-lg">
                                    <span className="text-gray-600">Total Payments Received</span>
                                    <span className="font-bold text-purple-600">${Number(stats.totalPayments || 0).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Loan Details Modal */}
                <Modal isOpen={!!selectedLoan} onClose={() => setSelectedLoan(null)} title="Loan Details">
                    {selectedLoan && (
                        <>
                            <div className="space-y-4">
                                <div className="flex justify-between"><span className="text-gray-600">Loan ID:</span><span className="font-semibold">#{selectedLoan.id}</span></div>
                                <div className="flex justify-between"><span className="text-gray-600">Applicant:</span><span className="font-semibold">{selectedLoan.user_name}</span></div>
                                <div className="flex justify-between"><span className="text-gray-600">Email:</span><span className="font-semibold">{selectedLoan.user_email}</span></div>
                                <div className="flex justify-between"><span className="text-gray-600">Type:</span><span className="font-semibold">{selectedLoan.loan_type}</span></div>
                                <div className="flex justify-between"><span className="text-gray-600">Amount:</span><span className="font-semibold">${Number(selectedLoan.amount).toLocaleString()}</span></div>
                                <div className="flex justify-between"><span className="text-gray-600">Term:</span><span className="font-semibold">{selectedLoan.term} months</span></div>
                                <div className="flex justify-between"><span className="text-gray-600">Monthly Income:</span><span className="font-semibold">${Number(selectedLoan.monthly_income || 0).toLocaleString()}</span></div>
                                <div className="flex justify-between"><span className="text-gray-600">Employment:</span><span className="font-semibold">{selectedLoan.employment_status || 'N/A'}</span></div>
                                <div className="flex justify-between"><span className="text-gray-600">Status:</span><StatusBadge status={selectedLoan.status} /></div>
                                <div className="flex justify-between"><span className="text-gray-600">Date:</span><span className="font-semibold">{new Date(selectedLoan.created_at).toLocaleDateString()}</span></div>
                                {selectedLoan.purpose && <div className="pt-4 border-t"><span className="text-gray-600">Purpose:</span><p className="mt-2 text-gray-800">{selectedLoan.purpose}</p></div>}
                            </div>
                            {selectedLoan.status === 'pending' && (
                                <div className="flex gap-4 mt-6 pt-6 border-t">
                                    <button onClick={() => updateLoanStatus(selectedLoan.id, 'approved')} className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700">Approve</button>
                                    <button onClick={() => updateLoanStatus(selectedLoan.id, 'rejected')} className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700">Reject</button>
                                </div>
                            )}
                        </>
                    )}
                </Modal>
            </div>
        </div>
    );
};

export default AdminDashboard;
