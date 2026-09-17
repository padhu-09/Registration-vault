const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "registration_vault"
    });

    console.log("MongoDB connected successfully");
    console.log("Database:", mongoose.connection.name);

    const count = await mongoose.connection.db
      .collection("users")
      .countDocuments();

    console.log("Users in registration_vault:", count);

  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;