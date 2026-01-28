import React from 'react';
import { FaLandmark, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = ({ links, activeSection, onSectionChange, onLogout, title, subtitle, gradientClass }) => {
    return (
        <div className="w-64 bg-gray-900 text-white fixed h-full">
            {/* Logo Section */}
            <div className="p-6 border-b border-gray-700">
                <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 ${gradientClass} rounded-full flex items-center justify-center`}>
                        <FaLandmark className="text-xl" />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg">{title}</h2>
                        <p className="text-gray-400 text-sm">{subtitle}</p>
                    </div>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="p-4">
                {links.map((link) => (
                    <button
                        key={link.id}
                        onClick={() => onSectionChange(link.id)}
                        className={`sidebar-link w-full ${activeSection === link.id ? 'active' : ''}`}
                    >
                        <link.icon className="w-5" />
                        {link.label}
                    </button>
                ))}

                {/* Logout Button */}
                <button
                    onClick={onLogout}
                    className="sidebar-link w-full mt-8 text-red-400 hover:bg-red-900/30"
                >
                    <FaSignOutAlt className="w-5" />
                    Logout
                </button>
            </nav>
        </div>
    );
};

export default Sidebar;
