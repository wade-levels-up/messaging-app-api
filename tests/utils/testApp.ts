import app from "../../src/app"
import prisma from "../../src/utils/prismaClient";
import bcrypt from "bcryptjs";

export const testApp = app;

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