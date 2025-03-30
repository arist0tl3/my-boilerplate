import { gql } from 'graphql-tag';

const typeDefs = gql`
  input LoginInput {
    email: String!
    password: String!
  }

  input RegisterInput {
    email: String!
    password: String!
    name: String!
  }

  type LoginResponse {
    success: Boolean!
    token: String
    error: String
  }

  type RegisterResponse {
    success: Boolean!
    token: String
    error: String
  }

  type LogoutResponse {
    success: Boolean!
    error: String
  }

  type CurrentUser {
    _id: String!
    createdAt: DateTime
    email: String
  }

  extend type Mutation {
    login(input: LoginInput!): LoginResponse!
    register(input: RegisterInput!): RegisterResponse!
    logout: LogoutResponse!
  }

  extend type Query {
    currentUser: CurrentUser
  }
`;

export default typeDefs;
