import supertest from "supertest";
import { testApp } from "./utils/testApp";
import signInUser from "./utils/signInUser";

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
    .send({ email: "not.a.real.user@gmail.com", password: "SuperSecretSauce"})
    .expect("Content-Type", /json/)
    .expect({ message: "Invalid email address. No user found" })
    .expect(404);
  
  expect(response.body.token).toBeUndefined();
});

test("Accessing /users/me with valid token returns 200 and users data", async () => {
  const signInRes = await signInUser('johndoe@testmail.com', 'SuperSecret11')

  const token = signInRes.body.token;

  const response = await supertest(testApp)
    .get("/users/me")
    .set("Authorization", `Bearer ${token}`)
    .expect("Content-Type", /json/)
    .expect(200);

  expect(response.body).toHaveProperty("userData");
  expect(response.body.userData).toHaveProperty("username");
});

test("Accessing /users returns an array of all user's usernames, the first of which is JohnDoe", async () => {
  const response = await supertest(testApp)
    .get("/users")
    .expect("Content-Type", /json/)
    .expect(200);

  expect(Array.isArray(response.body.allUsers)).toBe(true);
  expect(response.body.allUsers[0]).toEqual("JohnDoe");
});

test('Accessing specific users route returns user data for the purpose of populating a profile page', async () => {
  const signInRes = await signInUser('johndoe@testmail.com', 'SuperSecret11')
  
  const token = signInRes.body.token;

  const response = await supertest(testApp)
    .get("/users")
    .set("Authorization", `Bearer ${token}`)
    .expect("Content-Type", /json/)
    .expect(200);

  const userData = await supertest(testApp)
    .get("/users/:user_id")
    .expect("Content-Type", /json/)
    .expect(200);

  expect(response.body).toHaveProperty("userData");
  expect(response.body.userData).toHaveProperty("username");
})

