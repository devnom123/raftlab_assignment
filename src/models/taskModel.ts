import mongoose from 'mongoose';
import { Schema, Document } from 'mongoose';

export interface ITask {
    _id?: string;
    title: string;
    description: string;
    completed: boolean;
    userId?: string;
    createdAt?: Date;
    updatedAt?: Date;
    __v?: number;
  }

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

const Task = mongoose.model<ITask>('Task', taskSchema);
export default Task;
