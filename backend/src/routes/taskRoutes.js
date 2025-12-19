import express from 'express';
import {
    createTask,
    getTasks,
    getTask,
    updateTask,
    deleteTask,
    completeTask,
    getDashboardStats
} from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes
router.use(protect);

router.post('/', createTask);
router.get('/dashboard/stats', getDashboardStats);
router.get('/', getTasks);
router.get('/:id', getTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.put('/:id/complete', completeTask);

export default router;