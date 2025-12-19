import express from 'express';
import {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getUnreadCount
} from '../controllers/notificationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes
router.use(protect);

router.route('/')
    .get(getNotifications);

router.route('/unread-count')
    .get(getUnreadCount);

router.route('/:notificationId/read')
    .put(markAsRead);

router.put('/mark-all-read', markAllAsRead);
router.delete('/:notificationId', deleteNotification);

// Add notification routes here

export default router;