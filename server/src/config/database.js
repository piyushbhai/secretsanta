const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/secretsanta';
  try {
    await mongoose.connect(uri);
    console.log('mongodb connected');
  } catch (err) {
    console.log('db connection failed:', err.message);
    throw err;
  }
}

module.exports = { connectDB };