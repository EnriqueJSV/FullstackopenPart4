const blogsRouter = require("express").Router();
const Blog = require("../models/blogSchema");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

// Blogs
blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  res.json(blogs);
});

// Add new blog
blogsRouter.post("/", async (req, res) => {
  const body = req.body;

  const decodedToken = jwt.verify(req.token, process.env.SECRET);

  if (!decodedToken.id) {
    return res.status(401).json({ error: "token invalid" });
  }

  // using middleware userExtractor
  const user = req.user;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user.id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  res.status(201).json(savedBlog);
});

// delete
blogsRouter.delete("/:id", async (req, res) => {

  const blog = await Blog.findById(req.params.id);
  const userBlog = blog.user;

  const user = req.user;

  if (!user.id) {
    return res.status(401).json({ error: "token invalid" });
  } else if (userBlog.toString() === user.id) {
    await Blog.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } else {
    return res.status(401).json({ error: "invalid user" });
  }
});

// update
blogsRouter.put("/:id", async (req, res) => {
  const { likes } = req.body;

  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    { likes },
    { new: true, runValidators: true, context: "query" }
  );

  res.json(updatedBlog);
});

module.exports = blogsRouter;
