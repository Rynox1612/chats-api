Yeh lo draft:

# Chats API

A simple **Node.js + Express** based API built for experimenting with **chat endpoints** and testing different approaches to **error handling**.

## 📌 Features

- Basic chat routes (create, read, update, delete).
- Custom error handling middleware to gracefully handle exceptions.
- Designed as a learning project to practice error management in Express.

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/chats-api.git
cd chats-api
```

2. Install dependencies

```bash
npm install
```

3. Run the server

```bash
node index.js
```

Server will start on:

http://localhost:8080

🛠️ Example Endpoints
Get all chats
GET /chats

Add a new chat
POST /chats
Content-Type: application/json

{
"username": "Rupesh",
"message": "Hello from Chats API!"
}

Example of error handling

If you hit an invalid route:

GET /random-route

Response:

{
"error": "Route not found"
}

⚡ Error Handling

Uses a custom error class to throw structured errors.

Centralized error-handling middleware catches errors and sends clean JSON responses.

Helpful for debugging and testing unexpected cases.

🔹 This project is mainly for practicing and showcasing error handling skills with Express.

---
