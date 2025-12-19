import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
    try {
        console.log('Testing MongoDB connection...');
        console.log('URI:', process.env.MONGODB_URI?.replace(/:[^:]*@/, ':****@'));
        
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connected successfully!');
        
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));
        
        await mongoose.disconnect();
        console.log('✅ Disconnected');
        process.exit(0);
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        process.exit(1);
    }
}

testConnection();
