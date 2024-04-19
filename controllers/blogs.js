const blogsRouter = require("express").Router();
const Blog = require("../models/blogSchema");

// Blogs
blogsRouter.get("/", (req, res) => {
  Blog.find({}).then((blogs) => res.json(blogs));
});

// Add new blog
blogsRouter.post("/", (req, res, next) => {
  const blog = new Blog(req.body);

  blog
    .save()
    .then((savedBlog) => res.status(201).json(savedBlog))
    .catch((error) => next(error));
});

module.exports = blogsRouter;
