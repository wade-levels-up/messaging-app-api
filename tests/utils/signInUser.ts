import supertest from "supertest";
import { testApp } from "./testApp";

export default async function signInUser(email: string, password: string) {
  const response = await supertest(testApp)
    .post("/signin")
    .type("form")
    .send({ email, password})
    .expect(200)

    return response
}