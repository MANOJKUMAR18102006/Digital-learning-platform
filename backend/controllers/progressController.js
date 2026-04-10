import mongoose from 'mongoose';
import Document from '../models/Document.js';
import Flashcard from '../models/Flashcard.js';
import Quiz from '../models/Quiz.js';
import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';

/**
 * @desc    Get user learning statistics
 * @route   GET api/progress/dashboard
 * @access  Private
 */
export const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get counts
    const totalDocuments = await Document.countDocuments({ userId });
    const totalFlashcardSets = await Flashcard.countDocuments({ userId });
    const totalQuizzes = await Quiz.countDocuments({ userId, completedAt: { $ne: null } });

    // Get flashcard statistics
    const flashcardSets = await Flashcard.find({ userId });
    let totalFlashcards = 0;
    let reviewedFlashcards = 0;
    let starredFlashcards = 0;

    flashcardSets.forEach(set => {
      totalFlashcards += set.cards.length;
      reviewedFlashcards += set.cards.filter(c => c.reviewCount > 0).length;
      starredFlashcards += set.cards.filter(c => c.isStarred).length;
    });
    // Get quiz statistics
    const quizzes = await Quiz.find({ userId, completedAt: { $ne: null } });
    const averageScore = quizzes.length > 0 ? Math.round(quizzes.reduce((sum, q) => sum + q.score, 0) / quizzes.length) : 0;

    // Recent activity
    const recentDocuments = await Document.find({ userId })
        .sort({ lastAccessed: -1 })
        .limit(5)
        .select('title fileName lastAccessed status');

    const recentQuizzes = await Quiz.find({ userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('documentId', 'title')
        .select('title score totalQuestions completedAt');

    // Get real user data
    const recentActivities = await ActivityLog.find({ userId }).sort({ createdAt: -1 }).limit(10);
    const user = await User.findById(userId).select('xp level streak achievements');

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalDocuments,
          totalFlashcardSets,
          totalFlashcards,
          reviewedFlashcards,
          starredFlashcards,
          totalQuizzes,
          averageScore,
          studyStreak: user?.streak || 0,
          xp: user?.xp || 0,
          level: user?.level || 1,
          achievementsCount: user?.achievements?.length || 0
        },
        recentActivity: {
          documents: recentDocuments,
          quizzes: recentQuizzes,
          logs: recentActivities
        }
      }
    });
  } catch (error) {
    next(error);
  }
}
/**
 * @desc    Get Global Leaderboard
 * @route   GET api/progress/leaderboard
 */
export const getLeaderboard = async (req, res, next) => {
    try {
        const topUsers = await User.find()
            .select('username xp level profileImage achievements')
            .sort({ xp: -1 })
            .limit(10);

        res.status(200).json({
            success: true,
            data: topUsers
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get User Achievements
 * @route   GET api/progress/achievements
 */
export const getUserAchievements = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('achievements');
        res.status(200).json({
            success: true,
            data: user.achievements
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get Activity Heatmap Data
 * @route   GET api/progress/heatmap
 */
export const getHeatmapData = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const heatmapData = await ActivityLog.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $project: {
                    date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
                }
            },
            {
                $group: {
                    _id: "$date",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    date: "$_id",
                    count: 1
                }
            },
            { $sort: { date: 1 } }
        ]);

        res.status(200).json({
            success: true,
            data: heatmapData
        });
    } catch (error) {
        next(error);
    }
};
