import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config()

// MongoDB connection
export async function initializeDatabase() {
  try {
    const dbUri = process.env.MONGO_URI;
    if (!dbUri) {
      throw new Error('MONGO_URI environment variable is not defined');
    }
    
    await mongoose.connect(dbUri);
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
}
