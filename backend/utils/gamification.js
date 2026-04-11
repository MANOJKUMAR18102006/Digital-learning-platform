import User from '../models/User.js';

export const XP_RULES = {
    QUIZ_COMPLETED: 100,
    FLASHCARD_REVIEW: 50,
    STUDY_NOTE_GEN: 30,
    MINDMAP_GEN: 40,
    DAILY_LOGIN: 20,
    CHAT_QUESTION: 10
};

export const LEVEL_THRESHOLD = 1000; // XP per level

export const awardXP = async (userId, amount) => {
    try {
        const user = await User.findById(userId);
        if (!user) return null;

        user.xp += amount;
        
        // Calculate Level
        const newLevel = Math.floor(user.xp / LEVEL_THRESHOLD) + 1;
        if (newLevel > user.level) {
            user.level = newLevel;
            // Optionally award a "Level Up" achievement
        }

        await user.save();
        return user;
    } catch (error) {
        console.error('awardXP error:', error);
        return null;
    }
};

export const updateStreak = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) return null;

        const now = new Date();
        const lastLogin = user.lastLoginDate;
        
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const last = lastLogin ? new Date(lastLogin.getFullYear(), lastLogin.getMonth(), lastLogin.getDate()) : null;

        if (!last) {
            user.streak = 1;
        } else {
            const diffTime = today.getTime() - last.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                user.streak += 1;
            } else if (diffDays > 1) {
                user.streak = 1;
            }
            // If diffDays is 0, they already logged in today, keep streak as is
        }

        user.lastLoginDate = now;
        await user.save();

        // Check for streak-related achievements
        if (user.streak >= 7) {
            await checkAchievements(userId);
        }

        return user.streak;
    } catch (error) {
        console.error('updateStreak error:', error);
        return 0;
    }
};

export const checkAchievements = async (userId, stats = null) => {
    try {
        const user = await User.findById(userId);
        if (!user) return [];

        // If stats weren't provided, fetch them all for a full sync
        if (!stats) {
            const Quiz = (await import('../models/Quiz.js')).default;
            const Flashcard = (await import('../models/Flashcard.js')).default;
            
            stats = {
                quizCount: await Quiz.countDocuments({ userId, completedAt: { $ne: null } }),
                flashcardCount: await Flashcard.countDocuments({ userId }) // Or more complex logic
            };
        }

        const newAchievements = [];
        const existingNames = user.achievements.map(a => a.name);

        const badgeConfigs = [
            { name: 'Bronze Scholar', criteria: (stats.quizCount || 0) >= 5, description: 'Completed 5 quizzes', icon: '🥉' },
            { name: 'Silver Scholar', criteria: (stats.quizCount || 0) >= 10, description: 'Completed 10 quizzes', icon: '🥈' },
            { name: 'Gold Scholar', criteria: (stats.quizCount || 0) >= 25, description: 'Completed 25 quizzes', icon: '🥇' },
            { name: 'Flashcard Pro', criteria: (stats.flashcardCount || 0) >= 10, description: 'Created 10 flashcard sets', icon: '🧠' },
            { name: 'Consistency King', criteria: (user.streak || 0) >= 7, description: 'Maintain a 7-day study streak', icon: '🔥' },
        ];

        for (const badge of badgeConfigs) {
            if (badge.criteria && !existingNames.includes(badge.name)) {
                user.achievements.push({
                    name: badge.name,
                    description: badge.description,
                    icon: badge.icon,
                    unlockedAt: new Date()
                });
                newAchievements.push(badge);
            }
        }

        if (newAchievements.length > 0) {
            await user.save();
        }

        return newAchievements;
    } catch (error) {
        console.error('checkAchievements error:', error);
        return [];
    }
};
