import supertest from "supertest";
import { testApp } from "./utils/testApp";
import signInUser from "./utils/signInUser";

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

test("User can create a new conversation with an opening message between themselves and other users", async () => {
    const signInRes = await signInUser("johndoe@testmail.com", "SuperSecret11")
    const token = signInRes.body.token; 
    
    const sender = 'JohnDoe'
    const recipient = 'JaneDoe'

    await supertest(testApp)
        .post('/conversations')
        .set("Authorization", `Bearer ${token}`)
        .type("form")
        .send({ sender, recipient, openingMessage: 'Hi Jane!' })
        .expect("Content-Type", /json/)
        .expect({ message: `New conversation started between JohnDoe and ${recipient}` })
        .expect(201);

    // Retrieve the id of the newly created conversation with Jane
    const conversationResponse = await supertest(testApp)
        .get("/conversations")
        .set("Authorization", `Bearer ${token}`)
        .expect("Content-Type", /json/)
        .expect(200);
    const conversationId = conversationResponse.body.conversations[1].id
    
    // Check to see that a conversation with Jane exists and that our opening message was sent
    const response = await supertest(testApp)
        .get(`/conversations/${conversationId}/messages`)
        .set("Authorization", `Bearer ${token}`)
        .expect("Content-Type", /json/)
        .expect(200);

    expect(response.body).toHaveProperty("conversationMessages")
    expect(response.body.conversationMessages[0].content ).toBe("Hi Jane!");

    // Confirm that Jane can also retrieve John's message by repeating the above process
    const janeSignInRes = await signInUser("janedoe@testmail.com", "SuperSecret16")
    const janeToken = janeSignInRes.body.token;

    const janeConversationResponse = await supertest(testApp)
        .get("/conversations")
        .set("Authorization", `Bearer ${janeToken}`)
        .expect("Content-Type", /json/)
        .expect(200);
    const janeConversationId = janeConversationResponse.body.conversations[0].id

    const janeResponse = await supertest(testApp)
        .get(`/conversations/${janeConversationId}/messages`)
        .set("Authorization", `Bearer ${janeToken}`)
        .expect("Content-Type", /json/)
        .expect(200);

    expect(janeResponse.body).toHaveProperty("conversationMessages")
    expect(janeResponse.body.conversationMessages[0].content).toBe("Hi Jane!")
    expect(janeResponse.body.conversationMessages[0].authorName).toBe("JohnDoe");
})

test("Users can create new messages", async () => {
    const signInRes = await signInUser("johndoe@testmail.com", "SuperSecret11")
    const token = signInRes.body.token; 
    
    const sender = 'JohnDoe'
    const content = 'Today is going to be a good day'

    // Retrieve the users conversations to get the ID needed to create a new message
    const conversationResponse = await supertest(testApp)
        .get("/conversations")
        .set("Authorization", `Bearer ${token}`)
    const conversationId = conversationResponse.body.conversations[0].id

    // Create a new message using the conversation's ID
    await supertest(testApp)
        .post(`/conversations/${conversationId}/messages`)
        .set("Authorization", `Bearer ${token}`)
        .type("form")
        .send({ sender, content })
        .expect("Content-Type", /json/)
        .expect({ message: `New message created by ${sender}` })
        .expect(201);

    const response = await supertest(testApp)
        .get(`/conversations/${conversationId}/messages`)
        .set("Authorization", `Bearer ${token}`)
        .expect("Content-Type", /json/)
        .expect(200);

    // As the test conversation is configured with a test message, we expect the second message to be the one we created above
    expect(response.body).toHaveProperty("conversationMessages")
    expect(response.body.conversationMessages[1].content).toBe("Today is going to be a good day");
})




