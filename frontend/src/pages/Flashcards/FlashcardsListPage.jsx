import React, { useState, useEffect } from 'react';
import FlashcardService from '../../services/flashcardService';
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
    <div className="">
      {flashcardSets.map((set) => {
        return <FlashcardSetCard key={set._id} flashcardSet={set} />;
      })}
    </div>
  );
};

return (
  <div>
    <PageHeader title="Flashcard Sets" />
    {renderContent()}
  </div>
);
}

export default FlashcardsListPage;
