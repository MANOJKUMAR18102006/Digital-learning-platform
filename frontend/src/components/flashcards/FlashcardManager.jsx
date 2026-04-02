import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Trash2, ArrowLeft, Sparkles, Brain } from "lucide-react";
import toast from "react-hot-toast";
import flashcardService from "../../services/flashcardService";
import aiService from "../../services/aiService";
import Spinner from "../common/Spinner";
import Flashcard from "./Flashcard";

const FlashcardManager = ({ documentId }) => {
    const [flashcardSets, setFlashcardSets] = useState([]);
    const [selectedSet, setSelectedSet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [setToDelete, setSetToDelete] = useState(null);

    const fetchFlashcardSets = async () => {
        setLoading(true);
        try {
            const response = await flashcardService.getFlashcardsForDocument(documentId);
            setFlashcardSets(response.data);
        } catch (error) {
            toast.error("Failed to fetch flashcard sets.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (documentId) fetchFlashcardSets();
    }, [documentId]);

    const handleGenerateFlashcards = async () => {
        setGenerating(true);
        try {
            await aiService.generateFlashcards(documentId);
            toast.success("Flashcards generated successfully!");
            fetchFlashcardSets();
        } catch (error) {
            toast.error(error.message || "Failed to generate flashcards.");
        } finally {
            setGenerating(false);
        }
    };

    const handleNextCard = () => {
        if (selectedSet) {
            handleReview(currentCardIndex);
            setCurrentCardIndex((prev) => (prev + 1) % selectedSet.cards.length);
        }
    };

    const handlePrevCard = () => {
        if (selectedSet) {
            handleReview(currentCardIndex);
            setCurrentCardIndex((prev) => (prev - 1 + selectedSet.cards.length) % selectedSet.cards.length);
        }
    };

    const handleReview = async (index) => {
        const currentCard = selectedSet?.cards[index];
        if (!currentCard) return;
        try {
            await flashcardService.reviewFlashcard(currentCard._id, index);
        } catch (error) {
            console.error("Failed to review flashcard.", error);
        }
    };

    const handleToggleStar = async (card) => {
        if (!card) return;
        try {
            await flashcardService.toggleStar(card._id);
            setSelectedSet((prev) => ({
                ...prev,
                cards: prev.cards.map((c) =>
                    c._id === card._id ? { ...c, isStarred: !c.isStarred } : c
                ),
            }));
        } catch (error) {
            toast.error('Failed to toggle star.');
        }
    };

    const handleDeleteRequest = (e, set) => {
        e.stopPropagation();
        setSetToDelete(set);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!setToDelete) return;
        setDeleting(true);
        try {
            await flashcardService.deleteFlashcardSet(setToDelete._id);
            toast.success("Flashcard set deleted.");
            setIsDeleteModalOpen(false);
            setSetToDelete(null);
            if (selectedSet?._id === setToDelete._id) setSelectedSet(null);
            fetchFlashcardSets();
        } catch (error) {
            toast.error(error.message || "Failed to delete flashcard set.");
        } finally {
            setDeleting(false);
        }
    };

    const handleSelectSet = (set) => {
        setSelectedSet(set);
        setCurrentCardIndex(0);
    };

    const renderFlashcardViewer = () => {
        if (!selectedSet) return null;
        const currentCard = selectedSet.cards[currentCardIndex];

        return (
            <div className="flex flex-col gap-4">
                <button
                    onClick={() => setSelectedSet(null)}
                    className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors w-fit"
                >
                    <ArrowLeft className="h-4 w-4" strokeWidth={2} />
                    Back to sets
                </button>
                <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-slate-800">{selectedSet.title}</h3>
                    <span className="text-sm text-slate-400">{currentCardIndex + 1} / {selectedSet.cards.length}</span>
                </div>
                <div className="flex flex-col items-center space-y-8">
                    <div className="w-full max-w-2xl">
                        <Flashcard flashcard={currentCard} onToggleStar={handleToggleStar} />
                    </div>
                </div>
                <div className="flex items-center justify-center gap-3">
                    <button onClick={handlePrevCard} className="flex items-center justify-center h-10 w-10 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
                        <ChevronLeft className="h-5 w-5" strokeWidth={2} />
                    </button>
                    <button onClick={handleNextCard} className="flex items-center justify-center h-10 w-10 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
                        <ChevronRight className="h-5 w-5" strokeWidth={2} />
                    </button>
                </div>
            </div>
        );
    };

    const renderSetList = () => {
        if (loading) return <div className="flex items-center justify-center py-12"><Spinner /></div>;

        if (flashcardSets.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                    <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-400">
                        <Brain className="h-7 w-7" strokeWidth={2} />
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-slate-800 mb-1">No Flashcards Yet</h3>
                        <p className="text-sm text-slate-400 max-w-xs">Generate flashcards from your document to start learning.</p>
                    </div>
                    <button onClick={handleGenerateFlashcards} disabled={generating} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-60">
                        {generating ? (
                            <><div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating...</>
                        ) : (
                            <><Sparkles className="h-4 w-4" strokeWidth={2} />Generate Flashcards</>
                        )}
                    </button>
                </div>
            );
        }

        return (
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-slate-500">{flashcardSets.length} set{flashcardSets.length > 1 ? 's' : ''}</p>
                    <button onClick={handleGenerateFlashcards} disabled={generating} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-xs font-medium rounded-lg transition-colors disabled:opacity-60">
                        <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
                        {generating ? 'Generating...' : 'Generate More'}
                    </button>
                </div>
                {flashcardSets.map((set) => (
                    <div key={set._id} onClick={() => handleSelectSet(set)} className="group flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-emerald-300 hover:shadow-sm transition-all cursor-pointer">
                        <div>
                            <p className="text-sm font-semibold text-slate-800">{set.title}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{set.cards?.length || 0} cards</p>
                        </div>
                        <button onClick={(e) => handleDeleteRequest(e, set)} className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all">
                            <Trash2 className="h-4 w-4" strokeWidth={2} />
                        </button>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="p-4">
            {selectedSet ? renderFlashcardViewer() : renderSetList()}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-2">Delete Flashcard Set</h2>
                        <p className="text-sm text-slate-500 mb-6">Are you sure you want to delete <span className="font-medium text-slate-900">"{setToDelete?.title}"</span>? This cannot be undone.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 h-11 border-2 border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors">Cancel</button>
                            <button onClick={handleConfirmDelete} disabled={deleting} className="flex-1 h-11 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-60">
                                {deleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FlashcardManager;
