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

## Generating types

When you've made changes to the GraphQL schema, you will want to make sure you also create/update the .graphql files in the client/graphql folder.

Once the .graphql files match the typeDefs in the server, you can generate the types by running the following command:

```bash
cd server
npm run generate
```
This will generate a new `generated.ts` file and copy it to the client folder. In there you will find not only the types but also the hooks to use the queries and mutations.

Example:

```ts
const { data, loading, error } = useCurrentUserQuery();
```




