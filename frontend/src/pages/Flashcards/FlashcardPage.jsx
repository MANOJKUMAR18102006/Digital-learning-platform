import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronRight, ChevronLeft, ArrowLeft, Trash2, Plus } from "lucide-react";
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

  const handleGenerateFlashcards = async () => {
    setGenerating(true);
    try {
      await aiService.generateFlashcards(documentId);
      toast.success("Flashcards generated successfully!");
      fetchFlashcards();
    } catch (error) {
      toast.error(error.message || "Failed to generate flashcards...");
    } finally {
      setGenerating(false);
    }
  };

  const handleNextCard = () => {
    handleReview(currentCardIndex);
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  };

  const handlePrevCard = () => {
    handleReview(currentCardIndex);
    setCurrentCardIndex(
      (prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length
    );
  };

  const handleReview = async (index) => {
    const currentCard = flashcards[index];
    if (!currentCard) return;
    try {
      await flashcardService.reviewFlashcard(currentCard._id, index);
    } catch (error) {
      toast.error("Failed to review flashcard.");
    }
  };

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

  const currentCard = flashcards[currentCardIndex];

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

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex flex-col items-center gap-10">
          {/* Card Container */}
          <div className="w-full max-w-2xl transform transition-all duration-500 hover:scale-[1.01]">
            <Flashcard flashcard={currentCard} onToggleStar={handleToggleStar} />
          </div>
          {/* Controls */}
          <div className="flex flex-col items-center gap-8 w-full">
            <div className="flex items-center justify-between w-full max-w-md bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
              <Button
                onClick={handlePrevCard}
                variant="secondary"
                disabled={flashcards.length <= 1}
                className="w-12 h-12 !p-0 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-colors"
                title="Previous Card"
              >
                <ChevronLeft size={24} />
              </Button>

              <div className="flex flex-col items-center">
                <span className="text-xl font-bold text-slate-900 leading-none">
                  {currentCardIndex + 1}
                </span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                  of {flashcards.length}
                </span>
              </div>

              <Button
                onClick={handleNextCard}
                variant="secondary"
                disabled={flashcards.length <= 1}
                className="w-12 h-12 !p-0 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-colors"
                title="Next Card"
              >
                <ChevronRight size={24} />
              </Button>
            </div>

            {/* Hint / Tip */}
            <div className="text-center text-slate-400 text-sm animate-pulse">
              Tip: Press space to flip the card or arrow keys to navigate
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete Flashcard Set"
      >
        <div className="">
          <p className="">
            Are you sure you want to delete all flashcards for this document?
            This action cannot be undone.
          </p>
          <div className="">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteFlashcardSet}
              disabled={deleting}
              className=""
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FlashcardPage;