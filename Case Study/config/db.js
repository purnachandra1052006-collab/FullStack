const mongoose = require('mongoose');

/**
 * Connects to MongoDB database using Mongoose ODM.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`[MongoDB Connected]: Host -> ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
