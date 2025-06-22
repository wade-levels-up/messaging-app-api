import supertest from "supertest";
import { testApp } from "./utils/testApp";
import signInUser from "./utils/signInUser";
import { handleError } from "../src/utils/handleError";

test("User with access token can retrieve conversations", async () => {
    const signInRes = await signInUser("johndoe@testmail.com", "SuperSecret11")

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

test("When logged in as John, John can retrieve the test message and conversation between himself and Jim", async () => {
    const signInRes = await signInUser("johndoe@testmail.com", "SuperSecret11")

    const token = signInRes.body.token;

    const response = await supertest(testApp)
        .get("/conversations")
        .set("Authorization", `Bearer ${token}`)
        .expect("Content-Type", /json/)
        .expect(200);

    expect(response.body).toHaveProperty("conversations")
    expect(response.body.conversations[0]).toHaveProperty("id")
    expect(response.body.conversations[0].lastMessage).toEqual('Good morning!')
})

test("When logged in as Jim, Jim can retrieve the test message and conversation between himself and John", async () => {
    const signInRes = await signInUser("jimdoe@testmail.com", "SuperSecret13")

    const token = signInRes.body.token;

    const response = await supertest(testApp)
        .get("/conversations")
        .set("Authorization", `Bearer ${token}`)
        .expect("Content-Type", /json/)
        .expect(200);

    expect(response.body).toHaveProperty("conversations")
    expect(response.body.conversations[0]).toHaveProperty("id")
    expect(response.body.conversations[0].lastMessage).toEqual('Good morning!')
})

test("When logged in as Wade, Wade won't have any conversations", async () => {
    const signInRes = await signInUser("wadefoz@testmail.com", "SuperSecret14")

    const token = signInRes.body.token;

    const response = await supertest(testApp)
        .get("/conversations")
        .set("Authorization", `Bearer ${token}`)
        .expect("Content-Type", /json/)
        .expect(200);

    expect(response.body).toHaveProperty("conversations")
    expect(response.body.conversations).toHaveLength(0);
})

test("Retrieve specific conversation's messages for logged in user", async () => {
    const signInRes = await signInUser("johndoe@testmail.com", "SuperSecret11")

    const token = signInRes.body.token;

    const conversationResponse = await supertest(testApp)
        .get("/conversations")
        .set("Authorization", `Bearer ${token}`)
        .expect("Content-Type", /json/)
        .expect(200);

    const conversationId = conversationResponse.body.conversations[0].id

    const response = await supertest(testApp)
        .get(`/conversations/${conversationId}/messages`)
        .set("Authorization", `Bearer ${token}`)
        .expect("Content-Type", /json/)
        .expect(200);

    expect(response.body).toHaveProperty("conversationMessages")
    expect(response.body.conversationMessages[0].content).toBe("Good morning!");
})

test("User can create a new conversation between themselves and other users with an opening message", async () => {
    const signInRes = await signInUser("johndoe@testmail.com", "SuperSecret11")
    const token = signInRes.body.token; 
    
    const usernameOfPersonConversationCreatedWith = 'JaneDoe'

    await supertest(testApp)
        .post('/conversations')
        .set("Authorization", `Bearer ${token}`)
        .type("form")
        .send({ user: usernameOfPersonConversationCreatedWith, openingMessage: 'Hi Jane!' })
        .expect("Content-Type", /json/)
        .expect({ message: `New conversation started between JohnDoe and ${usernameOfPersonConversationCreatedWith}` })
        .expect(201);

    // Retrieve the id of the newly created conversation with Jane
    const conversationResponse = await supertest(testApp)
        .get("/conversations")
        .set("Authorization", `Bearer ${token}`)
        .expect("Content-Type", /json/)
        .expect(200);
    const conversationId = conversationResponse.body.conversations[1].id
    
    const response = await supertest(testApp)
        .get(`/conversations/${conversationId}/messages`)
        .set("Authorization", `Bearer ${token}`)
        .expect("Content-Type", /json/)
        .expect(200);

    expect(response.body).toHaveProperty("conversationMessages")
    expect(response.body.conversationMessages[0].content).toBe("Hi Jane!");
})




