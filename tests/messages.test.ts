import supertest from "supertest";
import { testApp } from "./utils/testApp";
import signInUser from "./utils/signInUser";

test('Users can delete a specific message that belongs to them', async () => {
    // Sign in as JohnDoe 
    const signInRes = await signInUser('johndoe@testmail.com', 'SuperSecret11')
    const token = signInRes.body.token;

    // Retrieve JohnDoe's conversations
    const conversationResponse = await supertest(testApp)
        .get("/conversations")
        .set("Authorization", `Bearer ${token}`)

    // Retrieve JohnDoe's messages to get the conversation ID
    const conversationId = conversationResponse.body.conversations[0].id
    const firstMessagesResponse = await supertest(testApp)
        .get(`/conversations/${conversationId}/messages`)
        .set("Authorization", `Bearer ${token}`)

    // Delete the message
    const idOfMessageToDelete = firstMessagesResponse.body.conversationMessages[0].id
    await supertest(testApp)
        .delete(`/messages/${idOfMessageToDelete}`)
        .set("Authorization", `Bearer ${token}`)
        .expect("Content-Type", /json/)
        .expect({ message: `Message succesfully deleted` })
        .expect(200);

    // Retrieve JohnDoe's messages and confirm "Good morning!" message no longer exists
    const secondMessagesResponse = await supertest(testApp)
        .get(`/conversations/${conversationId}/messages`)
        .set("Authorization", `Bearer ${token}`)

    expect(secondMessagesResponse.body).toHaveProperty("conversationMessages")
    expect(secondMessagesResponse.body.conversationMessages.length).toBe(0);
});

test(`Users can't delete a message that doesn't belong to them`, async () => {
    // Sign in as JimDoe 
    const signInRes = await signInUser('jimdoe@testmail.com', 'SuperSecret13')
    const token = signInRes.body.token;

    // Retrieve JimDoe's conversations
    const conversationResponse = await supertest(testApp)
        .get("/conversations")
        .set("Authorization", `Bearer ${token}`)

    // Retrieve messages between JohnDoe and JimDoe
    const conversationId = conversationResponse.body.conversations[0].id
    const messagesResponse = await supertest(testApp)
        .get(`/conversations/${conversationId}/messages`)
        .set("Authorization", `Bearer ${token}`)


    // Attempt and fail to delete the message that belongs to JohnDoe
    const idOfMessageToDelete = messagesResponse.body.conversationMessages[0].id
    await supertest(testApp)
        .delete(`/messages/${idOfMessageToDelete}`)
        .set("Authorization", `Bearer ${token}`)
        .expect("Content-Type", /json/)
        .expect({ message: `Unable to delete message` })
        .expect(404);
});

