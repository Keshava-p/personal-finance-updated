import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pfm_app';
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.error('⚠️  Server will continue but database operations will fail.');
    console.error('💡 To fix: Install MongoDB or update MONGODB_URI in .env file');
    console.error('   - Local: https://www.mongodb.com/try/download/community');
    console.error('   - Cloud: https://www.mongodb.com/cloud/atlas');
    // Don't exit - allow server to start for development
    // process.exit(1);
    return false;
  }
};

