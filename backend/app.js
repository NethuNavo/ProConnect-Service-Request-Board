const express = require('express');
const cors = require('cors');
const jobsRoute = require('./routes/jobs');
const authRoute = require('./routes/auth');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
const allowedOriginEnv = process.env.CORS_ORIGIN || 'http://localhost:3000';

let corsOptions = {};
if (allowedOriginEnv === '*' || process.env.ALLOW_ALL_CORS === 'true') {
	corsOptions = {};
} else if (allowedOriginEnv.includes(',')) {
	const origins = allowedOriginEnv.split(',').map((s) => s.trim());
	corsOptions = {
		origin: function (origin, callback) {
			// allow requests with no origin like mobile apps or curl
			if (!origin) return callback(null, true);
			if (origins.indexOf(origin) !== -1) {
				callback(null, true);
			} else {
				callback(new Error('Not allowed by CORS'));
			}
		},
	};
} else {
	corsOptions = { origin: allowedOriginEnv };
}

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/auth', authRoute);
app.use('/api/jobs', jobsRoute);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
