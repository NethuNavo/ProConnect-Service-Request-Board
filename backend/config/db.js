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

  const connectOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  const connectLocal = async (uri) => {
    try {
      await mongoose.connect(uri, connectOptions);
      console.log(`MongoDB connected to local database at ${uri}`);
      return true;
    } catch (error) {
      console.error(`MongoDB local connection error for ${uri}:`, error.message);
      return false;
    }
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
        if (await connectLocal(localUri)) return;

        if (/127\.0\.0\.1/.test(localUri)) {
          const dockerHostUri = localUri.replace('127.0.0.1', 'host.docker.internal');
          console.log('Retrying with host.docker.internal for local MongoDB:', dockerHostUri);
          if (await connectLocal(dockerHostUri)) return;
        }
      }

      console.error(
        'If you are using MongoDB Atlas, ensure your current IP address is whitelisted in Atlas Network Access and the cluster is available.'
      );
      return;
    }
  }

  if (await connectLocal(localUri)) return;

  if (/127\.0\.0\.1/.test(localUri)) {
    const dockerHostUri = localUri.replace('127.0.0.1', 'host.docker.internal');
    console.log('Retrying with host.docker.internal for local MongoDB:', dockerHostUri);
    if (await connectLocal(dockerHostUri)) return;
  }

  console.error('MongoDB connection error: failed to connect using configured URIs.');
};

module.exports = connectDB;
