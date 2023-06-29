import express from "express";
import { PostModel } from "../models/Posts.js";
import multer from "multer";
import multers3 from "multer-s3";
import AWS from "aws-sdk";
import { verifyToken } from "./user.js";

const router = express.Router();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

const s3 = new AWS.S3();
const myBucket = process.env.AWS_BUCKET_NAME;

const uploadMiddleware = multer({
  storage: multers3({
    s3: s3,
    bucket: myBucket,
    acl: "public-read",
    contentType: multers3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
});

router.post(
  "/create",
  uploadMiddleware.single("images"),
  verifyToken,
  async (req, res) => {
    const { title, summary, content, author } = req.body;
    const newPost = new PostModel({
      title,
      summary,
      content,
      cover: req.file.location,
      author,
    });

    await newPost.save();
    res.json({ message: "Post created successfully. Redirecting..." });
  }
);

router.get("/", async (req, res) => {
  const posts = await PostModel.find({})
    .populate("author", ["username"])
    .limit(25);
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
  const post = await PostModel.findById(id).populate("author", ["username"]);

  const params = {
    Bucket: myBucket,
    Key: post.cover.split("/").pop(),
  };
  s3.deleteObject(params, function (err, data) {
    if (err) console.log(err, err.stack);
  });
  await post.deleteOne();
  res.json({ message: "Post deleted successfully. Redirecting..." });
});

router.put(
  "/edit",
  uploadMiddleware.single("images"),
  verifyToken,
  async (req, res) => {
    let newPath = null;
    if (req.file) {
      newPath = req.file.location;
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

    const params = {
      Bucket: myBucket,
      Key: post.cover.split("/").pop(),
    };
    s3.deleteObject(params, function (err, data) {
      if (err) console.log(err, err.stack);
    });

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
