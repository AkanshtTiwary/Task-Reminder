import cron from "node-cron";
import Task from "../models/Task.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import { sendTaskReminder, sendOverdueNotification } from './emailService.js';

class ReminderScheduler {
    constructor() {
        this.initScheduler();
    }

    initScheduler() {
        // Run every minute to check for reminders
        cron.schedule('* * * * *', async () => {
            await this.checkReminders();
        });

        // Run every hour to check for overdue tasks
        cron.schedule('0 * * * *', async () => {
            await this.checkOverdueTasks();
        });

        console.log('Reminder scheduler initialized');
    }

    async checkReminders() {
        try {
            const now = new Date();
            const nextMinute = new Date(now.getTime() + 60000); // Next minute
            
            // Find tasks with reminders due now
            const tasks = await Task.find({
                reminderTime: {
                    $gte: now,
                    $lt: nextMinute
                },
                status: { $nin: ['completed', 'overdue'] }
            }).populate('user');

            for (const task of tasks) {
                await this.sendReminder(task);
                
                // Update next reminder for recurring tasks
                if (task.isRecurring && task.repeat !== 'none') {
                    await this.updateNextReminder(task);
                }
            }
        } catch (error) {
            console.error('Error checking reminders:', error);
        }
    }

    async sendReminder(task) {
        try {
            const user = task.user;
            
            // Create notification
            await Notification.create({
                user: user._id,
                task: task._id,
                type: 'reminder',
                title: `Reminder: ${task.title}`,
                message: `Your task "${task.title}" is due soon!`,
                sendVia: user.notificationPreferences.email ? ['email', 'push'] : ['push']
            });

            // Send email if enabled
            if (user.notificationPreferences && user.notificationPreferences.email) {
                await sendTaskReminder(user, task);
            }

            console.log(`✅ Reminder sent for task: ${task.title}`);
        } catch (error) {
            console.error('❌ Error sending reminder:', error);
        }
    }

    async updateNextReminder(task) {
        try {
            let nextReminder;
            const currentReminder = new Date(task.reminderTime);

            switch (task.repeat) {
                case 'daily':
                    nextReminder = new Date(currentReminder.setDate(currentReminder.getDate() + 1));
                    break;
                case 'weekly':
                    nextReminder = new Date(currentReminder.setDate(currentReminder.getDate() + 7));
                    break;
                case 'monthly':
                    nextReminder = new Date(currentReminder.setMonth(currentReminder.getMonth() + 1));
                    break;
                case 'yearly':
                    nextReminder = new Date(currentReminder.setFullYear(currentReminder.getFullYear() + 1));
                    break;
            }

            await Task.findByIdAndUpdate(task._id, {
                reminderTime: nextReminder,
                nextReminder
            });

            console.log(`Updated next reminder for task: ${task.title}`);
        } catch (error) {
            console.error('Error updating next reminder:', error);
        }
    }

    async checkOverdueTasks() {
        try {
            const now = new Date();
            
            // Find overdue tasks
            const tasks = await Task.find({
                dueDate: { $lt: now },
                status: { $nin: ['completed', 'overdue'] }
            }).populate('user');

            for (const task of tasks) {
                task.status = 'overdue';
                await task.save();

                // Create overdue notification
                await Notification.create({
                    user: task.user._id,
                    task: task._id,
                    type: 'overdue',
                    title: `Overdue: ${task.title}`,
                    message: `Your task "${task.title}" is overdue!`,
                    sendVia: task.user.notificationPreferences.email ? ['email', 'push'] : ['push']
                });

                // Send overdue email if enabled
                if (task.user.notificationPreferences && task.user.notificationPreferences.email) {
                    await sendOverdueNotification(task.user, task);
                }

                console.log(`⚠️ Marked task as overdue: ${task.title}`);
            }
        } catch (error) {
            console.error('Error checking overdue tasks:', error);
        }
    }
}

export default ReminderScheduler;