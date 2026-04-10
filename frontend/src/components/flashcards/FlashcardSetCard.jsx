import React from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Sparkles, TrendingUp } from "lucide-react";
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
            className="group relative bg-white border border-slate-200 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1 cursor-pointer"
            onClick={handleStudyNow}
        >
            <div className="flex flex-col h-full">
                {/* Icon and Title */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                            <BookOpen className="w-5 h-5" strokeWidth={2} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1" title={flashcardSet?.documentId?.title}>
                                {flashcardSet?.documentId?.title || "Untitled Document"}
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5 font-medium">
                                Created {moment(flashcardSet.createdAt).fromNow()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg border border-slate-100">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span className="text-xs font-semibold">
                            {totalCards} {totalCards === 1 ? 'Card' : 'Cards'}
                        </span>
                    </div>
                    {reviewedCount > 0 && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
                            <TrendingUp className="h-3.5 w-3.5" strokeWidth={2.5} />
                            <span className="text-xs font-semibold">
                                {progressPercentage}% Mastered
                            </span>
                        </div>
                    )}
                </div>

                {/* Progress Bar */}
                <div className="mt-auto">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                            Progress
                        </span>
                        <span className="text-[11px] font-bold text-slate-600">
                            {reviewedCount}/{totalCards} cards reviewed
                        </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-700 ease-out" 
                            style={{ width: `${progressPercentage}%` }} 
                        />
                    </div>
                </div>

                {/* Study Button */}
                <div className="mt-6">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleStudyNow();
                        }}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-emerald-600 text-white text-sm font-bold rounded-xl transition-all duration-300 shadow-sm"
                    >
                        Study Now
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FlashcardSetCard;
