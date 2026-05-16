const path = require('path');
const dotenv = require('dotenv');
const app = require('./app');
const connectDB = require('./config/db');

const envPath = path.resolve(__dirname, '.env');
dotenv.config({ path: envPath });
connectDB();

// Root health route - quick success message
app.get("/", (req, res) => {
  res.send("ProConnect Backend Running Successfully");
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Graceful error handling for unexpected crashes
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
