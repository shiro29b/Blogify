require("dotenv").config();
const express = require("express");
const path = require("path");
const userRoute = require("./routes/user");

const blogRoute = require("./routes/blog");
const { connectMongoDb } = require("./connection");

const cookieParser = require("cookie-parser");
const { checkAuthCookie } = require("./middlewares/auth");

const app = express();
const PORT = process.env.PORT || 8000;

const Blog = require("./models/blog");

connectMongoDb(process.env.MONGO_URL);

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(checkAuthCookie("token"));

app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {
  const blogs = await Blog.find({}).sort("createdAt");
  return res.render("home", {
    user: req.user,
    blogs: blogs,
  });
});

app.use("/user", userRoute);

app.use("/blog", blogRoute);

app.listen(PORT, (req, res) => {
  console.log("Server Started");
});
