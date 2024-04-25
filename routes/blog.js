const express = require("express");
const Blog = require("../models/blog");

const Comment = require("../models/comments");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});
const upload = multer({ storage: storage });

router.get("/add-blog", (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});

router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({ blogId: req.params.id }).populate(
    "createdBy"
  );
  res.render("blogs", {
    user: req.user,
    blog: blog,
    comments: comments,
  });
});

router.post("/comments/:id", async (req, res) => {
  await Comment.create({
    content: req.body.content,
    blogId: req.params.id,
    createdBy: req.user.id,
  });
  return res.redirect(`/blog/${req.params.id}`);
});

router.post("/", upload.single("coverImage"), async (req, res) => {
  const { title, content } = req.body;
  const blog = await Blog.create({
    title: title,
    body: content,
    createdBy: req.user.id,
    coverImageURL: `/uploads/${req.file.filename}`,
  });

  res.redirect("/");
});

module.exports = router;
