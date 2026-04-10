import Notification from '../models/Notification.js';
import ActivityLog from '../models/ActivityLog.js';
import User from '../models/User.js';
import moment from 'moment';

export const getNotifications = async (req, res, next) => {
    try {
        const userId = req.user.id;
        
        // 1. Check for missed days / streak warnings before sending notifications
        const lastActivity = await ActivityLog.findOne({ userId }).sort({ createdAt: -1 });
        const yesterday = moment().subtract(1, 'day').startOf('day');
        
        if (!lastActivity || moment(lastActivity.createdAt).isBefore(yesterday)) {
            // Check if streak warning already exists for today
            const warningExists = await Notification.findOne({
                userId,
                type: 'streak_warning',
                createdAt: { $gte: moment().startOf('day').toDate() }
            });
            
            if (!warningExists) {
                await Notification.create({
                    userId,
                    type: 'streak_warning',
                    title: 'Streak at Risk! 🔥',
                    message: "You haven't studied today. Complete a task to keep your streak alive!"
                });
            }
        }

        const notifications = await Notification.find({ userId })
            .sort({ createdAt: -1 })
            .limit(20);

        res.status(200).json({
            success: true,
            data: notifications
        });
    } catch (error) {
        next(error);
    }
};

export const markAsRead = async (req, res, next) => {
    try {
        await Notification.updateMany(
            { userId: req.user.id, isRead: false },
            { $set: { isRead: true } }
        );
        res.status(200).json({ success: true });
    } catch (error) {
        next(error);
    }
};
