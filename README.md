# Chat App

This is a chat application built with modern web technologies. The client side is developed using Next.js, Zustand, Tailwind CSS, and Next UI, while the server side is powered by NestJS, MongoDB, Mongoose, Socket.IO, and microservices architecture.

## Features

- Real-time messaging
- User authentication
- Responsive design
- Scalable microservices architecture

## Technologies Used

### Client Side

- **Next.js**: A React framework for server-side rendering and static site generation.
- **Zustand**: A small, fast, and scalable state-management solution.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **Next UI**: A beautiful, fast, and modern React UI library.

### Server Side

- **NestJS**: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **MongoDB**: A NoSQL database for storing user data and messages.
- **Mongoose**: An elegant MongoDB object modeling tool for Node.js.
- **Socket.IO**: A library for real-time web applications.
- **Microservices**: A design pattern for developing a single application as a suite of small services.
- **AWS S3 STORAGE**

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/chat-app.git
   cd chat-app
   ```
2. Install dependencies for the client:
   ```bash
   cd client && bun install
   ```
3. Install dependencies for the server:
   ```bash
   cd server && bun install
   ```
4. Create env file in server and client:
   ```bash
    - client
     -> src
     ...
     -> .env
    -server
     -> api-gateway
     -> auth
     -> chat
     -> shared
     -> socket
     -> user
     -> .env
   ```
5. Env Server :
   ```bash
   NAME=name
   PASS=passwordmongo
   DATABASE=database
   SECRET=secretketJWT
   ```

## Running the Application

### Client

```bash
cd client && bun run dev
```

### Server

```bash
cd server && docker compose up -d && docker compose logs -f api_gateway
```
