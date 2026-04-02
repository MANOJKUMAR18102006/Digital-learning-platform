import React, { useState, useEffect } from 'react';
import { Plus, Trash2, BrainCircuit, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import quizService from '../../services/quizService';
import aiService from '../../services/aiService';
import Spinner from '../common/Spinner';

const QuizManager = ({ documentId }) => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [numQuestions, setNumQuestions] = useState(5);
    const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const navigate = useNavigate();

    const fetchQuizzes = async () => {
        setLoading(true);
        try {
            const data = await quizService.getQuizzesForDocument(documentId);
            setQuizzes(data.data);
        } catch (error) {
            toast.error('Failed to fetch quizzes.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (documentId) {
            fetchQuizzes();
        }
    }, [documentId]);

    const handleGenerateQuiz = async (e) => {
        e.preventDefault();
        setGenerating(true);
        try {
            await aiService.generateQuiz(documentId, { numQuestions });
            toast.success('Quiz generated successfully!');
            setIsGenerateModalOpen(false);
            fetchQuizzes();
        } catch (error) {
            toast.error(error.message || 'Failed to generate quiz.');
        } finally {
            setGenerating(false);
        }
    };

    const handleDeleteRequest = (quiz) => {
        setSelectedQuiz(quiz);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedQuiz) return;
        setDeleting(true);
        try {
            await quizService.deleteQuiz(selectedQuiz._id);
            toast.success('Quiz deleted.');
            setIsDeleteModalOpen(false);
            setSelectedQuiz(null);
            setQuizzes(quizzes.filter((q) => q._id !== selectedQuiz._id));
        } catch (error) {
            toast.error(error.message || 'Failed to delete quiz.');
        } finally {
            setDeleting(false);
        }
    };

    const renderQuizContent = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center py-12">
                    <Spinner />
                </div>
            );
        }

        if (quizzes.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                    <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-400">
                        <BrainCircuit className="h-7 w-7" strokeWidth={2} />
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-slate-800 mb-1">No Quizzes Yet</h3>
                        <p className="text-sm text-slate-400 max-w-xs">Generate a quiz from your document to test your knowledge.</p>
                    </div>
                    <button
                        onClick={() => setIsGenerateModalOpen(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-xl transition-colors"
                    >
                        <Plus className="h-4 w-4" strokeWidth={2.5} />
                        Generate Quiz
                    </button>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {quizzes.map((quiz) => (
                    <div
                        key={quiz._id}
                        className="group relative bg-white border border-slate-200 rounded-2xl p-5 hover:border-emerald-300 hover:shadow-sm transition-all cursor-pointer"
                        onClick={() => navigate(`/quizzes/${quiz._id}`)}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-emerald-50 text-emerald-500">
                                <BrainCircuit className="h-5 w-5" strokeWidth={2} />
                            </div>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleDeleteRequest(quiz); }}
                                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"
                            >
                                <Trash2 className="h-4 w-4" strokeWidth={2} />
                            </button>
                        </div>
                        <p className="text-sm font-semibold text-slate-800 truncate mb-1">{quiz.title}</p>
                        <p className="text-xs text-slate-400">{quiz.questions?.length || 0} questions</p>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="p-4">
            <div className="flex justify-end mb-4">
                {quizzes.length > 0 && (
                    <button
                        onClick={() => setIsGenerateModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-xl transition-colors"
                    >
                        <Plus className="h-4 w-4" strokeWidth={2.5} />
                        Generate Quiz
                    </button>
                )}
            </div>

            {renderQuizContent()}

            {/* Generate Quiz Modal */}
            {isGenerateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-semibold text-slate-900">Generate New Quiz</h2>
                            <button onClick={() => setIsGenerateModalOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <form onSubmit={handleGenerateQuiz} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">Number of Questions</label>
                                <input
                                    type="number"
                                    value={numQuestions}
                                    onChange={(e) => setNumQuestions(Math.max(1, parseInt(e.target.value) || 1))}
                                    min="1"
                                    required
                                    className="w-full h-11 px-4 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    className="flex-1 h-11 border-2 border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors"
                                    type="button"
                                    onClick={() => setIsGenerateModalOpen(false)}
                                    disabled={generating}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={generating}
                                    className="flex-1 h-11 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-60"
                                >
                                    {generating ? 'Generating...' : 'Generate'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-2">Delete Quiz</h2>
                        <p className="text-sm text-slate-500 mb-6">
                            Are you sure you want to delete <span className="font-medium text-slate-900">"{selectedQuiz?.title}"</span>? This cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="flex-1 h-11 border-2 border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                disabled={deleting}
                                className="flex-1 h-11 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-60"
                            >
                                {deleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuizManager;