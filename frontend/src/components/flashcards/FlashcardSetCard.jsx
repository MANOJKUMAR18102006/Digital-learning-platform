import React from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Sparkles, TrendingUp, ArrowRight, Clock } from "lucide-react";
import moment from "moment";

const FlashcardSetCard = ({ flashcardSet }) => {
    const navigate = useNavigate();

    const handleStudyNow = () => {
        const docId = flashcardSet.documentId?._id || flashcardSet.documentId;
        navigate(`/documents/${docId}/flashcards`);
    };

    const reviewedCount = flashcardSet.cards.filter(card => card.lastReviewed).length;
    const totalCards = flashcardSet.cards.length;
    const progressPercentage = totalCards > 0 ? Math.round((reviewedCount / totalCards) * 100) : 0;

    return (
        <div 
            className="group relative bg-white border border-slate-200/80 rounded-3xl p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-2 cursor-pointer overflow-hidden"
            onClick={handleStudyNow}
        >
            {/* Ambient Background Gradient */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-50/50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative z-10 flex flex-col h-full">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                            <BookOpen className="w-7 h-7" strokeWidth={1.5} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1 leading-tight" title={flashcardSet?.documentId?.title}>
                                {flashcardSet?.documentId?.title || "Untitled Document"}
                            </h3>
                            <div className="flex items-center gap-1.5 mt-1">
                                <Clock size={12} className="text-slate-400" />
                                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                                    {moment(flashcardSet.createdAt).fromNow()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-8">
                    <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl border border-slate-100 font-bold text-[11px] uppercase tracking-wide">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{totalCards} Cards</span>
                    </div>
                    {progressPercentage > 0 && (
                        <div className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100/50 font-bold text-[11px] uppercase tracking-wide">
                            <TrendingUp className="h-3.5 w-3.5" strokeWidth={2.5} />
                            <span>{progressPercentage}% Mastered</span>
                        </div>
                    )}
                </div>

                {/* Progress Visual */}
                <div className="mt-auto space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">
                            Learning Flow
                        </span>
                        <div className="flex items-baseline gap-1">
                             <span className="text-sm font-black text-slate-900">{reviewedCount}</span>
                             <span className="text-[10px] font-bold text-slate-400">/ {totalCards}</span>
                        </div>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner p-0.5">
                        <div 
                            className="h-full bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600 rounded-full transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-[0_0_8px_rgba(16,185,129,0.3)]" 
                            style={{ width: `${progressPercentage}%` }} 
                        />
                    </div>
                </div>

                {/* Action CTA */}
                <div className="mt-8">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleStudyNow();
                        }}
                        className="w-full relative group/btn overflow-hidden px-6 py-4 bg-slate-900 hover:bg-emerald-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all duration-500 shadow-xl shadow-slate-900/10 hover:shadow-emerald-500/20 flex items-center justify-center gap-3"
                    >
                        <span>Initiate Session</span>
                        <ArrowRight size={16} className="transition-transform duration-500 group-hover/btn:translate-x-1" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FlashcardSetCard;

