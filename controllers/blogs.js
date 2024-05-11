const blogsRouter = require("express").Router();
const Blog = require("../models/blogSchema");
const User = require("../models/user");

// Blogs
blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  res.json(blogs);
});

// Add new blog
blogsRouter.post("/", async (req, res) => {
  const body = req.body;

  const user = await User.findById(body.userId);

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
  await Blog.findByIdAndDelete(req.params.id);
  res.status(204).end();
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
