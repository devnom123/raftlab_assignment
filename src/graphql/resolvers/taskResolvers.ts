
import { createTask, getTasks, getTaskById, updateTask, deleteTask, findOneTask } from '../../services/taskService.js';
import { IUser } from '../../models/userModel.js';
import { CustomError, throwError } from '../../utils/errorUtils.js';
import redisClient from '../../config/redis.config.js';
import { idSchema, taskSchema, taskUpdateSchema } from '../../utils/validator.js';

export const taskResolvers = {
  Query: {
    getTasks: async (_: any, __, { user }: { user: IUser }) => {
      try {
        if (!user) {
          throwError('Unauthorized', 401);
        }
        let cachedTasks = await redisClient.get(`tasks:all`);
        if (cachedTasks) {
          console.log('from cache');
          return JSON.parse(cachedTasks);
        }
        else {
          let tasks = await getTasks({ userId: user._id });
          await redisClient.set(`tasks:all`, JSON.stringify(tasks), 'EX', 3600);
          return tasks;
        }
      }
      catch (e) {
        throwError(e.message, e.code || 500)
      }

    },
    getTaskById: async (_: any, { id }: { id: string }, { user }: { user: IUser }) => {
      const { error } = idSchema.validate({ id });
      if (error) {
        throwError(error.message, 400);
      }
      try {
        if (!user) {
          throwError('Unauthorized', 401);
        }
        return await findOneTask({ _id: id, userId: user._id });
      } catch (e) {
        throwError(e.message, e.code || 500)
      }
    },
  },
  Mutation: {
    createTask: async (_: any, { title, description }: { title: string; description: string }, { user }: { user: IUser }) => {
      const { error } = taskSchema.validate({ title, description });
      if (error) {
        throwError(error.message, 400);
      }
      try {
        let completed: boolean = false;
        if (!user) {
          throwError('Unauthorized', 401);
        }
        return await createTask({ title, description, completed: completed, userId: user._id });
      } catch (e) {
        throwError(e.message, e.code || 500)
      }
    },
    updateTask: async (_: any, { id, title, description, completed }:
      { id: string; title?: string; description?: string; completed?: boolean }, { user }: { user: IUser }) => {
      const { error } = taskUpdateSchema.validate({ title, description, completed });
      if (error) {
        throwError(error.message, 400);
      }
      const { error: updateError } = idSchema.validate({ id });
      if (updateError) {
        throwError(updateError.message, 400);
      }
      try {
        if (!user) {
          throwError('Unauthorized', 401);
        }
        let task = await findOneTask({ _id: id, userId: user._id });
        if (!task) {
          throwError('Task not found', 404);
        }
        await redisClient.del('tasks:all');
        return await updateTask(id, { title, description, completed });
      } catch (e) {
        throwError(e.message, e.code || 500)
      }
    },
    deleteTask: async (_: any, { id }: { id: string }, { user }: { user: IUser }) => {
      const { error } = idSchema.validate({ id });
      if (error) {
        throwError(error.message, 400);
      }
      try {
        if (!user) {
          throwError('Unauthorized', 401);
        }
        let task = await findOneTask({ _id: id, userId: user._id });
        if (!task) {
          throwError('Task not found', 404);
        }
        return await deleteTask(id);
      } catch (e) {
        throwError(e.message, e.code || 500)
      }
    },
  },
};
