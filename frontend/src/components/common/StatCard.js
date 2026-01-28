import React from 'react';

const StatCard = ({ title, value, icon: Icon, iconBgColor, iconColor, valueColor = 'text-gray-800' }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg card-hover transition-all">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm">{title}</p>
                    <h3 className={`text-3xl font-bold ${valueColor}`}>{value}</h3>
                </div>
                <div className={`w-14 h-14 ${iconBgColor} rounded-full flex items-center justify-center`}>
                    <Icon className={`${iconColor} text-xl`} />
                </div>
            </div>
        </div>
    );
};

export default StatCard;
