import express from "express";
import fs from "fs";
import { PostModel } from "../models/Posts.js";
import multer from "multer";
const uploadMiddleware = multer({ dest: "uploads/" });
import { verifyToken } from "./user.js";

const router = express.Router();

router.post(
  "/create",
  uploadMiddleware.single("images"),
  verifyToken,
  async (req, res) => {
    const { originalname, path } = req.file;
    const pathParts = path.split("\\");
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = pathParts[0] + "/" + "." + ext;
    fs.renameSync(path, newPath);

    const { title, summary, content, author } = req.body;
    const newPost = new PostModel({
      title,
      summary,
      content,
      cover: newPath,
      author,
    });

    await newPost.save();
    res.json({ message: "Post created successfully. Redirecting..." });
  }
);

router.get("/", async (req, res) => {
  const posts = await PostModel.find({})
    .sort({ createdAt: -1 })
    .populate("author", ["username"])
    .limit(50);
  res.json(posts);
});

router.get("/:id", async (req, res) => {
  const post = await PostModel.findById(req.params.id).populate("author", [
    "username",
  ]);
  res.json(post);
});

router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  const post = await PostModel.findById(id)
    .populate("author", ["username"])
    .deleteOne();
  res.json({ message: "Post deleted successfully. Redirecting..." });
});

router.put(
  "/edit",
  uploadMiddleware.single("images"),
  verifyToken,
  async (req, res) => {
    let newPath = null;
    if (req.file) {
      const { originalname, path } = req.file;
      const pathParts = path.split("\\");
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      newPath = pathParts[0] + "/" + pathParts[1] + "." + ext;
      fs.renameSync(path, newPath);
    }

    const { title, summary, content, postId, author } = req.body;
    const post = await PostModel.findById(postId).populate("author", [
      "username",
    ]);
    const isAuthorSame =
      JSON.stringify(author) === JSON.stringify(post.author._id);
    if (!isAuthorSame) {
      res.status(401).json({ message: "Unauthorized" });
    }

    await post.updateOne({
      title,
      summary,
      content,
      cover: newPath ? newPath : post.cover,
    });
    res.json({ message: "Post updated successfully. Redirecting..." });
  }
);

export { router as postRouter };
