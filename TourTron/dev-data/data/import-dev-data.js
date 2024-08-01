const fs = require('fs');
const mongoose = require('mongoose');
const Tour = require('./../../models/tourModel');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config({ path: './config.env' });

const { DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_HOST, DATABASE_NAME } =
  process.env;

const connectionString = `mongodb+srv://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@${DATABASE_HOST}/${DATABASE_NAME}?retryWrites=true&w=majority`;

mongoose.connect(connectionString);

//read the json file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));

//Import data into DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data imported successfully');
  } catch (e) {
    console.log('Error importing data', e);
  }
  process.exit();
};

//Delete all data from DB

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data deleted successfully');
  } catch (e) {
    console.log('Error deleting data');
    process.exit();
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

// console.log(process.argv);
