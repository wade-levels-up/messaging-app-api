import supertest from "supertest";
import { testApp } from "./utils/testApp";

test("User with access token can retrieve their conversations", async () => {
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

}, 15000);
