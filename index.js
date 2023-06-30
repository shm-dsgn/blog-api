import express from "express";
import cors from "cors";
import mongoose from "mongoose";
//enables the use of environment variables
import dotenv from "dotenv";

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

//connect to mongodb
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

mongoose.connect(
  `mongodb+srv://${dbUser}:${dbPassword}@blog.res7iy6.mongodb.net/blog?retryWrites=true&w=majority`
);

const PORT = process.env.PORT || 3001

app.listen(PORT, () => console.log(`Server running on port ${PORT} `));
