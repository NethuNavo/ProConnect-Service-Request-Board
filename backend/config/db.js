const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoURI =
    process.env.MONGO_URI || process.env.MONGODB_URI || process.env.DATABASE_URL;

  if (!mongoURI) {
    console.error('❌ Mongo URI not found in environment variables');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
