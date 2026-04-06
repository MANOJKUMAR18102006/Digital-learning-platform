import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import quizService from '../../services/quizService';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';
import { ArrowLeft, CheckCircle2, XCircle, Trophy, Target, BookOpen } from 'lucide-react';

const QuizResultPage = () => {
  const { quizId } = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await quizService.getQuizResults(quizId);
        setResults(data);
      } catch (error) {
        toast.error('Failed to fetch quiz result');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [quizId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (!results) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-slate-500 text-sm">Quiz results not found.</p>
      </div>
    );
  }

  const { quiz, results: detailedResults, totalQuestions } = results;
  const score = quiz.score;
  const correctAnswers = detailedResults.filter(r => r.isCorrect).length;
  const incorrectAnswers = totalQuestions - correctAnswers;
  const documentId = quiz.document?._id || quiz.document;

  const getScoreColor = (score) => {
    if (score >= 80) return 'from-emerald-500 to-teal-500';
    if (score >= 60) return 'from-amber-500 to-orange-500';
    return 'from-rose-500 to-red-500';
  };

  const getScoreMessage = (score) => {
    if (score >= 90) return 'Outstanding! 🎉';
    if (score >= 80) return 'Great job! 🌟';
    if (score >= 70) return 'Good work! 👍';
    if (score >= 60) return 'Not bad! 💪';
    return 'Keep practicing! 📚';
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Back Button */}
      <div className="mb-4">
        <Link
          to={`/documents/${documentId}`}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2} />
          Back to Document
        </Link>
      </div>

      <PageHeader title={`${quiz.title || 'Quiz'} Results`} />

      {/* Score Card */}
      <div className={`bg-gradient-to-br ${getScoreColor(score)} rounded-2xl p-8 text-white text-center mb-6 shadow-lg`}>
        <div className="flex items-center justify-center h-14 w-14 rounded-full bg-white/20 mx-auto mb-4">
          <Trophy className="h-7 w-7" strokeWidth={2} />
        </div>
        <p className="text-sm font-medium opacity-80 mb-1">Your Score</p>
        <div className="text-6xl font-bold mb-2">{score}%</div>
        <p className="text-sm font-medium opacity-90">{getScoreMessage(score)}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-sm">
          <Target className="h-5 w-5 text-slate-400 mx-auto mb-2" strokeWidth={2} />
          <p className="text-2xl font-bold text-slate-900">{totalQuestions}</p>
          <p className="text-xs text-slate-400 mt-0.5">Total</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-sm">
          <CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto mb-2" strokeWidth={2} />
          <p className="text-2xl font-bold text-emerald-600">{correctAnswers}</p>
          <p className="text-xs text-slate-400 mt-0.5">Correct</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-sm">
          <XCircle className="h-5 w-5 text-red-400 mx-auto mb-2" strokeWidth={2} />
          <p className="text-2xl font-bold text-red-500">{incorrectAnswers}</p>
          <p className="text-xs text-slate-400 mt-0.5">Incorrect</p>
        </div>
      </div>

      {/* Questions Review */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
          <BookOpen className="h-4 w-4 text-slate-400" strokeWidth={2} />
          <h3 className="text-sm font-semibold text-slate-800">Detailed Review</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {detailedResults.map((result, index) => {
            const userAnswerIndex = result.options.findIndex(opt => opt === result.selected);
            const correctAnswerIndex = result.correctAnswer.startsWith('0')
              ? parseInt(result.correctAnswer.substring(1)) - 1
              : result.options.findIndex(opt => opt === result.correctAnswer);
            const isCorrect = result.isCorrect;

            return (
              <div key={index} className="px-5 py-4">
                <div className="flex items-start gap-3 mb-3">
                  {isCorrect ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" strokeWidth={2} />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" strokeWidth={2} />
                  )}
                  <p className="text-sm font-medium text-slate-800">
                    {index + 1}. {result.question}
                  </p>
                </div>
                <div className="ml-8 space-y-1.5">
                  {result.options.map((option, optIndex) => (
                    <div
                      key={optIndex}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${optIndex === correctAnswerIndex
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : optIndex === userAnswerIndex && !isCorrect
                            ? 'bg-red-50 text-red-600 border border-red-200'
                            : 'bg-slate-50 text-slate-500 border border-transparent'
                        }`}
                    >
                      <span className={`flex items-center justify-center h-5 w-5 rounded-full text-xs font-bold flex-shrink-0 ${optIndex === correctAnswerIndex
                          ? 'bg-emerald-500 text-white'
                          : optIndex === userAnswerIndex && !isCorrect
                            ? 'bg-red-400 text-white'
                            : 'bg-slate-200 text-slate-500'
                        }`}>
                        {String.fromCharCode(65 + optIndex)}
                      </span>
                      {option}
                      {optIndex === correctAnswerIndex && (
                        <CheckCircle2 className="ml-auto h-3.5 w-3.5 text-emerald-500" strokeWidth={2.5} />
                      )}
                      {optIndex === userAnswerIndex && !isCorrect && (
                        <XCircle className="ml-auto h-3.5 w-3.5 text-red-400" strokeWidth={2.5} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-8 flex justify-center">
        <Link to={`/documents/${documentId}`}>
          <button className="group relative px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-medium rounded-xl transition-all shadow-md shadow-emerald-500/25">
            <span className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" strokeWidth={2.5} />
              Return to Document
            </span>
          </button>
        </Link>
      </div>

    </div>
  );
};

export default QuizResultPage;