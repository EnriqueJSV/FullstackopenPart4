const blogsRouter = require("express").Router();
const Blog = require("../models/blogSchema");

// Blogs
blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({});
  res.json(blogs);
});

// Add new blog
blogsRouter.post("/", async (req, res) => {
  // const blog = new Blog(req.body);

  // const savedBlog = await blog.save();

  const body = req.body;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  });

  const savedBlog = await blog.save();
  res.status(201).json(savedBlog);
});

// delete
blogsRouter.delete("/:id", async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

module.exports = blogsRouter;
