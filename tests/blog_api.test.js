const { test, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./test_helper");
const api = supertest(app);
const Blog = require("../models/blogSchema");

beforeEach(async () => {
  await Blog.deleteMany({});

  // PROMISE ALL
  // const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  // const promiseArray = blogObjects.map((blog) => blog.save());
  // await Promise.all(promiseArray);

  // for...of
  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
});

test("notes are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("there are three blogs", async () => {
  const response = await api.get("/api/blogs");

  assert.strictEqual(response.body.length, helper.initialBlogs.length);
});

test("a valid blog can be added", async () => {
  const newBlog = {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

  const blogTitle = blogsAtEnd.map((r) => r.title);
  assert(blogTitle.includes("First class tests"));
});

test("if likes is not added then return 0", async () => {
  const newBlog = {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  const lastBlog = blogsAtEnd[blogsAtEnd.length - 1];
  assert.strictEqual(lastBlog.likes, 0);
});

test("blog without title is not added", async () => {
  const newBlog = {
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
  };

  await api.post("/api/blogs").send(newBlog).expect(400);

  const response = await api.get("/api/blogs");

  assert.strictEqual(response.body.length, helper.initialBlogs.length);
});

test("blog without URL is not added", async () => {
  const newBlog = {
    title: "First class tests",
    author: "Robert C. Martin",
    likes: 10,
  };

  await api.post("/api/blogs").send(newBlog).expect(400);

  const response = await api.get("/api/blogs");

  assert.strictEqual(response.body.length, helper.initialBlogs.length);
});

after(async () => {
  await mongoose.connection.close();
});
