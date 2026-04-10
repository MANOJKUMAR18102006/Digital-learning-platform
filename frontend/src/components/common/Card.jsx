import React from 'react';

const Card = ({ children, className = '', onClick }) => {
    return (
        <div 
            className={`bg-white border border-slate-200 rounded-2xl shadow-sm ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

export default Card;
