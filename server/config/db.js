const mongoose = require('mongoose');

let mongoMemoryServer = null;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/privai';
    
    mongoose.set('strictQuery', false);
    
    try {
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 2000
      });
      console.log(`[Database] Connected to MongoDB: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.warn(`[Database] Standard MongoDB unavailable (${err.message}). Launching MongoDB Memory Server fallback...`);
      
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create();
      const memUri = mongoMemoryServer.getUri();
      
      const conn = await mongoose.connect(memUri);
      console.log(`[Database] Connected to In-Memory MongoDB instance at: ${memUri}`);
      return conn;
    }
  } catch (error) {
    console.error(`[Database Error] ${error.message}`);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};

module.exports = { connectDB, disconnectDB };
