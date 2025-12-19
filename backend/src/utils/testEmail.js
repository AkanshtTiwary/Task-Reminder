import { sendEmail } from './emailService.js';

const sendTestEmail = async () => {
    const testEmail = process.env.EMAIL_USER; // Send to yourself
    
    const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #4F46E5;">✅ Test Email from Task Reminder System</h2>
            <p>If you're reading this, email notifications are working correctly!</p>
            <p><strong>Server Time:</strong> ${new Date().toLocaleString()}</p>
            <div style="background: #10B981; color: white; padding: 10px; border-radius: 5px; margin-top: 20px;">
                Email configuration is successful! 🎉
            </div>
        </div>
    `;

    return await sendEmail(testEmail, 'Test Email - Task Reminder System', html);
};

export { sendTestEmail };