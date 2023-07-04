import express from "express";
import { PostModel } from "../models/Posts.js";
import { UserModel } from "../models/Users.js";
import multer from "multer";
import multers3 from "multer-s3";
import AWS from "aws-sdk";
import { verifyToken } from "../middlewares/verifyToken.js";
import { checkToxic } from "../middlewares/checkToxic.js";

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
  checkToxic,
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

    const user = await UserModel.findById(author);
    user.myPosts.push(newPost._id); // Add the new post to the user's posts array
    await user.save();

    res.json({ message: "Post created successfully. Redirecting...", type: "success",});
  }
);

router.get("/myprofile/:id", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    const myPosts = await PostModel.find({
      _id: { $in: user.myPosts },
    });
    res.json({
      myPosts,
      username: user.username,
    });
  } catch (err) {
    res.json(err);
  }
});

router.get("/", async (req, res) => {
  const posts = await PostModel.find({}).sort({ createdAt: -1 }).limit(25);
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
  const post = await PostModel.findById(id);

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
  checkToxic,
  async (req, res) => {
    const { title, summary, content, postId, author } = req.body;
    const post = await PostModel.findById(postId);

    const isAuthorSame =
      JSON.stringify(author) === JSON.stringify(post.author._id);
    if (!isAuthorSame) {
      return res.json({ message: "Unauthorized" });
    }

    let newPath = post.cover;

    if (req.file) {
      newPath = req.file.location;

      const params = {
        Bucket: myBucket,
        Key: post.cover.split("/").pop(),
      };
      s3.deleteObject(params, function (err, data) {
        if (err) console.log(err, err.stack);
      });
    }

    await post.updateOne({
      title,
      summary,
      content,
      cover: newPath,
    });
    res.json({ message: "Post updated successfully. Redirecting...", type: "success", });
  }
);

export { router as postRouter };
