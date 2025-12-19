import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    },
    type: {
        type: String,
        enum: ['reminder', 'overdue', 'completed', 'system'],
        default: 'reminder'
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    sendVia: [{
        type: String,
        enum: ['email', 'push', 'sms']
    }],
    sentAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Notification', notificationSchema);