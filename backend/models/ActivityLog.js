import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            required: true,
            enum: [
                'document_upload',
                'quiz_complete',
                'flashcards_gen',
                'notes_gen',
                'mindmap_gen',
                'studyplan_gen',
                'chat_query'
            ],
        },
        description: {
            type: String,
            required: true,
        },
        link: {
            type: String,
            default: null,
        },
        metadata: {
            type: Object,
            default: {},
        },
    },
    {
        timestamps: true,
    }
);

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

export default ActivityLog;
