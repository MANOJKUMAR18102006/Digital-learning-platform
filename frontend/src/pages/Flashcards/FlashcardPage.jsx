import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronRight, ChevronLeft, ArrowLeft, Trash2, RotateCcw, Award, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

import flashcardService from "../../services/flashcardService";
import aiService from "../../services/aiService";
import PageHeader from "../../components/common/PageHeader";
import Spinner from "../../components/common/Spinner";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Flashcard from "../../components/flashcards/Flashcard";

const FlashcardPage = () => {
  const { id: documentId } = useParams();
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);

  const fetchFlashcards = async () => {
    try {
      const response = await flashcardService.getFlashcardsForDocument(documentId);
      setFlashcardSets(response.data[0] || null);
      setFlashcards(response.data[0]?.cards || []);
    } catch (error) {
      toast.error("Failed to fetch flashcards.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlashcards();
  }, [documentId]);

  const handleNextCard = useCallback(() => {
    if (currentCardIndex === flashcards.length - 1) {
      setSessionComplete(true);
    } else {
      setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
    }
  }, [currentCardIndex, flashcards.length]);

  const handlePrevCard = useCallback(() => {
    setSessionComplete(false);
    setCurrentCardIndex(
      (prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length
    );
  }, [flashcards.length]);

  const handleToggleStar = async (cardId) => {
    try {
      await flashcardService.toggleStar(cardId);
      setFlashcards((prevFlashcards) =>
        prevFlashcards.map((card) =>
          card._id === cardId ? { ...card, isStarred: !card.isStarred } : card
        )
      );
    } catch (error) {
      toast.error("Failed to update star status.");
    }
  };

  const handleDeleteFlashcardSet = async () => {
    setDeleting(true);
    try {
      await flashcardService.deleteFlashcardSet(flashcardSets._id);
      toast.success("Flashcard set deleted successfully!");
      setIsDeleteModalOpen(false);
      fetchFlashcards();
    } catch (error) {
      toast.error(error.message || "Failed to delete flashcard set.");
    } finally {
      setDeleting(false);
    }
  };

  const restartSession = () => {
    setCurrentCardIndex(0);
    setSessionComplete(false);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "ArrowRight") handleNextCard();
      if (e.code === "ArrowLeft") handlePrevCard();
      if (e.code === "KeyR" && sessionComplete) restartSession();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNextCard, handlePrevCard, sessionComplete]);

  const currentCard = flashcards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / flashcards.length) * 100;

  if (loading) return <Spinner />;

  if (flashcards.length === 0) {
    return (
      <EmptyState
        title="No Flashcards Yet"
        description="Generate flashcards from your document to start learning."
      />
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50/50">
      <PageHeader title={flashcardSets?.documentId?.title || "Flashcards"}>
        <div className="flex items-center gap-3">
          <Link to="/flashcards">
            <Button variant="secondary" size="sm" className="hidden sm:flex items-center gap-2">
              <ArrowLeft size={16} /> Back to Sets
            </Button>
          </Link>
          {flashcards.length > 0 && (
            <Button 
              onClick={() => setIsDeleteModalOpen(true)} 
              variant="danger" 
              size="sm"
              className="flex items-center gap-2 bg-red-50 text-red-600 border-red-100 hover:bg-red-600 hover:text-white"
              disabled={deleting}
            >
              <Trash2 size={16} /> Delete Set
            </Button>
          )}
        </div>
      </PageHeader>

      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Progress Display */}
        <div className="mb-10 max-w-2xl mx-auto w-full">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 tracking-tight">PROGRESS</span>
              <span className="text-xs font-medium text-slate-400">
                {currentCardIndex + 1} of {flashcards.length} cards
              </span>
            </div>
            <span className="text-xs font-bold text-emerald-500">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-emerald-500 transition-all duration-500 ease-out shadow-[0_0_12px_rgba(16,185,129,0.4)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-10">
          {!sessionComplete ? (
            <>
              {/* Card Container */}
              <div className="w-full max-w-2xl transform transition-all duration-500">
                <Flashcard flashcard={currentCard} onToggleStar={handleToggleStar} />
              </div>

              {/* Controls */}
              <div className="flex flex-col items-center gap-8 w-full">
                <div className="flex items-center justify-between w-full max-w-md bg-white p-3 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
                  <Button
                    onClick={handlePrevCard}
                    variant="secondary"
                    disabled={currentCardIndex === 0}
                    className="w-14 h-14 !p-0 rounded-2xl flex items-center justify-center hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-30"
                    title="Previous Card"
                  >
                    <ChevronLeft size={28} />
                  </Button>

                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-black text-slate-900 leading-none">
                      {currentCardIndex + 1}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1.5">
                      Current
                    </span>
                  </div>

                  <Button
                    onClick={handleNextCard}
                    variant="secondary"
                    className="w-14 h-14 !p-0 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-95"
                    title="Next Card"
                  >
                    <ChevronRight size={28} />
                  </Button>
                </div>

                {/* Hint / Tip */}
                <div className="flex items-center gap-2 text-slate-400 text-xs font-medium bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm">
                  <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600">←</kbd> Previous</span>
                  <span className="w-1 h-1 bg-slate-200 rounded-full mx-1" />
                  <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600">→</kbd> Next</span>
                  <span className="w-1 h-1 bg-slate-200 rounded-full mx-1" />
                  <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600">Space</kbd> Flip</span>
                </div>
              </div>
            </>
          ) : (
              /* Session Complete View */
              <div className="w-full max-w-lg bg-white rounded-[2.5rem] p-12 text-center shadow-2xl shadow-emerald-500/10 border border-emerald-50 relative overflow-hidden animate-in fade-in zoom-in duration-500">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-500" />
                <div className="flex justify-center mb-8">
                  <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center animate-bounce shadow-inner border border-emerald-100/50">
                    <Award size={48} strokeWidth={1.5} />
                  </div>
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-3">Session Complete!</h2>
                <p className="text-slate-500 font-medium mb-10 leading-relaxed">
                  Excellent work! You've successfully reviewed all {flashcards.length} cards in this set.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-10 text-left">
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Duration</p>
                    <p className="text-xl font-bold text-slate-800">12:45</p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Accuracy</p>
                    <p className="text-xl font-bold text-slate-800">92%</p>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <Button 
                    onClick={restartSession}
                    variant="primary" 
                    className="w-full py-4 text-sm font-bold bg-emerald-500 hover:bg-emerald-600 transition-all rounded-2xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                  >
                    <RotateCcw size={18} /> Restart Review
                  </Button>
                  <Link to="/flashcards">
                    <Button 
                      variant="secondary" 
                      className="w-full py-4 text-sm font-bold rounded-2xl border-slate-200 flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 size={18} /> Done for now
                    </Button>
                  </Link>
                </div>
              </div>
            )}
        </div>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <div className="p-1">
          <p className="text-slate-600 text-sm leading-relaxed mb-8">
            Are you sure you want to delete this flashcard set? This action is permanent and cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={deleting}
              className="flex-1 py-3 rounded-xl font-bold border-slate-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteFlashcardSet}
              disabled={deleting}
              variant="danger"
              className="flex-1 py-3 rounded-xl font-bold bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/10"
            >
              {deleting ? "Deleting..." : "Delete Set"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FlashcardPage;