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