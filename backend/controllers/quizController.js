import Quiz from '../models/Quiz.js';
import { awardXP, XP_RULES, checkAchievements } from '../utils/gamification.js';
import { logActivity } from '../utils/activityLogger.js';

/**
 * @desc    Get all quizzes for a document
 * @route   GET /api/quizzes/:documentId
 */
export const getQuizzes = async (req, res, next) => {
    try {
        const quizzes = await Quiz.find({
            userId: req.user._id,
            documentId: req.params.documentId,
        })
        .populate('documentId', 'title fileName')
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: quizzes.length,
            data: quizzes
        });
    } catch (error) {
        next(error);
    }
};


/**
 * @desc Get single quiz
 */
export const getQuizById = async (req, res, next) => {
    try {
        const quiz = await Quiz.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!quiz) {
            return res.status(404).json({
                success: false,
                error: 'Quiz not found'
            });
        }

        res.status(200).json({
            success: true,
            data: quiz
        });

    } catch (error) {
        next(error);
    }
};


/**
 * @desc Submit quiz
 */
export const submitQuiz = async (req, res, next) => {
    try {
        const answers = req.body.answers ?? req.body;

        if (!Array.isArray(answers)) {
            return res.status(400).json({
                success: false,
                error: 'Answers must be an array'
            });
        }

        const quiz = await Quiz.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!quiz) {
            return res.status(404).json({
                success: false,
                error: 'Quiz not found'
            });
        }

        if (quiz.completedAt) {
            // Reset quiz to allow resubmission
            quiz.userAnswers = [];
            quiz.score = 0;
            quiz.completedAt = null;
        }

        let correctCount = 0;
        const userAnswers = [];

        answers.forEach(ans => {
            const { questionIndex, selectedAnswer } = ans;

            const question = quiz.questions[questionIndex];

            if (!question) return;

            const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
            const normalizedSelected = normalize(selectedAnswer);
            const normalizedCorrect = normalize(question.correctAnswer);

            const isCorrect = normalizedSelected === normalizedCorrect || 
                             normalizedSelected.includes(normalizedCorrect) || 
                             normalizedCorrect.includes(normalizedSelected);

            if (isCorrect) correctCount++;

            userAnswers.push({
                questionIndex,
                selectedAnswer,
                isCorrect,
                answeredAt: new Date()
            });
        });

        const score = Math.round((correctCount / quiz.totalQuestions) * 100);

        quiz.userAnswers = userAnswers;
        quiz.score = score;
        quiz.completedAt = new Date();

        await quiz.save();

        // 🏆 GAMIFICATION HOOKS
        await awardXP(req.user._id, XP_RULES.QUIZ_COMPLETED);
        
        // Count quizzes to check for badges
        const quizCount = await Quiz.countDocuments({ userId: req.user._id, completedAt: { $ne: null } });
        const newBadges = await checkAchievements(req.user._id, { quizCount });

        // Log Activity
        await logActivity({
            userId: req.user._id,
            type: 'quiz_complete',
            description: `Attempted and scored ${score}% on the quiz: ${quiz.title}`,
            link: `/quizzes/${quiz._id}/results`
        });

        res.status(200).json({
            success: true,
            data: {
                quizId: quiz._id,
                score,
                correctCount,
                totalQuestions: quiz.totalQuestions,
                percentage: score,
                userAnswers,
                newBadges // Show user when they unlock something!
            },
            message: 'Quiz submitted successfully. XP awarded!'
        });

    } catch (error) {
        console.error('submitQuiz error:', error);
        next(error);
    }
};


/**
 * @desc Get quiz results
 */
export const getQuizResults = async (req, res, next) => {
    try {
        const quiz = await Quiz.findOne({
            _id: req.params.id,
            userId: req.user._id
        }).populate('documentId', 'title');

        if (!quiz) {
            return res.status(404).json({
                success: false,
                error: 'Quiz not found'
            });
        }

        if (!quiz.completedAt) {
            return res.status(400).json({
                success: false,
                error: 'Quiz not completed yet'
            });
        }

        const detailedResults = quiz.questions.map((question, index) => {
            const userAnswer = quiz.userAnswers.find(a => a.questionIndex === index);

            return {
                questionIndex: index,
                question: question.question,
                options: question.options,
                correctAnswer: question.correctAnswer,
                selectedAnswer: userAnswer?.selectedAnswer || null,
                isCorrect: userAnswer?.isCorrect || false,
                explanation: question.explanation
            };
        });

        res.status(200).json({
            success: true,
            data: {
                quiz: {
                    id: quiz._id,
                    title: quiz.title,
                    document: quiz.documentId,
                    score: quiz.score
                },
                totalQuestions: quiz.totalQuestions,
                completedAt: quiz.completedAt,
                results: detailedResults
            }
        });

    } catch (error) {
        next(error);
    }
};


/**
 * @desc Delete quiz
 */
export const deleteQuiz = async (req, res, next) => {
    try {
        const quiz = await Quiz.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!quiz) {
            return res.status(404).json({
                success: false,
                error: 'Quiz not found'
            });
        }

        await quiz.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Quiz deleted successfully'
        });

    } catch (error) {
        next(error);
    }
};