import React, { useMemo } from 'react';
import moment from 'moment';

const ActivityHeatmap = ({ data = [] }) => {
    // Generate dates for the last 6 months
    const segments = useMemo(() => {
        const days = [];
        const end = moment();
        const start = moment().subtract(6, 'months').startOf('week');
        
        let current = start.clone();
        while (current.isBefore(end) || current.isSame(end, 'day')) {
            const dateStr = current.format('YYYY-MM-DD');
            const dayData = data.find(d => d.date === dateStr);
            days.push({
                date: dateStr,
                count: dayData ? dayData.count : 0
            });
            current.add(1, 'day');
        }
        return days;
    }, [data]);

    const getColor = (count) => {
        if (count === 0) return 'bg-slate-100';
        if (count < 3) return 'bg-emerald-200';
        if (count < 6) return 'bg-emerald-400';
        if (count < 10) return 'bg-emerald-600';
        return 'bg-emerald-800';
    };

    // Calculate months for top axis
    const months = useMemo(() => {
        const monthNames = [];
        let currentMonth = null;
        
        segments.forEach((day, index) => {
            const m = moment(day.date).format('MMM');
            if (m !== currentMonth && index % 7 === 0) {
                monthNames.push({ name: m, index: Math.floor(index / 7) });
                currentMonth = m;
            }
        });
        return monthNames;
    }, [segments]);

    return (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">Activity Blueprint</h3>
                    <p className="text-slate-400 text-xs mt-0.5 font-medium uppercase tracking-widest">Your daily intellectual contribution</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    <span>Less</span>
                    <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-sm bg-slate-100" />
                        <div className="w-3 h-3 rounded-sm bg-emerald-200" />
                        <div className="w-3 h-3 rounded-sm bg-emerald-400" />
                        <div className="w-3 h-3 rounded-sm bg-emerald-600" />
                        <div className="w-3 h-3 rounded-sm bg-emerald-800" />
                    </div>
                    <span>More</span>
                </div>
            </div>

            <div className="overflow-x-auto pb-4 scrollbar-hide">
                <div className="min-w-[700px]">
                    {/* Month Labels */}
                    <div className="flex mb-2 text-[10px] font-bold text-slate-300 uppercase relative h-4">
                        {months.map((m, i) => (
                            <div 
                                key={i} 
                                className="absolute" 
                                style={{ left: `${m.index * 14}px` }}
                            >
                                {m.name}
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-1">
                        {/* Day labels */}
                        <div className="flex flex-col justify-between py-1 pr-3 text-[9px] font-bold text-slate-300 uppercase h-[100px]">
                            <span>Mon</span>
                            <span>Wed</span>
                            <span>Fri</span>
                        </div>

                        {/* Heatmap Grid */}
                        <div 
                            className="grid grid-flow-col gap-1"
                            style={{ 
                                gridTemplateRows: 'repeat(7, 1fr)',
                                gridTemplateColumns: `repeat(${Math.ceil(segments.length / 7)}, 1fr)` 
                            }}
                        >
                            {segments.map((day, i) => (
                                <div
                                    key={i}
                                    title={`${day.count} activities on ${day.date}`}
                                    className={`w-3 h-3 rounded-sm transition-all duration-300 transform hover:scale-125 hover:z-10 cursor-pointer ${getColor(day.count)}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivityHeatmap;
