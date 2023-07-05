import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import axios from "axios";
import { UserModel } from "../models/Users.js";

dotenv.config();

const router = express.Router();

router.post("/register", async (req, res) => {
  // console.log(req);
  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({
      message: "Username or Password missing.",
      type: "error",
    });
  }

  const user = await UserModel.findOne({ username: username });

  if (user) {
    return res.json({
      message: "User already exists. Try again.",
      type: "error",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new UserModel({
    username: username,
    password: hashedPassword,
  });
  await newUser.save();

  res.json({ message: "Registration successful. Now Login.", type: "success" });
});

router.post("/login", async (req, res) => {
  const { username, password, captchaToken } = req.body;

  const captchaData = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET}&response=${captchaToken}`)
  const captchaSuccess = captchaData.data.success

  if (!captchaSuccess) {
    return res.json({
      message: "Captcha verification failed.",
      type: "error",
    });
  }

  if (!username || !password) {
    return res.json({
      message: "Username or Password missing.",
      type: "error",
    });
  }

  const user = await UserModel.findOne({ username: username });

  if (!user) {
    return res.json({ message: "User not found. Try again.", type: "error" });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return res.json({ message: "Invalid credentials. Try again.", type: "error" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({
    token: token,
    userID: user._id,
    message: "Login successful. Redirecting...",
    username: user.username,
    type: "success",
  });
});

export { router as userRouter };