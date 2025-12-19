import Task from '../models/Task.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { sendTaskReminder } from '../utils/emailService.js';
import mongoose from 'mongoose';

const calculateNextReminder = (currentDate, repeat) => {
    const nextDate = new Date(currentDate);
    
    switch (repeat) {
        case 'daily': nextDate.setDate(nextDate.getDate() + 1); break;
        case 'weekly': nextDate.setDate(nextDate.getDate() + 7); break;
        case 'monthly': nextDate.setMonth(nextDate.getMonth() + 1); break;
        case 'yearly': nextDate.setFullYear(nextDate.getFullYear() + 1); break;
        default: return null;
    }
    
    return nextDate;
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res) => {
    try {
        const { title, description, category, priority, dueDate, reminderTime, repeat } = req.body;

        const task = await Task.create({
            title,
            description,
            user: req.user.id,
            category,
            priority,
            dueDate: new Date(dueDate),
            reminderTime: new Date(reminderTime),
            repeat,
            isRecurring: repeat !== 'none',
            nextReminder: repeat !== 'none' ? calculateNextReminder(new Date(reminderTime), repeat) : null
        });

        // Create notification
        await Notification.create({
            user: req.user.id,
            task: task._id,
            type: 'reminder',
            title: 'Task Created',
            message: `Task "${title}" created`,
            sendVia: ['push']
        });

        // Emit socket event
        req.app.get('io')?.to(`user_${req.user.id}`).emit('new_notification', {
            title: 'Task Created',
            message: `Task "${title}" created`,
            type: 'reminder'
        });

        res.status(201).json({ success: true, task });
    } catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({ success: false, message: 'Error creating task' });
    }
};

// @desc    Get all tasks for user
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res) => {
    try {
        const { status, category, priority, sort = '-createdAt', page = 1, limit = 10 } = req.query;
        
        const query = { user: req.user.id };
        
        if (status && status !== 'all') query.status = status;
        if (category && category !== 'all') query.category = category;
        if (priority && priority !== 'all') query.priority = priority;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const [tasks, total] = await Promise.all([
            Task.find(query).sort(sort).skip(skip).limit(parseInt(limit)),
            Task.countDocuments(query)
        ]);

        res.json({
            success: true,
            tasks,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / parseInt(limit)),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching tasks' });
    }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
export const getTask = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
        if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
        res.json({ success: true, task });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching task' });
    }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
        res.json({ success: true, task });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating task' });
    }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
        res.json({ success: true, message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting task' });
    }
};

// @desc    Mark task as complete
// @route   PUT /api/tasks/:id/complete
// @access  Private
export const completeTask = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
        if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

        task.status = 'completed';
        task.completedAt = new Date();
        
        if (task.isRecurring && task.repeat !== 'none') {
            const newTask = await Task.create({
                ...task.toObject(),
                _id: undefined,
                status: 'pending',
                dueDate: calculateNextReminder(new Date(task.dueDate), task.repeat),
                reminderTime: calculateNextReminder(new Date(task.reminderTime), task.repeat),
                completedAt: null
            });
            await task.save();
            return res.json({ success: true, task, nextTask: newTask });
        }
        
        await task.save();
        res.json({ success: true, task });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error completing task' });
    }
};

// @desc    Get dashboard statistics
// @route   GET /api/tasks/dashboard/stats
// @access  Private
export const getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const stats = await Task.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
                    pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
                    inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] } },
                    overdue: {
                        $sum: {
                            $cond: [
                                { $and: [{ $ne: ['$status', 'completed'] }, { $lt: ['$dueDate', today] }] },
                                1, 0
                            ]
                        }
                    },
                    today: {
                        $sum: {
                            $cond: [
                                { $and: [{ $gte: ['$dueDate', today] }, { $lt: ['$dueDate', tomorrow] }] },
                                1, 0
                            ]
                        }
                    }
                }
            }
        ]);

        res.json({
            success: true,
            stats: stats[0] || { total: 0, completed: 0, pending: 0, inProgress: 0, overdue: 0, today: 0 }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching stats' });
    }
};