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
   git clone https://github.com/dphasst17/chatApp.git
   cd chatApp
   ```
2. Install dependencies for the client:
   ```bash
   cd client && bun install
   ```
3. Create env file in server and client:
   ```bash
    - client
     -> src
     ...
     -> .env
    -server
     -> api-gateway
     -> auth
     -> chat
     -> images
     -> user
     -> .env
     -> docker-compose.yml
   ```
4. Env Server :

   ```bash
   NAME=name
   PASS=passwordmongo
   DATABASE=database
   SECRET=secretketJWT
   AWS_ACCESS_KEY_ID=key
   AWS_SECRET_ACCESS_KEY=key
   AWS_REGION=region
   NATS_URL=nats
   PORT=port
   ```

## Running the Application

### Client

```bash
cd client && bun run dev
```

or build and start client with command

```bash
cd client && bun bs
```

### Server

```bash
cd server && docker compose up -d && docker compose logs -f
```
