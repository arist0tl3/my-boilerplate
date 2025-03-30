# My Boilerplate

## What is the stack?
 - MongoDB
 - Express
 - React
 - Node.js
 - TypeScript
 - GraphQL
 - Apollo Client/Server
 - JWT
 - @mui/joy
 - @emotion/react
 - @emotion/styled
 - @mui/icons-material

## What's included?
 - A basic layout with a sidebar.
 - A login page.
 - A register page.
 - A dashboard page.
 - Authentication with JWT.
 - Refresh tokens.
 - User roles with basic access control.

## How to get started

### Set up MongoDB

```bash
brew install mongodb-community
```

Start MongoDB

```bash
brew services start mongodb-community
```

### Update environment variables

#### Server

```bash
cd server
cp .env.example .env
```

#### Client

```bash
cd client
cp .env.example .env
```


### Run the server

```bash
cd server
npm run dev
```

### Run the client

```bash
cd client
npm run dev
```



