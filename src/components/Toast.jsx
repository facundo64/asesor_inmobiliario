import React from 'react';

export const Toast = ({ message, type, visible }) => {
    if (!visible) return null;
    const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';
    return (
        <div className={`fixed bottom-5 right-5 text-white py-3 px-6 rounded-lg shadow-lg z-[100] ${bgColor}`}>
            <p>{message}</p>
        </div>
    );
};