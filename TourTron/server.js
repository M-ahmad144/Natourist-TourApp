const mongoose = require('mongoose');
const dotenv = require('dotenv');
//uncaught Exception
process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception:');
  console.error(err.name, err.message);

  process.exit(1);
});
// Load environment variables from .env file
dotenv.config({ path: './config.env' });

const port = process.env.PORT || 3000;
const app = require('./app');

const { DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_HOST, DATABASE_NAME } =
  process.env;

// Construct the connection string using mongodb+srv protocol
const connectionString = `mongodb+srv://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@${DATABASE_HOST}/${DATABASE_NAME}?retryWrites=true&w=majority`;

// Connect to MongoDB Atlas
mongoose.connect(connectionString).then(() => {
  console.log('Connected to MongoDB Atlas');
});

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//unhandeled promise(async) rejection
process.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejection:');
  console.error(err.name, err.message);
  server.close(() => {
    console.error('Server is closing');
    process.exit(1);
  });
});
