require('dotenv').config();

const mockJobs = require('./mock-data.json');
const Job = require('./models/Job');
const connectDB = require('./db/connect');

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    await Job.create(mockJobs);
    console.log('Success !!!');
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

start();
