const express = require('express');
const cors = require('cors');
const jobsRoute = require('./routes/jobs');
const authRoute = require('./routes/auth');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';

app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

app.use('/api/auth', authRoute);
app.use('/api/jobs', jobsRoute);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
