import supertest from "supertest";
import { testApp } from "./utils/testApp";
import signInUser from "./utils/signInUser";

test("Retrieves an array of usernames that are friends of the logged in user", async () => {
    const signInRes = await signInUser("johndoe@testmail.com", "SuperSecret11")
    const token = signInRes.body.token;

    const response = await supertest(testApp)
        .get("/friends")
        .set("Authorization", `Bearer ${token}`)
        .expect("Content-Type", /json/)
        .expect(200);
    
    expect(response.body).toHaveProperty("friends");
    expect(response.body.friends[0]).toBe("JimDoe");
});

test("Users can update their friends list to include other users", async () => {
    // Sign test user JohnDoe in and retrieve his token
    const signInRes = await signInUser("johndoe@testmail.com", "SuperSecret11")
    const token = signInRes.body.token;

    // Add test user wadefoz as a friend of JohnDoe using JohnDoe's token in the header
    const recipient = 'wadefoz'

    await supertest(testApp)
        .put(`/friends/${recipient}`)
        .set("Authorization", `Bearer ${token}`)
        .expect("Content-Type", /json/)
        .expect({ message: `Succesfully added ${recipient} as a friend` })
        .expect(201);

    // Confirm that test user wadefoz is now in JohnDoe's friends list by retrieving JohnDoe's friends
    const response = await supertest(testApp)
        .get("/friends")
        .set("Authorization", `Bearer ${token}`)
        .expect("Content-Type", /json/)
        .expect(200);
    
    expect(response.body).toHaveProperty("friends");
    expect(response.body.friends[1]).toBe("wadefoz");
})

test('User can delete friends from their friends list', async () => {
    // Sign test user JohnDoe in and retrieve his token
    const signInRes = await signInUser("johndoe@testmail.com", "SuperSecret11")
    const token = signInRes.body.token;

    const nameOfPersonToUnfriend = 'JimDoe'

    // Remove JimDoe as a friend
    await supertest(testApp)
        .delete(`/friends/${nameOfPersonToUnfriend}`)
        .set("Authorization", `Bearer ${token}`)
        .expect("Content-Type", /json/)
        .expect(200)
        .expect({ message: `Removed ${nameOfPersonToUnfriend} from your friends list` })

    // Confirm that JohnDoe no longer has JimDoe as a friend
    const response = await supertest(testApp)
        .get("/friends")
        .set("Authorization", `Bearer ${token}`)
        .expect("Content-Type", /json/)
        .expect(200);

    expect(response.body).toHaveProperty("friends");
    expect(Array.isArray(response.body.friends)).toBe(true);
    expect(response.body.friends).not.toContain("JimDoe");
})