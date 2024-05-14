const { test, describe, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./test_helper");
const api = supertest(app);
const User = require("../models/user");
const bcryptjs = require("bcryptjs");

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcryptjs.hash("secret", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "EnriqueSV",
      name: "Enrique Solorzano",
      password: "admin",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((user) => user.username);
    assert(usernames.includes(newUser.username));
  });

  test("creation fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "admin",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(result.body.error.includes("expected `username` to be unique"));

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("creation fails if length of the password are 3 or less", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root2",
      name: "Superuser",
      password: "SU",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(
      result.body.error.includes("password must be at least 3 characters long")
    );

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("creation fails if length of the username are 3 or less", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "SU",
      name: "Superuser",
      password: "admin",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(
      result.body.error.includes(
        "User validation failed: username: Path `username` (`SU`) is shorter than the minimum allowed length (3)."
      )
    );

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
});

after(async () => {
  await mongoose.connection.close();
});
