import React, { useState } from "react";
import { Star, RotateCcw, RotateCw, Lightbulb, CheckCircle2 } from "lucide-react";

const Flashcard = ({ flashcard, onToggleStar }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    return (
        <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
            {/* Card Container */}
            <div
                onClick={handleFlip}
                className="relative w-full cursor-pointer group"
                style={{ perspective: '2000px' }}
            >
                <div
                    className={`relative w-full transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] transform-gpu`}
                    style={{
                        transformStyle: 'preserve-3d',
                        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                        minHeight: '380px',
                    }}
                >
                    {/* Front Face (Question) */}
                    <div
                        className="absolute inset-0 flex flex-col p-10 bg-white border border-slate-200 rounded-[2rem] shadow-xl overflow-hidden"
                        style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                    >
                        {/* Decorative Background Element */}
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100/50">
                                    <Lightbulb className="h-3.5 w-3.5" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Question</span>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onToggleStar?.(flashcard._id); }}
                                    className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                                        flashcard?.isStarred
                                            ? 'bg-amber-50 text-amber-500 shadow-sm border border-amber-100'
                                            : 'bg-slate-50 text-slate-300 hover:text-amber-400 hover:bg-amber-50'
                                    }`}
                                >
                                    <Star className="h-5 w-5" strokeWidth={2.5} fill={flashcard?.isStarred ? 'currentColor' : 'none'} />
                                </button>
                            </div>

                            <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                                <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 leading-tight mb-4">
                                    {flashcard?.question || flashcard?.front}
                                </h3>
                                {flashcard?.difficulty && (
                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                                        flashcard.difficulty === 'hard' ? 'bg-red-50 text-red-500' :
                                        flashcard.difficulty === 'medium' ? 'bg-amber-50 text-amber-500' :
                                        'bg-blue-50 text-blue-500'
                                    }`}>
                                        {flashcard.difficulty}
                                    </span>
                                )}
                            </div>

                            <div className="mt-8 flex items-center justify-center gap-2.5 text-slate-400 font-medium text-sm group-hover:text-emerald-500 transition-colors">
                                <RotateCcw className="h-4 w-4 animate-spin-slow" />
                                <span>Click to flip</span>
                            </div>
                        </div>
                    </div>

                    {/* Back Face (Answer) */}
                    <div
                        className="absolute inset-0 flex flex-col p-10 bg-slate-900 border border-slate-800 rounded-[2rem] shadow-2xl overflow-hidden"
                        style={{
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)'
                        }}
                    >
                        {/* Decorative Background Element */}
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl opacity-60" />

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-2 px-4 py-1.5 bg-white/10 text-emerald-400 rounded-full border border-white/5">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Answer</span>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onToggleStar?.(flashcard._id); }}
                                    className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                                        flashcard?.isStarred
                                            ? 'bg-amber-400 text-slate-900 shadow-lg shadow-amber-400/20'
                                            : 'bg-white/5 text-slate-500 hover:text-amber-400 hover:bg-white/10'
                                    }`}
                                >
                                    <Star className="h-5 w-5" strokeWidth={2.5} fill={flashcard?.isStarred ? 'currentColor' : 'none'} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar flex items-center justify-center text-center px-4">
                                <p className="text-lg sm:text-xl text-slate-100 leading-relaxed font-medium">
                                    {flashcard?.answer || flashcard?.back}
                                </p>
                            </div>

                            <div className="mt-8 flex items-center justify-center gap-2.5 text-slate-500 font-medium text-sm hover:text-emerald-400 transition-colors">
                                <RotateCw className="h-4 w-4" />
                                <span>Return to question</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Flashcard;

