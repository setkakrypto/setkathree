import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register user
export const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    const userExists = await User.findById({ username });

    if (userExists) {
      return res.json({ message: "User already exists" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hash,
    });

    const token = jwt.sign(
      {
        id: newUser._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    await newUser.save();

    res.json({
      newUser,
      token,
      message: "User created successfully",
    });
  } catch (error) {
    res.json({ message: `Error registering user: ${error}` });
  }
};
// Login user
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ message: "Incorrect username or password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    res.json({
      token,
      user,
      message: "Logged in successfully",
    });
  } catch (error) {
    res.json({ message: `Error logging in: ${error}` });
  }
};
// Get me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.json({ message: "User not found" });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    res.json({
      user,
      token,
    });
  } catch (error) {
    res.json({
      message: `Error getting user: ${error.name}: ${error.message}`,
    });
  }
};
