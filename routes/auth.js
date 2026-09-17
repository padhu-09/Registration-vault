const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const router = express.Router();
router.post("/register", async (req, res, next) => {
 console.log("REGISTER API HIT");
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        error: "name, email and password are required"
      });
    }
    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(409).json({
        error: "Email already registered"
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });
    console.log("Saved successfully");
    console.log("Database:", User.db.name);
    console.log("Collection:", User.collection.name);
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    });
  } catch (error) {
    next(error);
  }
});
module.exports = router;