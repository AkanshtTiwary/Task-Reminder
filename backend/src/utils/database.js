import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        // Use MONGODB_URI instead of MONGO_URI to match .env
        const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;
        
        if (!mongoURI) {
            console.error('❌ MongoDB connection string not found!');
            console.error('   Please set MONGODB_URI in your .env file');
            process.exit(1);
        }
        
        console.log('🔌 Connecting to MongoDB...');
        console.log(`   URI: ${mongoURI.replace(/:[^:]*@/, ':****@')}`);
        
        const conn = await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`   Database: ${conn.connection.name}`);
        console.log(`   Port: ${conn.connection.port}`);
    } catch (error) {
        console.error('❌ MongoDB Connection Error:');
        console.error(`   ${error.message}`);
        
        if (error.message.includes('ECONNREFUSED')) {
            console.error('\n   🔧 SOLUTION: MongoDB is not running');
            console.error('   1. Install MongoDB: brew install mongodb-community');
            console.error('   2. Start MongoDB: brew services start mongodb-community');
            console.error('   Or use Docker: docker run -d -p 27017:27017 --name mongodb mongo');
        }
        
        process.exit(1);
    }
};

export default connectDB;