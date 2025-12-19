import express from 'express';
import { sendTestEmail } from '../utils/testEmail.js';

const router = express.Router();

// Test email endpoint
router.get('/test-email', async (req, res) => {
    try {
        const result = await sendTestEmail();
        res.json({
            success: true,
            message: 'Test email sent',
            result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to send test email',
            error: error.message
        });
    }
});

export default router;