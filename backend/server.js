const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const jobsRoute = require('./routes/jobs');
const { notFound, errorHandler } = require('./middleware/errorHandler');

dotenv.config();
connectDB();

const app = express();
const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';

app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

app.use('/api/jobs', jobsRoute);
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
