const blogsRouter = require("express").Router();
const Blog = require("../models/blogSchema");

// Blogs
blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({});
  res.json(blogs);
});

// Add new blog
blogsRouter.post("/", async (req, res, next) => {
  const blog = new Blog(req.body);

  const savedBlog = await blog.save();
  res.status(201).json(savedBlog);
});

module.exports = blogsRouter;
