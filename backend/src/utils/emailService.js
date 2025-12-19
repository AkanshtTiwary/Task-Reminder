import nodemailer from "nodemailer";

let transporter = null;

// Initialize transporter
if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: process.env.EMAIL_PORT === '465',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        pool: true
    });

    transporter.verify((error) => {
        if (error) {
            console.error('❌ Email service error:', error.message);
        } else {
            console.log('✅ Email service ready');
        }
    });
} else {
    console.warn('⚠️  Email service not configured');
}

const sendEmail = async (to, subject, html, text = '') => {
    if (!transporter) {
        return { success: false, error: 'Email service not configured' };
    }

    try {
        const info = await transporter.sendMail({
            from: `"Task Reminder" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
            text: text || html.replace(/<[^>]*>/g, '')
        });

        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Email error:', error.message);
        return { success: false, error: error.message };
    }
};

const sendTaskReminder = async (user, task) => {
    const subject = `⏰ Reminder: ${task.title}`;
    const dueDate = new Date(task.dueDate).toLocaleString();
    
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #4F46E5; color: white; padding: 20px; text-align: center;">
                <h1>Task Reminder</h1>
            </div>
            <div style="padding: 20px;">
                <h2>${task.title}</h2>
                <p>${task.description || ''}</p>
                <p><strong>Due:</strong> ${dueDate}</p>
                <p><strong>Priority:</strong> ${task.priority}</p>
                <a href="${process.env.FRONTEND_URL}/tasks/edit/${task._id}" 
                   style="display: inline-block; background: #4F46E5; color: white; 
                          padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">
                    View Task
                </a>
            </div>
        </div>
    `;

    return await sendEmail(user.email, subject, html);
};

const sendWelcomeEmail = async (user) => {
    const subject = 'Welcome to Task Reminder!';
    
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #4F46E5; color: white; padding: 20px; text-align: center;">
                <h1>Welcome!</h1>
            </div>
            <div style="padding: 20px;">
                <h2>Hello ${user.name},</h2>
                <p>Thank you for joining Task Reminder System.</p>
                <a href="${process.env.FRONTEND_URL}/dashboard" 
                   style="display: inline-block; background: #4F46E5; color: white; 
                          padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                    Get Started
                </a>
            </div>
        </div>
    `;

    return await sendEmail(user.email, subject, html);
};

const sendOverdueNotification = async (user, task) => {
    const subject = `⚠️ OVERDUE: ${task.title}`;
    
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #DC2626; color: white; padding: 20px; text-align: center;">
                <h1>Task Overdue</h1>
            </div>
            <div style="padding: 20px;">
                <p>Your task <strong>"${task.title}"</strong> is overdue.</p>
                <a href="${process.env.FRONTEND_URL}/tasks/edit/${task._id}" 
                   style="display: inline-block; background: #DC2626; color: white; 
                          padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                    Update Task
                </a>
            </div>
        </div>
    `;

    return await sendEmail(user.email, subject, html);
};

export { sendEmail, sendTaskReminder, sendWelcomeEmail, sendOverdueNotification };