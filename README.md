# user-server-api

## Overview

**user-server-api** is a secure RESTful API for applications utilizing sign-up, sign-in and access to protected routes for users, built with Node.js, Express, TypeScript, and PostgreSQL (via Prisma ORM).  
It provides endpoints for user registration, authentication (with JWT), email verification, and protected user users access.  
The API is designed with security and scalability in mind, following best practices for password hashing, token-based authentication, and safe data handling.

Key features include:

- User sign-up with email verification
- Secure sign-in with JWT token issuance
- Protected routes accessible only to authenticated users
- Clean, consistent API responses
- Comprehensive error handling and validation

This API serves as the backend for platforms that enable users to sign-up, sign-in and access protected routes. It can be easily integrated with any frontend or mobile client.

## API Usage

✍🏻 **Method:** POST
**Endpoint:** `/signup`

**Description:**  
Creates a new user account.

**Request Body:**

```json
{
  "username": "janedoe",
  "email": "janedoe@gmail.com",
  "password": "super-secret-password"
}
```

---

✍🏻 **Method:** POST
**Endpoint:** `/signin`

**Description:**  
Signs a user into their account.

**Request Body:**

```json
{
  "email": "janedoe@gmail.com",
  "password": "super-secret-password"
}
```

---

🪙 **Method:** GET
**Endpoint:** `/verify-user?token=...`

**Description:**  
Verifies a user's email address using the token sent to their email.

**Query Parameters:**

- `token` (string, required): The verification token sent to the user's email.

**Example Response:**

```json
{
  "message": "Email verified successfully."
}
```

---

🐶 **Method:** GET
**Endpoint:** `/users`

**Description:**  
Retrieves the authenticated user's information.

**Requires:**
A valid JWT in the `Authorization` header.

**Headers:**

Authorization: Bearer `(your JWT token)`

**Success Response:**

- **Status:** 200 OK

```json
{
  "message": "Welcome to your dashboard.",
  "userData": {
    "id": "user-id-string",
    "username": "janedoe",
    "email": "janedoe@gmail.com",
    "joined": "2023-01-01T00:00:00.000Z",
    "verified": true
  }
}
```
