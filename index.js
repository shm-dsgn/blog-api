import express from "express";
import cors from "cors";
import mongoose from "mongoose";
//enables the use of environment variables
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

import { userRouter } from "./routes/user.js";
import { postRouter } from "./routes/post.js";
const app = express();

//coverts all incoming request to json
app.use(express.json());
//CORS supports secure cross-origin requests and data transfers between browsers and servers
app.use(cors());

app.use("/auth", userRouter);
app.use("/post", postRouter);

//get images from the upload folder so that it can be displayed in the webpage using express.static
// specify the path to the uploads directory
app.use("/uploads", express.static(__dirname + "/uploads"));

//connect to mongodb
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

mongoose.connect(
  `mongodb+srv://${dbUser}:${dbPassword}@blog.res7iy6.mongodb.net/blog?retryWrites=true&w=majority`
);

app.listen(3001, () => console.log("Server running on port 3001"));
