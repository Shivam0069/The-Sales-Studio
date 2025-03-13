const mongoose = require("mongoose");

const MAX_RETRIES = 5;
const RETRY_INTERVAL = 5000;

async function connectToDb(retries = MAX_RETRIES) {
  try {
    await mongoose.connect(process.env.DB_CONNECT);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);

    if (retries > 0) {
      console.log(
        `Retrying MongoDB connection (${
          MAX_RETRIES - retries + 1
        }/${MAX_RETRIES}) in ${RETRY_INTERVAL / 1000} seconds...`
      );
      setTimeout(() => connectToDb(retries - 1), RETRY_INTERVAL);
    } else {
      console.error(
        "All retry attempts to connect to MongoDB have failed. Exiting the process."
      );
      process.exit(1);
    }
  }
}

module.exports = connectToDb;
