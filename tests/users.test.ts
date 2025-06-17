import supertest from "supertest";
import { testApp } from "./utils/testApp";

// Mocks

jest.mock("../src/utils/sendEmail", () => ({
  sendVerificationEmail: jest.fn().mockResolvedValue(undefined),
}));

// Tests

test("sign up route works", async () => {
    await supertest(testApp)
    .post("/signup")
    .type("form")
    .send({ email: 'janedoe@testmail.com', username: "JaneDoe", password: "SuperSecret10"})
    .expect("Content-Type", /json/)
    .expect({ message: "User created successfully" })
    .expect(201);
}, 15000);

test("sign up throws an error for a duplicate user", async () => {
  await supertest(testApp)
    .post("/signup")
    .type("form")
    .send({ email: 'janedoe@testmail.com', username: "JaneDoe", password: "SuperSecret10"})
    .expect(201);

  await supertest(testApp)
    .post("/signup")
    .type("form")
    .send({ email: 'janedoe@testmail.com', username: "JaneDoe", password: "SuperSecret10"})
    .expect("Content-Type", /json/)
    .expect({ message: "A user with this email or username already exists." })
    .expect(400);
}, 15000);

test("Successful sign in provides web token", async () => {
  const response = await supertest(testApp)
    .post("/signin")
    .type("form")
    .send({ email: "johndoe@testmail.com", password: "SuperSecret11"})
    .expect("Content-Type", /json/)
    .expect(200);

  expect(response.body).toHaveProperty("message", "sign in successful");
  expect(response.body).toHaveProperty("token");
  expect(typeof response.body.token).toBe("string");
  expect(response.body.token.length).toBeGreaterThan(0);
});

test("Unverified user sign in sends 401 status and json message", async () => {
  const response = await supertest(testApp)
    .post("/signin")
    .type("form")
    .send({ email: "unverified@testmail.com", password: "SuperSecret12"})
    .expect("Content-Type", /json/)
    .expect({ message: "Unverified account. Please verify your account via the link sent to your email" })
    .expect(401);
  
  expect(response.body.token).toBeUndefined();
}, 15000);

test("Incorrect password on sign in sends 401 status and json message", async () => {
  const response = await supertest(testApp)
    .post("/signin")
    .type("form")
    .send({ email: "johndoe@testmail.com", password: "wrongpassword"})
    .expect("Content-Type", /json/)
    .expect({ message: "Invalid password" })
    .expect(401);
  
  expect(response.body.token).toBeUndefined();
}, 15000);

test("Sign in with invalid username sends 404 error and message", async () => {
  const response = await supertest(testApp)
    .post("/signin")
    .type("form")
    .send({ email: "not.a.real.user@gmail.com", password: "SuperSecret13"})
    .expect("Content-Type", /json/)
    .expect({ message: "Invalid email address. No user found" })
    .expect(404);
  
  expect(response.body.token).toBeUndefined();
});

test("Accessing /dashboard without token returns 401", async () => {
  await supertest(testApp)
    .get("/dashboard")
    .expect("Content-Type", /json/)
    .expect({ message: "No token provided" })
    .expect(401);
})

test("Accessing /dashboard with invalid token returns 401", async () => {
  await supertest(testApp)
    .get("/dashboard")
    .set("Authorization", "Bearer invalidtoken")
    .expect("Content-Type", /json/)
    .expect({ message: "Invalid or expired token" })
    .expect(401);
})

test("Accessing /dashboard with valid token returns 200 and dashboard data", async () => {
  const signInRes = await supertest(testApp)
    .post("/signin")
    .type("form")
    .send({ email: "johndoe@testmail.com", password: "SuperSecret11" })
    .expect(200);

  const token = signInRes.body.token;

  const response = await supertest(testApp)
    .get("/dashboard")
    .set("Authorization", `Bearer ${token}`)
    .expect("Content-Type", /json/)
    .expect(200);

  expect(response.body).toHaveProperty("userData");
  expect(response.body.userData).toHaveProperty("username");
});


