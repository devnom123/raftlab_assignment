import { taskTypeDefs } from './schema/taskTypeDefs.js';
import { taskResolvers } from './resolvers/taskResolvers.js';
import { userResolvers } from './resolvers/userResolver.js';
import { userTypeDefs } from './schema/userTypeDefs.js';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';

const typeDefs = mergeTypeDefs([userTypeDefs, taskTypeDefs]);
const resolvers = mergeResolvers([userResolvers, taskResolvers]);

export {
    typeDefs,
    resolvers
}
