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
    .send({ email: 'jennydoe@testmail.com', username: "JennyDoe", password: "SuperSecret2"})
    .expect("Content-Type", /json/)
    .expect({ message: "User created successfully" })
    .expect(201);
}, 15000);

test("sign up throws an error for a duplicate user", async () => {
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
  const johnsResponse = await supertest(testApp)
    .get("/users/JohnDoe")
    .expect("Content-Type", /json/)
    .expect(200);

  expect(johnsResponse.body).toHaveProperty("userData");
  expect(johnsResponse.body.message).toBe("User data retrieved");
  expect(johnsResponse.body.userData).toHaveProperty("username");
  expect(johnsResponse.body.userData).toHaveProperty("joined");
  expect(johnsResponse.body.userData['username']).toBe("JohnDoe");

  const jimsResponse = await supertest(testApp)
    .get("/users/JimDoe")
    .expect("Content-Type", /json/)
    .expect(200);

  expect(jimsResponse.body).toHaveProperty("userData");
  expect(jimsResponse.body.message).toBe("User data retrieved");
  expect(jimsResponse.body.userData).toHaveProperty("username");
  expect(jimsResponse.body.userData).toHaveProperty("joined");
  expect(jimsResponse.body.userData['username']).toBe("JimDoe");
})

test('Able to retrieve friends list of a specific user', async () => {
  const johnsResponse = await supertest(testApp)
    .get("/users/JohnDoe/friends")
    .expect("Content-Type", /json/)
    .expect(200);

  expect(johnsResponse.body).toHaveProperty("friends");
  expect(johnsResponse.body.message).toBe("Retrieved JohnDoe's friends");
  expect(johnsResponse.body.friends[0]).toBe("JimDoe");
})

test('User data contains a bio field', async () => {
  const signInRes = await signInUser('johndoe@testmail.com', 'SuperSecret11')
  const token = signInRes.body.token;

  const response = await supertest(testApp)
    .get("/users/me")
    .set("Authorization", `Bearer ${token}`)
    .expect("Content-Type", /json/)
    .expect(200);

  expect(response.body).toHaveProperty("userData");
  expect(response.body.userData).toHaveProperty("bio");
});

test('Logged in user is able to update bio', async () => {
  // Sign in as JohnDoe and retrieve his empty bio
  const signInRes = await signInUser('johndoe@testmail.com', 'SuperSecret11')
  const token = signInRes.body.token;
  const firstResponse = await supertest(testApp)
    .get("/users/me")
    .set("Authorization", `Bearer ${token}`)

  expect(firstResponse.body).toHaveProperty("userData");
  expect(firstResponse.body.userData).toHaveProperty("bio");
  expect(firstResponse.body.userData.bio).toBeFalsy;

  // Update JohnDoe's bio
  await supertest(testApp)
    .put("/users/me/bio")
    .type("form")
    .send({ content: 'Hi my name is JohnDoe. I have a sister named JaneDoe and a brother named JimDoe'})
    .expect("Content-Type", /json/)
    .expect({ message: "Succesfully updated your bio" })
    .expect(201);

  // Expect to see JohnDoe's bio updated when we retrieve his data the second time
  const secondResponse = await supertest(testApp)
    .get("/users/me")
    .set("Authorization", `Bearer ${token}`)

  expect(secondResponse.body).toHaveProperty("userData");
  expect(secondResponse.body.userData).toHaveProperty("bio");
  expect(secondResponse.body.userData.bio).toBe({ 'Hi my name is JohnDoe. I have a sister named JaneDoe and a brother named JimDoe': String });
});

