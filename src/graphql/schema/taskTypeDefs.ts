import { gql } from 'apollo-server-express';

export const taskTypeDefs = gql`
  type Task {
    _id: ID!
    title: String!
    description: String!
    completed: Boolean!
    createdAt: String
    updatedAt: String
    userId: ID
  }

  type Query {
    getTasks: [Task]
    getTaskById(id: ID!): Task
  }

  type Mutation {
    createTask(title: String!, description: String!): Task
    updateTask(id: ID!, title: String, description: String, completed: Boolean): Task
    deleteTask(id: ID!): Task
  }
`;
