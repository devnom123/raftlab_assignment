import { ApolloServer } from 'apollo-server-express';
import { taskTypeDefs } from './schema/taskTypeDefs.js';
import { taskResolvers } from './resolvers/taskResolvers.js';
import { userResolvers } from './resolvers/userResolver.js';
import { userTypeDefs } from './schema/userTypeDefs.js';
import jwt from 'jsonwebtoken';

const graphqlServer = new ApolloServer({
  typeDefs: [userTypeDefs, taskTypeDefs],
  resolvers: [userResolvers, taskResolvers],
  context: ({ req }) => {
    const token = req.headers.authorization || '';
    let user = null;

    if (token) {
      try {
        user = jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
        throw new Error('Authentication error');
      }
    }

    return { user };
  },
  formatError: (error) => {
    return {
        message: error.message
    }
  }
});

await graphqlServer.start();

export default graphqlServer;
