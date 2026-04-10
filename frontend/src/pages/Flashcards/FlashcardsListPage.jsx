import React, { useState, useEffect } from 'react';
import flashcardService from '../../services/flashcardService';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import FlashcardSetCard from '../../components/flashcards/FlashcardSetCard';
import { toast } from 'react-hot-toast';

const FlashcardsListPage = () => {
    const [flashcardSets, setFlashcardSets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFlashcardSets = async () => {
            try {
                const response = await flashcardService.getAllFlashcardSets();
                console.log("fetchFlashcardSets__", response.data);
                setFlashcardSets(response.data);
            } catch (error) {
                toast.error('Failed to fetch flashcard sets');
                console.error(error);
            }finally{
              setLoading(false);
            }
        };

        fetchFlashcardSets();
    }, []);
    
const renderContent = () => {
  if (loading) {
    return <Spinner />;
  }

  if (flashcardSets.length === 0) {
    return (
      <EmptyState
        title="No Flashcard Sets Found"
        description="You haven't generated any flashcards yet. Go to a document to create some."
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {flashcardSets.map((set) => {
          return <FlashcardSetCard key={set._id} flashcardSet={set} />;
        })}
      </div>
    </div>
  );
};

return (
  <div className="min-h-screen bg-slate-50/50">
    <div className="bg-white border-b border-slate-200 mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <PageHeader 
          title="Flashcard Sets" 
          subtitle="Review and master your documents through interactive flashcards" 
        />
      </div>
    </div>
    {renderContent()}
  </div>
);
}

export default FlashcardsListPage;
