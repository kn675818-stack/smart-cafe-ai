const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
    });

    console.log("MongoDB Connected ✅");
    console.log("Database:", mongoose.connection.name);
  } catch (error) {
    console.error("MongoDB Error:");
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;