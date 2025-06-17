import supertest from "supertest";
import { testApp } from "./utils/testApp";
import prisma from "../src/utils/prismaClient";

test("User with access token can retrieve conversations", async () => {
    const signInRes = await supertest(testApp)
        .post("/signin")
        .type("form")
        .send({ email: "johndoe@testmail.com", password: "SuperSecret11" })

    const token = signInRes.body.token;

    const response = await supertest(testApp)
        .get("/conversations")
        .set("Authorization", `Bearer ${token}`)
        .expect("Content-Type", /json/)
        .expect(200);
    
    expect(response.body).toHaveProperty("conversations");

});

test("Trying to access conversations without a token throws an error", async () => {
    await supertest(testApp)
        .get("/conversations")
        .expect(401)
})

test("When logged in as John, John can retrieve the test message conversation between himself and Jim", async () => {
    const signInRes = await supertest(testApp)
        .post("/signin")
        .type("form")
        .send({ email: "johndoe@testmail.com", password: "SuperSecret11" })

    const token = signInRes.body.token;

    const response = await supertest(testApp)
        .get("/conversations")
        .set("Authorization", `Bearer ${token}`)
        .expect("Content-Type", /json/)
        .expect(200);

    expect(response.body).toHaveProperty("conversations")
    expect(response.body.conversations[0]).toHaveProperty("id")
    expect(response.body.conversations[0].lastMessage).toEqual('Test message')
})

test("When logged in as Wade, Wade won't have any conversations", async () => {
    const signInRes = await supertest(testApp)
        .post("/signin")
        .type("form")
        .send({ email: "wadefoz@testmail.com", password: "SuperSecret14" })

    const token = signInRes.body.token;

    const response = await supertest(testApp)
        .get("/conversations")
        .set("Authorization", `Bearer ${token}`)
        .expect("Content-Type", /json/)
        .expect(200);

    expect(response.body).toHaveProperty("conversations")
    expect(response.body.conversations).toHaveLength(0);
})
