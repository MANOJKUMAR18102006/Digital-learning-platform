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

export const checkAchievements = async (userId, stats) => {
    try {
        const user = await User.findById(userId);
        if (!user) return [];

        const newAchievements = [];
        const existingNames = user.achievements.map(a => a.name);

        const badgeConfigs = [
            { name: 'Bronze Scholar', criteria: stats.quizCount >= 5, description: 'Completed 5 quizzes', icon: '🥉' },
            { name: 'Silver Scholar', criteria: stats.quizCount >= 10, description: 'Completed 10 quizzes', icon: '🥈' },
            { name: 'Gold Scholar', criteria: stats.quizCount >= 25, description: 'Completed 25 quizzes', icon: '🥇' },
            { name: 'Flashcard Pro', criteria: stats.flashcardCount >= 10, description: 'Reviewed 10 flashcard sets', icon: '🧠' },
            { name: 'Consistency King', criteria: user.streak >= 7, description: 'Maintain a 7-day study streak', icon: '🔥' },
        ];

        for (const badge of badgeConfigs) {
            if (badge.criteria && !existingNames.includes(badge.name)) {
                user.achievements.push({
                    name: badge.name,
                    description: badge.description,
                    icon: badge.icon
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
