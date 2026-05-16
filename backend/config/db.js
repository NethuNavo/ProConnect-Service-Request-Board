const fs = require('fs');
const mongoose = require('mongoose');

const isRunningInDocker = () => {
  try {
    if (fs.existsSync('/.dockerenv')) return true;
    if (fs.existsSync('/proc/1/cgroup')) {
      const cgroup = fs.readFileSync('/proc/1/cgroup', 'utf8');
      return /docker|kubepods|containerd/.test(cgroup);
    }
  } catch (error) {
    return false;
  }
  return false;
};

const connectDB = async () => {
  const atlasUri = process.env.MONGO_URI;
  const defaultLocalUri = 'mongodb://127.0.0.1:27017/proconnect';
  let localUri = process.env.MONGO_URI_LOCAL || defaultLocalUri;

  if (!atlasUri && !localUri) {
    throw new Error('MONGO_URI or MONGO_URI_LOCAL is required in environment variables');
  }

  if (isRunningInDocker() && /127\.0\.0\.1/.test(localUri)) {
    localUri = localUri.replace('127.0.0.1', 'host.docker.internal');
    console.log('Docker container detected. Using host.docker.internal for local MongoDB:', localUri);
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
