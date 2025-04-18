# Library Management API

A RESTful Library Management API built using Hono and PostgreSQL.

The API provides authentication, API key management, author management, and book management endpoints.

---

## Features

- User Registration
- User Login
- JWT Authentication
- API Key Management
- Author CRUD Operations
- Book CRUD Operations
- PostgreSQL Database
- REST API Design
- Request Validation
- Requestly Collection Support

---

## Tech Stack

- Hono
- PostgreSQL
- TypeScript
- JWT Authentication
- Postman

---

## API Authentication

### Register User

POST `/auth/register`

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Login

POST `/auth/login`

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Successful login returns an access token.

---

## Authorization

Protected endpoints require:

### Bearer Token

```http
Authorization: Bearer <token>
```

### API Key

```http
X-API-KEY: your-api-key
```

---

# API Endpoints

## Authentication

| Method | Endpoint       |
| ------ | -------------- |
| POST   | /auth/register |
| POST   | /auth/login    |

---

## API Keys

### Create API Key

POST `/api-Keys`

```json
{
  "name": "My Production Key"
}
```

### List API Keys

GET `/api-Keys`

### Delete API Key

DELETE `/api-Keys/{id}`

---

## Authors

### Create Author

POST `/authors`

```json
{
  "name": "J. K. Rowling"
}
```

### Get All Authors

GET `/authors`

### Get Author By Id

GET `/authors/{id}`

### Update Author

PUT `/authors/{id}`

```json
{
  "name": "Updated Author",
  "birthday": "1990-01-01T00:00:00.000Z"
}
```

### Delete Author

DELETE `/authors/{id}`

---

## Books

### Create Book

POST `/books`

```json
{
  "title": "Clean Code",
  "description": "A handbook of agile software craftsmanship",
  "publishDate": "2024-01-01",
  "pageCount": 450,
  "authorId": "author-id"
}
```

### Get All Books

GET `/books`

### Get Book By Id

GET `/books/{id}`

### Update Book

PUT `/books/{id}`

```json
{
  "title": "Updated Title",
  "description": "Updated Description",
  "pageCount": 500,
  "authorId": "author-id"
}
```

### Delete Book

DELETE `/books/{id}`

---

## Running Locally

### Clone Repository

```bash
git clone <repository-url>
```

### Install Dependencies

```bash
npm install
```

### Configure Environment

Create a `.env` file:

```env
DB_PASSWORD=123245
DB_USER=postgres
DB_NAME=your-db-name
DB_HOST=localhost
DB_PORT=5432


#JWT

JWT_SECRET=3sdfj4k3sdf2jsdfk4
```

### Run Database Migrations

```bash
npm run migrate
```

### Start Development Server

```bash
npm run dev
```

Server runs at:

```text
http://localhost:3000
```

Example Base URL:

```text
http://localhost:3000
```

### Example Headers

```http
Authorization: Bearer <token>
X-API-KEY: <api-key>
Content-Type: application/json
```

---

## Project Structure

```text
src/
├── data/
├── db/
├── lib/
├── middleware/
├── routes/
└── index.ts
```

---

## License

MIT
