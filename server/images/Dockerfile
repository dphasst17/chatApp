FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY . .

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app ./
CMD ["npm", "run", "start:dev"]
