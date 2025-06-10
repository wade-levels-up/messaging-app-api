// Integration (API/Route) Tests

import supertest from "supertest";
import express from "express";
import { signUpRouter } from "../src/routes/signUp"
import prisma from "../src/utils/prismaClient";

// Mock email sending
jest.mock("../src/utils/sendEmail", () => ({
  sendVerificationEmail: jest.fn().mockResolvedValue(undefined),
}));

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use("/signup", signUpRouter);

// Delete all users before each test is run

beforeEach(async () => {
  await prisma.user.deleteMany({});
});

// Tests

test("sign up route works", async () => {
    await supertest(app)
    .post("/signup")
    .type("form")
    .send({ email: 'janedoe@testmail.com', username: "JaneDoe", password: "SuperSecret10"})
    .expect("Content-Type", /json/)
    .expect({ message: "User created successfully" })
    .expect(201);
}, 15000);

test("sign up throws an error for a duplicate user", async () => {
  await supertest(app)
    .post("/signup")
    .type("form")
    .send({ email: 'janedoe@testmail.com', username: "JaneDoe", password: "SuperSecret10"})
    .expect(201);

  await supertest(app)
    .post("/signup")
    .type("form")
    .send({ email: 'janedoe@testmail.com', username: "JaneDoe", password: "SuperSecret10"})
    .expect(400)
    .expect({ message: "A user with this email or username already exists." });
}, 15000);

