import React, { useEffect, useState } from 'react';

export const Toast = ({ message, type = 'info', duration = 3000 }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    if (!isVisible) return null;

    const bgColor = {
        info: 'bg-blue-500',
        error: 'bg-red-500',
        success: 'bg-green-500',
        warning: 'bg-yellow-500'
    }[type];

    return (
        <div className={`fixed bottom-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50`}>
            {message}
        </div>
    );
};