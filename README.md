# messaging-app-api

## Overview

The messaging-app-api is a Node.js and Express-based backend service designed to power a modern messaging platform. It provides secure user authentication, profile management, and user discovery features. The API leverages PostgreSQL for data storage and Prisma ORM for database access and migrations. Authentication is handled via JWT tokens, ensuring secure access to protected endpoints. The service also supports email verification and notifications using SMTP.

Key features include:

- User Registration & Authentication: Secure sign-up and sign-in with hashed passwords, email verification and JWT-based sessions.
- Profile Management: Endpoints for retrieving and updating user profile data, including usernames, bios, and profile pictures.
- User Discovery: Fetch a list of all registered users or retrieve individual user profiles for populating profile pages.
- Testing & Reliability: Comprehensive automated tests using Jest and Supertest to ensure API reliability.
- Environment Configuration: Uses environment variables for database connections, email credentials, and secret keys, supporting both development and test environments.
- This API is designed for extensibility and security, making it a solid foundation for messaging or social applications.

---

## Getting Started

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Fill in your environment variables.
4. Run database migrations: `npm run prisma:migrate`.
5. Start the server: `npm run dev` or `npm start`.
6. Run the testing environment: `npm test:watch`.

## Environment Variables

The below variables are stored in a .env file located at the root of the api. Take care not to upload these to version control or expose them publicly as this data is sensitive and poses a security risk if shared. Ensure .env is included in your .gitignore file.

| Env Variable      | Description                                                                                                       |
| ----------------- | ----------------------------------------------------------------------------------------------------------------- |
| NODE_ENV          | Specifies the environment node runs in. Default setting is 'development', when running tests switch to 'test'     |
| DATABASE_URL      | Connection string to the database being used                                                                      |
| TEST_DATABASE_URL | Connection string to an alternate test database used for running tests                                            |
| PORT              | Specifies the network port number on which the server listens for incoming HTTP requests. Default setting is 3000 |
| CLIENT            | Specifies the domain of the front end client that back end access is granted to                                   |
| SMTP_HOST         | Simple Mail Transfer Protocol Host. For example: smtp.gmail.com. Used for user email verification                 |
| SMTP_PORT         | Specifies the network port number used to connect to the SMTP server for sending emails                           |
| SMTP_USER         | Specifies the username or email address used to authenticate with the SMTP server when sending emails             |
| SMTP_PASS         | Specifies the password used to authenticate with the SMTP host server when sending emails                         |
| JWT_SECRET_KEY    | Key used to sign the json web token                                                                               |
| SUPABASE_KEY      | Key used to access Supabase                                                                                       |
| SUPABASE_URL      | URL endpoint to connect to Supabase                                                                               |

## API Usage

### Quick Reference Table

Note: 👮🏼 Protected Routes require a valid JWT in the `Authorization` header. A valid JWT is obtained using the /signup and /signin routes.

| Method | Path                                     | Action / Resource                                                                                                                                                            |
| ------ | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| POST   | /signup                                  | Creates a new user account                                                                                                                                                   |
| POST   | /signin                                  | Signs a user into their account and returns a JWT to the browser                                                                                                             |
| POST   | /conversations                           | 👮🏼 Protected: Creates a new conversation between the logged in user and another user                                                                                         |
| POST   | /conversations/:conversation_id/messages | 👮🏼 Protected: Creates a new message within a specific conversation from a logged in user                                                                                     |
| GET    | /verify-user?token=...                   | Account email verification - Verifies a user's email address using the token sent to their email.                                                                            |
| GET    | /users                                   | Retrieves an array of all the users as objects, containing username, profile picture path, their join date and a list of their friend's and users they are friends of.       |
| GET    | /users/:username                         | Retrieves a specific users data for purpose of displaying a users public profile                                                                                             |
| GET    | /users/me                                | 👮🏼 Protected: Retrieves the logged in user's data, including a list of their friends and also who they are friends of data                                                   |
| GET    | /conversations                           | 👮🏼 Protected: Retrieves conversations of the logged in user                                                                                                                  |
| GET    | /conversations/:conversation_id/messages | 👮🏼 Protected: Retrieves a specific conversation's messages for the id in the route parameter :conversation_id.                                                               |
| GET    | /friends                                 | 👮🏼 Protected: Retrieves an array of users that are friends of the logged in user. The friend objects contain their username, profile picture path, bio and joined date. user |
| GET    | /users/:username/friends                 | Retrieves a specific users friends as an array of usernames                                                                                                                  |
| PUT    | /friends                                 | 👮🏼 Protected: Allows the logged in user to update their friends list to include another user                                                                                 |
| PUT    | /users/me/bio                            | 👮🏼 Protected: Allows the logged in user to update their bio                                                                                                                  |
| PUT    | /users/me/profile_picture                | 👮🏼 Protected: Allows the logged in user to update their profile picture                                                                                                      |
| DELETE | /friends/:username                       | 👮🏼 Protected: Users can delete friends from their friend's list                                                                                                              |
| DELETE | /messages/:message_id                    | 👮🏼 Protected: Deletes a specific message authored by the logged in user                                                                                                      |

---

### POST Routes

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

### GET Routes

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
Retrieves an array of all the users as objects, containing username, profile picture path, their join date and a list of their friend's and users they are friends of.

**Example Response:**

```json
{
  "message": "Retrieved all users.",
  "allUsers": [
    {
      "username": "JohnDoe",
      "bio": "Hey my name is John Doe",
      "profile_picture_path": "http:/hostwebsite/johndoe",
      "joined": "20/5/25",
      "friends:": [{ "username": "JimDoe" }],
      "friendsOf:" [{ "username": "JaneDoe" }, { "username": "JimDoe" }]
    },
    {
      "username": "JaneDoe",
      "bio": "Hey my name is Jane Doe",
      "profile_picture_path": "http:/hostwebsite/janedoe",
      "joined": "12/2/25",
      "friends:": [{ "username": "JimDoe" }],
      "friendsOf:": [{ "username": "JohnDoe" }, { "username": "JimDoe" }]
    }
  ]
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
  "userData": {
    "username": "JohnDoe",
    "bio": "Hey my name is John Doe",
    "profile_picture_path": "http:/hostwebsite/johndoe",
    "joined": "20/5/25"
  }
}
```

---

**Method:** GET
**Endpoint:** `/users/me`

**Description:**  
Retrieves the logged in user's data, including a list of their friends and also who they are friends of. See GET /users endpoint above for breakdown of friends and friendsOf

**Request Headers:**

Authorization: Bearer 'your-jwt-token'

**Example Response:**

```json
{
  "message": "Retrieved your user data",
  "userData": { username, joined, bio, profile_picture_path, friends, friendsOf }
}
```

---

**Method:** GET
**Endpoint:** `/conversations`

**Description:**  
Retrieves conversations of the logged in user

**Request Headers:**

Authorization: Bearer 'your-jwt-token'

**Example Response:**

```json
{
  "message": "Conversations retrieved",
  "conversations": [12, 13, 15, 28]
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
Retrieves an array of users that are friends of the logged in user. The friend objects contain their username, profile picture path, bio and joined date.

**Request Headers:**

Authorization: Bearer 'your-jwt-token'

**Example Response:**

```json
{
  "message": "Retrieved your friends",
  "friends": [
    {
      "username": "JohnDoe",
      "bio": "Hey my name is John Doe",
      "profile_picture_path": "http:/hostwebsite/johndoe",
      "joined": "20/5/25"
    }
  ]
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

### PUT Routes

---

**Method:** PUT
**Endpoint:** `/friends/:username`

**Description:**

Allows the logged in user to update their friends list to include another user

**Request Headers:**

Authorization: Bearer 'your-jwt-token'

**Example Response:**

```json
{
  "message": "Successfully added wadefoz as a friend"
}
```

---

**Method:** PUT
**Endpoint:** `/users/me/bio`

**Description:**

Allows the logged in user to update their bio

**Request Headers:**

Authorization: Bearer 'your-jwt-token'

**Request Body:**

```json
{
  "content": "Hi my name is Bob. I like pina coladas and getting caught in the rain."
}
```

**Example Response:**

```json
{
  "message": "Successfully updated your bio"
}
```

---

**Method:** PUT
**Endpoint:** `/users/me/profile_picture`

**Description:**

Allows the logged in user to update their profile picture

**Request Headers:**

Authorization: Bearer 'your-jwt-token'

**Request Body:**

```json
{
  "file": "fileName.jpeg"
}
```

**Example Response:**

```json
{
  "message": "Successfully updated your profile picture"
}
```

---

### DELETE Routes

---

**Method:** DELETE
**Endpoint:** `/friends/:username`

**Description:**

Users can delete friends from their friend's list

**Request Headers:**

Authorization: Bearer 'your-jwt-token'

**Example Response:**

```json
{
  "message": "Removed JimDoe from your friends list"
}
```

---

**Method:** DELETE
**Endpoint:** `/messages/:message_id`

**Description:**

Deletes a specific message authored by the logged in user

**Request Headers:**

Authorization: Bearer 'your-jwt-token'

**Example Response:**

```json
{
  "message": "Message Successfully deleted"
}
```
