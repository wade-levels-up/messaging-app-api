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

beforeEach(async () => {
  await prisma.user.deleteMany({});
});

test("sign up route works", async () => {
    await supertest(app)
    .post("/signup")
    .type("form")
    .send({ email: 'janedoe@testmail.com', username: "JaneDoe", password: "SuperSecret10"})
    .expect("Content-Type", /json/)
    .expect({ message: "User created successfully" })
    .expect(201);
}, 15000);

