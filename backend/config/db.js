const mongoose = require('mongoose');

const connectDB = async () => {
  const atlasUri = process.env.MONGO_URI;
  const localUri = process.env.MONGO_URI_LOCAL || 'mongodb://127.0.0.1:27017/proconnect';

  if (!atlasUri && !localUri) {
    throw new Error('MONGO_URI or MONGO_URI_LOCAL is required in environment variables');
  }

  const connectOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  if (atlasUri) {
    try {
      await mongoose.connect(atlasUri, connectOptions);
      console.log('MongoDB connected to Atlas');
      return;
    } catch (error) {
      console.error('MongoDB Atlas connection error:', error.message);
      if (process.env.NODE_ENV !== 'production' && localUri) {
        console.log('Atlas connection failed. Trying local MongoDB fallback at', localUri);
        try {
          await mongoose.connect(localUri, connectOptions);
          console.log('MongoDB connected to local fallback');
          return;
        } catch (fallbackError) {
          console.error('Local MongoDB fallback failed:', fallbackError.message);
        }
      }

      console.error(
        'If you are using MongoDB Atlas, ensure your current IP address is whitelisted in Atlas Network Access and the cluster is available.'
      );
      return;
    }
  }

  try {
    await mongoose.connect(localUri, connectOptions);
    console.log('MongoDB connected to local database');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
  }
};

module.exports = connectDB;
