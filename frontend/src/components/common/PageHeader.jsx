import React from 'react';

const PageHeader = ({ title, subtitle }) => {
    return (
        <div className="mb-4">
            <h1 className="text-xl font-semibold text-slate-900 truncate">{title}</h1>
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
    );
};

export default PageHeader;
