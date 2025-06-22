import app from "../../src/app"
import prisma from "../../src/utils/prismaClient";
import bcrypt from "bcryptjs";

export const testApp = app;

beforeEach(async () => {

    // Clear the database data prior to running each test

    await prisma.$transaction([
        prisma.message.deleteMany({}),
        prisma.conversation.deleteMany({}),
        prisma.user.deleteMany({})
    ]);


    // Seed the database with test data and users

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
            lastMessage: 'Good morning!'
        }
    })


    // Retrieve user data for test users John and Jim

    const johnDoe = await prisma.user.findUnique({
        where: {
            username: "JohnDoe"
        },
        include: { conversations: true }
    })
    if (!johnDoe) { throw new Error("Failed to initialize JohnDoe user for test setup") }

    const jimDoe = await prisma.user.findUnique({
        where: {
            username: "JimDoe"
        },
        include: { conversations: true }
    })
    if (!jimDoe) { throw new Error("Failed to initialize JimDoe user for test setup") }


    // Update users Jim and John to have each other as friends

    await prisma.user.update({
        where: { id: String(johnDoe.id) },
        data: { friends: { connect: { id: jimDoe.id } } }
    });

    await prisma.user.update({
        where: { id: String(jimDoe.id) },
        data: { friends: { connect: { id: johnDoe.id } } }
    });


    // Create a test message for testing purposes

    await prisma.message.create({
        data: {
            content: "Good morning!",
            authorName: String(johnDoe?.username),
            userId: String(johnDoe?.id),
            conversationId: Number(johnDoe?.conversations[0].id),
        }
    })
});

afterAll(async () => {
  await prisma.$disconnect();
});