import { gql } from 'apollo-server-express';

const userTypeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input SignupInput {
    name: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type Query {
    currentUser: User
  }

  type Mutation {
    signup(userInput: SignupInput!): AuthPayload
    login(userInput: LoginInput!): AuthPayload
  }
`;

export {
  userTypeDefs
};
