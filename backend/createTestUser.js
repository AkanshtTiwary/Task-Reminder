import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    phone: String,
    notificationPreferences: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        sms: { type: Boolean, default: false }
    },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function createTestUser() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('📦 Connected to MongoDB');

        // Delete existing test user
        await User.deleteOne({ email: 'test@example.com' });
        console.log('🗑️  Deleted existing test user');

        // Create new test user with hashed password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const testUser = await User.create({
            name: 'Test User',
            email: 'test@example.com',
            password: hashedPassword,
            phone: '+1234567890',
            notificationPreferences: {
                email: true,
                push: true,
                sms: false
            }
        });

        console.log('✅ Test user created successfully!');
        console.log('📧 Email: test@example.com');
        console.log('🔑 Password: password123');
        console.log('\n📝 Use these credentials to login');

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

createTestUser();
