# messaging-app-api

## Overview

**messaging-app-api** is a secure RESTful API for applications utilizing sign-up, sign-in and access to protected routes for users, built with Node.js, Express, TypeScript, and PostgreSQL (via Prisma ORM).  
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

### Quick Reference Table

Note: 👮🏼 Protected Routes require a valid JWT in the `Authorization` header. A valid JWT is obtained using the /signup and /signin routes.

| Avail. | Method | Path                                     | Action / Resource                                                                                              |
| ------ | ------ | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| ✅     | POST   | /signup                                  | Creates a new user account                                                                                     |
| ✅     | POST   | /signin                                  | Signs a user into their account and returns a JWT to the browser                                               |
| ✅     | POST   | /conversations                           | 👮🏼 Protected: Creates a new conversation between the logged in user and another user                           |
| ✅     | POST   | /conversations/:conversation_id/messages | 👮🏼 Protected: Creates a new message within a specific conversation from a logged in user                       |
| ✅     | GET    | /verify-user?token=...                   | Account email verification - Verifies a user's email address using the token sent to their email.              |
| ✅     | GET    | /users                                   | Retrieves an array of all user's usernames                                                                     |
| ✅     | GET    | /users/:username                         | Retrieves a specific users data for purpose of displaying a users public profile                               |
| ✅     | GET    | /users/me                                | 👮🏼 Protected: Retrieves the logged in user's data                                                              |
| ✅     | GET    | /conversations/:conversation_id/messages | 👮🏼 Protected: Retrieves a specific conversation's messages for the id in the route parameter :conversation_id. |
| ✅     | GET    | /friends                                 | 👮🏼 Protected: Retrieves an array of usernames that are friends of the logged in user                           |
| ✅     | GET    | /users/:username/friends                 | Retrieves a specific users friends as an array of usernames                                                    |
| ❌     | PUT    | /friends                                 | 👮🏼 Protected: Allows the logged in user to update their friends list to include another user                   |

---

### Features Implemented OR To Be Implemented

- ✅ Users can create an acount and sign in with email verification
- ✅ All users can be displayed publicly
- ✅ Specific user data can be retrieved for populating user profiles
- ✅ A logged in users data can be retrieved for populating their own profile
- ✅ Messages can be retrieved for a specific conversation for the logged in user
- ✅ Users can create new conversations with other users
- ✅ Users can add messages to conversations
- ❌ Users can update their friends list to include other users
- ❌ Users can update their bio
- ❌ Users can upload their own profile pictures

---

### Post Routes

---

**Method:** POST
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

**Method:** POST
**Endpoint:** `/signin`

**Description:**  
Signs a user into their account and returns a JWT to the browser

**Request Body:**

```json
{
  "email": "janedoe@gmail.com",
  "password": "super-secret-password"
}
```

---

**Method:** POST
**Endpoint:** `/conversations/:conversation_id/messages`

**Description:**  
Creates a new message within a specific conversation from a logged in user

**Request Headers:**

Authorization: Bearer 'your-jwt-token'

**Request Body:**

```json
{
  "content": "Today is going to be a good day",
  "authorName": "JohnDoe"
}
```

**Example Response:**

```json
{
  "message": "New message created by JohnDoe"
}
```

---

**Method:** POST
**Endpoint:** `/conversations`

**Description:**  
Creates a new conversation between the logged in user and another user

**Request Headers:**

Authorization: Bearer 'your-jwt-token'

**Request Body:**

```json
{
  "sender": "JohnDoe",
  "recipient": "JaneDoe",
  "openingMessage": "Hi Jane!"
}
```

**Example Response:**

```json
{
  "message": "New conversation started between JohnDoe and JaneDoe"
}
```

---

### Get Routes

---

```json
{
  "email": "janedoe@gmail.com",
  "password": "super-secret-password"
}
```

---

**Method:** GET
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

**Method:** GET
**Endpoint:** `/users`

**Description:**  
Retrieves an array of all user's usernames.

**Example Response:**

```json
{
  "message": "Retrieved all users.",
  "allUsers": ["JohnDoe", "JaneDoe", "WadeFoz"]
}
```

---

**Method:** GET
**Endpoint:** `/users/:username`

**Description:**  
Retrieves a specific users data for purpose of displaying a users public profile

**Example Response:**

```json
{
  "message": "User data retrieved",
  "userData": { username, joined }
}
```

---

**Method:** GET
**Endpoint:** `/users/me`

**Description:**  
Retrieves the logged in user's data

**Request Headers:**

Authorization: Bearer 'your-jwt-token'

**Example Response:**

```json
{
  "message": "Retrieved your user data",
  "userData": { username, joined }
}
```

---

**Method:** GET
**Endpoint:** `/conversations/:conversation_id/messages`

**Description:**  
Retrieves a specific conversation's messages for the logged in user

**Request Headers:**

Authorization: Bearer 'your-jwt-token'

**Example Response:**

```json
{
  "message": "Conversation messages retrieved",
  "conversationMessages": [
    {
      "authorName": "JimDoe",
      "content": "Good morning!",
      "createdAt": "17/05/2025"
    }
  ]
}
```

---

**Method:** GET
**Endpoint:** `/friends`

**Description:**  
Retrieves an array of usernames that are friends of the logged in user

**Request Headers:**

Authorization: Bearer 'your-jwt-token'

**Example Response:**

```json
{
  "message": "Retrieved your friends",
  "friends": ["JohnDoe", "JimDoe"]
}
```

---

**Method:** GET
**Endpoint:** `/users/:username/friends`

**Description:**  
Retrieves a specific users friends as an array of usernames

**Example Response:**

```json
{
  "message": "Retrieved JohnDoe's friends",
  "friends": ["JimDoe", "JaneDoe"]
}
```

---

### Put Routes

---

**Method:** PUT
**Endpoint:** `/friends`

**Description:**

Allows the logged in user to update their friends list to include another user

**Request Headers:**

Authorization: Bearer 'your-jwt-token'

**Example Response:**

```json
{
  "message": "Succesfully added wadefoz as a friend"
}
```
