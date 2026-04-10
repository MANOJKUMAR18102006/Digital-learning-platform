import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import quizService from '../../services/quizService';
import aiService from '../../services/aiService';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import MarkdownRenderer from '../../components/common/MarkdownRenderer';
import toast from 'react-hot-toast';
import { ArrowLeft, CheckCircle2, XCircle, Trophy, Target, BookOpen, Sparkles, Brain } from 'lucide-react';

const QuizResultPage = () => {
  const { quizId } = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleAnalyzeQuiz = async () => {
    setAnalyzing(true);
    try {
      const quizData = detailedResults.map(r => ({
        question: r.question,
        selectedAnswer: r.selectedAnswer,
        correctAnswer: r.correctAnswer,
        isCorrect: r.isCorrect
      }));
      const response = await aiService.analyzeQuiz(quizData);
      setAnalysis(response.data);
      toast.success('Analysis complete!');
    } catch (error) {
      toast.error('Failed to analyze quiz');
    } finally {
      setAnalyzing(false);
    }
  };

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

      {/* AI Analysis Section */}
      {!analysis ? (
        <div className="mb-8">
          <button
            onClick={handleAnalyzeQuiz}
            disabled={analyzing}
            className="w-full group relative flex items-center justify-center gap-3 py-4 bg-white border-2 border-slate-200 border-dashed rounded-2xl hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-300 disabled:opacity-50"
          >
            {analyzing ? (
              <>
                <Spinner className="w-5 h-5" />
                <span className="text-sm font-bold text-slate-600">AI is analyzing your struggles...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-emerald-500 group-hover:rotate-12 transition-transform" />
                <span className="text-sm font-bold text-slate-700">Analyze My Struggles with AI</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="mb-8 bg-emerald-50/50 border border-emerald-100 rounded-3xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 leading-none">Personalized Struggle Analysis</h3>
              <p className="text-xs text-emerald-600 font-bold uppercase tracking-widest mt-1 italic">Knowledge Gap Report</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-emerald-100/50 shadow-inner">
            <MarkdownRenderer content={analysis} />
          </div>
          
          <div className="mt-8 pt-6 border-t border-emerald-100 flex items-center justify-between">
             <p className="text-xs text-slate-500 font-medium">Ready to fix these gaps?</p>
             <Link to={`/documents/${documentId}`}>
                <button className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95">
                  <BookOpen className="w-3.5 h-3.5" /> Study Weak Topics
                </button>
             </Link>
          </div>
        </div>
      )}

      {/* Questions Review */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
          <BookOpen className="h-4 w-4 text-slate-400" strokeWidth={2} />
          <h3 className="text-sm font-semibold text-slate-800">Detailed Review</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {detailedResults.map((result, index) => {
            const normalize = (str) => str?.toLowerCase().replace(/[^a-z0-9]/g, '').trim() || '';
            const normalizedOptions = result.options.map(opt => normalize(opt));
            const normalizedUser = normalize(result.selectedAnswer);
            const normalizedCorrect = normalize(result.correctAnswer);

            const userAnswerIndex = normalizedOptions.findIndex(opt => opt === normalizedUser);
            const correctAnswerIndex = normalizedOptions.findIndex(opt => opt === normalizedCorrect);
            const isCorrect = result.isCorrect;

            return (
              <div key={index} className="px-5 py-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className={`mt-0.5 flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${isCorrect ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-500'}`}>
                    {isCorrect ? (
                      <CheckCircle2 className="h-4 w-4" strokeWidth={2.5} />
                    ) : (
                      <XCircle className="h-4 w-4" strokeWidth={2.5} />
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                      {index + 1}. {result.question}
                    </p>
                    {!isCorrect && (
                      <p className="text-xs font-medium text-red-500">
                        Incorrect Answer
                      </p>
                    )}
                  </div>
                </div>

                <div className="ml-9 space-y-2 mb-4">
                  {result.options.map((option, optIndex) => {
                    const isUserChoice = optIndex === userAnswerIndex;
                    const isRightAnswer = optIndex === correctAnswerIndex;
                    
                    return (
                      <div
                        key={optIndex}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium transition-all border ${
                          isRightAnswer
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-100'
                            : isUserChoice && !isCorrect
                              ? 'bg-red-50 text-red-600 border-red-200'
                              : 'bg-slate-50 text-slate-500 border-transparent'
                        }`}
                      >
                        <span className={`flex items-center justify-center h-6 w-6 rounded-lg text-[10px] font-bold flex-shrink-0 ${
                          isRightAnswer
                            ? 'bg-emerald-500 text-white'
                            : isUserChoice && !isCorrect
                              ? 'bg-red-500 text-white'
                              : 'bg-slate-200 text-slate-500'
                        }`}>
                          {String.fromCharCode(65 + optIndex)}
                        </span>
                        <span className="flex-1">{option}</span>
                        {isRightAnswer && (
                          <div className="flex items-center gap-1 text-emerald-600 font-bold uppercase tracking-wider text-[9px]">
                            <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={3} />
                            Correct
                          </div>
                        )}
                        {isUserChoice && !isCorrect && (
                          <div className="flex items-center gap-1 text-red-500 font-bold uppercase tracking-wider text-[9px]">
                            <XCircle className="h-3.5 w-3.5" strokeWidth={3} />
                            Your Choice
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Box */}
                {(result.explanation || !isCorrect) && (
                  <div className="ml-9 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                       <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                       <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Correct Answer & Explanation</h4>
                    </div>
                    <p className="text-xs text-slate-800 mb-2">
                      The correct answer is <span className="font-bold text-emerald-600">"{result.correctAnswer}"</span>.
                    </p>
                    {result.explanation && (
                      <p className="text-xs text-slate-500 leading-relaxed italic">
                        {result.explanation}
                      </p>
                    )}
                  </div>
                )}
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