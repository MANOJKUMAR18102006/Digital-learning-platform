import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({ title, description, action }) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
            <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-slate-100 text-slate-400">
                <Inbox className="h-7 w-7" strokeWidth={2} />
            </div>
            <div>
                <h3 className="text-base font-semibold text-slate-800 mb-1">{title}</h3>
                {description && <p className="text-sm text-slate-400 max-w-xs">{description}</p>}
            </div>
            {action && action}
        </div>
    );
};

export default EmptyState;
