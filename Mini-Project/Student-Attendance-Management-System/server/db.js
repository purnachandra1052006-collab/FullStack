import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const connUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/attendance_system_db';
    const conn = await mongoose.connect(connUri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log(`ℹ️ Please ensure MongoDB is running locally or set MONGO_URI in .env`);
  }
};

export default connectDB;
