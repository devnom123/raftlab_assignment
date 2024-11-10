import Task, { ITask } from '../models/taskModel.js';

export const createTask = async (taskData: ITask) => {
  const task = new Task(taskData);
  return await task.save();
};

export const getTasks = async (query: Partial<ITask>) => {
  return await Task.find(query);
};

export const getTaskById = async (id: string) => {
  return await Task.findById(id);
};

export const findOneTask = async (query: Partial<ITask>) => {
    return await Task.findOne(query);
}

export const updateTask = async (id: string, updateData: Partial<ITask>) => {
  return await Task.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteTask = async (id: string) => {
  return await Task.findByIdAndDelete(id);
};
