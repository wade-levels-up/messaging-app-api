import express from "express";
import { signUpRouter } from "../../src/routes/signUp"
import { signInRouter } from "../../src/routes/signIn"
import { verifyUserRouter } from "../../src/routes/verifyUser"
import { dashboardRouter } from "../../src/routes/dashboard"
import prisma from "../../src/utils/prismaClient";
import bcrypt from "bcryptjs";

export const testApp = express();

testApp.use(express.json());
testApp.use(express.urlencoded({ extended: false }));

testApp.use('/signup', signUpRouter);
testApp.use('/signin', signInRouter);
testApp.use('/verify-user', verifyUserRouter);
testApp.use('/dashboard', dashboardRouter);

beforeEach(async () => {
  await prisma.user.deleteMany({});
  await prisma.user.createMany({
    data: [
      { 
        username: "JohnDoe", email: "johndoe@testmail.com", password: await bcrypt.hash("SuperSecret11", 10), 
        verificationToken: "testToken1", verified: true
      },
      { 
        username: "UnverifiedUser", email: "unverified@testmail.com", password: await bcrypt.hash("SuperSecret12", 10), 
        verificationToken: "testToken2", verified: false
      }
    ]
  })
});

afterAll(async () => {
  await prisma.$disconnect();
});