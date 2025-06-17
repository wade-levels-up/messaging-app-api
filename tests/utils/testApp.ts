import app from "../../src/app"
import prisma from "../../src/utils/prismaClient";
import bcrypt from "bcryptjs";

export const testApp = app;

beforeEach(async () => {
    await prisma.$transaction([
        prisma.message.deleteMany({}),
        prisma.conversation.deleteMany({}),
        prisma.user.deleteMany({})
    ]);

    await prisma.user.createMany({
        data: [
        { 
            username: "JohnDoe", email: "johndoe@testmail.com", password: await bcrypt.hash("SuperSecret11", 10), 
            verificationToken: "testToken1", verified: true
        },
        { 
            username: "UnverifiedUser", email: "unverified@testmail.com", password: await bcrypt.hash("SuperSecret12", 10), 
            verificationToken: "testToken2", verified: false
        },
        {
            username: "JimDoe", email: "jimdoe@testmail.com", password: await bcrypt.hash("SuperSecret13", 10), 
            verificationToken: "testToken3", verified: true
        },
        {
            username: "wadefoz", email: "wadefoz@testmail.com", password: await bcrypt.hash("SuperSecret14", 10), 
            verificationToken: "testToken4", verified: true
        },
        ]
    });
    
    await prisma.conversation.create({
        data: {
            users: {
                connect: [
                    { username: 'JohnDoe' },
                    { username: 'JimDoe'}
                ]
            },
            lastMessage: 'Test message'
        }
    })
});

afterAll(async () => {
  await prisma.$disconnect();
});