import React, { useState } from "react";
import { Star, RotateCcw, RotateCw } from "lucide-react";

const Flashcard = ({ flashcard, onToggleStar }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    return (
        <div className="flex flex-col items-center gap-4">
            {/* Card */}
            <div
                onClick={handleFlip}
                className="relative w-full cursor-pointer"
                style={{ perspective: '1000px' }}
            >
                <div
                    className="relative w-full transition-transform duration-500"
                    style={{
                        transformStyle: 'preserve-3d',
                        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                        minHeight: '220px',
                    }}
                >
                    {/* Front */}
                    <div
                        className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl shadow-sm"
                        style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                    >
                        {/* Star Button */}
                        <button
                            onClick={(e) => { e.stopPropagation(); onToggleStar?.(flashcard._id); }}
                            className={`absolute top-3 right-3 w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                                flashcard?.isStarred
                                    ? 'bg-amber-50 text-amber-500 border border-amber-200 hover:bg-amber-100'
                                    : 'bg-white text-slate-300 border border-slate-200 hover:text-amber-400'
                            }`}
                        >
                            <Star className="h-4 w-4" strokeWidth={2} fill={flashcard?.isStarred ? 'currentColor' : 'none'} />
                        </button>
                        <span className="text-xs font-semibold text-emerald-500 uppercase tracking-widest mb-4">Question</span>
                        {/* Question Content */}
                        <div className="flex-1 flex items-center justify-center px-4">
                            <p className="text-slate-800 text-base font-medium text-center leading-relaxed">
                                {flashcard?.front}
                            </p>
                        </div>
                        {/* Flip Indicator */}
                        <div className="flex items-center gap-1.5 mt-6 text-xs text-slate-400">
                            <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} />
                            <span>Click to reveal answer</span>
                        </div>
                    </div>

                    {/* Back of the card (Answer) */}
                    <div
                        className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl shadow-sm"
                        style={{
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)'
                        }}
                    >
                        {/* Star Button */}
                        <button
                            onClick={(e) => { e.stopPropagation(); onToggleStar?.(flashcard._id); }}
                            className={`absolute top-3 right-3 w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                                flashcard?.isStarred
                                    ? 'bg-white/20 text-amber-400 border border-amber-400/40 hover:bg-white/30'
                                    : 'bg-white/10 text-white/30 border border-white/20 hover:text-amber-400'
                            }`}
                        >
                            <Star className="w-4 h-4" strokeWidth={2} fill={flashcard?.isStarred ? 'currentColor' : 'none'} />
                        </button>
                        <span className="text-xs font-semibold text-teal-400 uppercase tracking-widest mb-4">Answer</span>
                        <div className="flex-1 flex items-center justify-center px-4 py-6">
                            <p className="text-base text-white text-center leading-relaxed font-medium">
                                {flashcard?.back}
                            </p>
                        </div>
                        {/* Flip Indicator */}
                        <div className="flex items-center justify-center gap-2 text-xs text-white/70 font-medium">
                            <RotateCw className="w-3.5 h-3.5" strokeWidth={2} />
                            <span>Click to see question</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Flashcard;
