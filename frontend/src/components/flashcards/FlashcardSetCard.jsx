import React from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Sparkles, TrendingUp } from "lucide-react";
import moment from "moment";

const FlashcardSetCard = ({ flashcardSet }) => {
    const navigate = useNavigate();

    const handleStudyNow = () => {
        navigate(`/documents/${flashcardSet.documentId}/flashcards`);
    };

    const reviewedCount = flashcardSet.cards.filter(card => card.lastReviewed).length;
    const totalCards = flashcardSet.cards.length;
    const progressPercentage = totalCards > 0 ? Math.round((reviewedCount / totalCards) * 100) : 0;
    return (
        <div className="" onClick={handleStudyNow}>
            <div className="">
                {/* Icon and Title */}
                <div className="">
                    <BookOpen className="" strokeWidth={2} />
                    <div className="">
                        <h3 className="" title={flashcardSet?.documentId7.title}>
                            {flashcardSet?.documentId7.title}
                        </h3>
                    </div>
                    <p className="">
                        Created {moment(flashcardSet.createdAt).fromNow()}
                    </p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-2 mt-3">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-lg">
                        <span className="text-xs font-medium text-slate-600">
                            {totalCards} {totalCards === 1 ? 'Card' : 'Cards'}
                        </span>
                    </div>
                    {reviewedCount > 0 && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 rounded-lg">
                            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" strokeWidth={2.5} />
                            <span className="text-xs font-medium text-emerald-600">
                                {progressPercentage}%
                            </span>
                        </div>
                    )}
                </div>

                {/* Progress Bar */}
                {totalCards > 0 && (
                    <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-slate-400">
                            Progress
                        </span>
                        <span className="text-xs text-slate-400">
                            {reviewedCount}/{totalCards} reviewed
                        </span>
                    </div>
                )}
                <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full transition-all duration-300" style={{ width: `${progressPercentage}%` }} />
                </div>

                {/* Study Button */}
                <div className="mt-4">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleStudyNow();
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-xl transition-colors"
                    >
                        <Sparkles className="h-4 w-4" strokeWidth={2.5} />
                        Study Now
                    </button>
                </div>

            </div>

        </div>
    )
}

export default FlashcardSetCard;
