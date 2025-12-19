import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide task title'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        enum: ['work', 'personal', 'health', 'education', 'other'],
        default: 'personal'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed', 'overdue'],
        default: 'pending'
    },
    dueDate: {
        type: Date,
        required: [true, 'Please provide due date']
    },
    reminderTime: {
        type: Date,
        required: [true, 'Please provide reminder time']
    },
    repeat: {
        type: String,
        enum: ['none', 'daily', 'weekly', 'monthly', 'yearly'],
        default: 'none'
    },
    isRecurring: {
        type: Boolean,
        default: false
    },
    nextReminder: {
        type: Date
    },
    completedAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries
taskSchema.index({ user: 1, dueDate: 1 });
taskSchema.index({ reminderTime: 1 });
taskSchema.index({ status: 1 });

export default mongoose.model('Task', taskSchema);