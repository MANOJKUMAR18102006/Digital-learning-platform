import ActivityLog from '../models/ActivityLog.js';

export const logActivity = async ({ userId, type, description, link = null, metadata = {} }) => {
    try {
        await ActivityLog.create({
            userId,
            type,
            description,
            link,
            metadata
        });
    } catch (error) {
        console.error('❌ Activity Logging Error:', error);
    }
};
