const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config({ path: './config.env' });

const port = process.env.PORT || 3000;
const app = require('./app');

const { DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_HOST, DATABASE_NAME } =
  process.env;

// Construct the connection string using mongodb+srv protocol
const connectionString = `mongodb+srv://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@${DATABASE_HOST}/${DATABASE_NAME}?retryWrites=true&w=majority`;

// Connect to MongoDB Atlas
mongoose
  .connect(connectionString)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB Atlas', err);
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
