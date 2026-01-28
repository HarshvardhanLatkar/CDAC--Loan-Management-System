import React from 'react';

const StatusBadge = ({ status }) => {
    const getStatusClass = () => {
        switch (status.toLowerCase()) {
            case 'approved':
                return 'status-approved';
            case 'pending':
                return 'status-pending';
            case 'rejected':
                return 'status-rejected';
            case 'paid':
            case 'completed':
                return 'status-completed';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass()}`}>
            {status.toUpperCase()}
        </span>
    );
};

export default StatusBadge;
