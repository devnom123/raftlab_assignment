import Joi from 'joi';
import { Types } from 'mongoose';

const objectIdValidator = Joi.string().custom((value, helpers) => {
    if (!Types.ObjectId.isValid(value)) {
      return helpers.error('any.invalid', { message: 'Invalid MongoDB ID format' });
    }
    return value;
  }, 'MongoDB Object ID validation');

export const idSchema = Joi.object({
    id: objectIdValidator.required().messages({
        'any.required': 'ID is required'
    })
});  

export const taskSchema = Joi.object({
  title: Joi.string().min(3).max(255).required().messages({
    'string.base': 'Title must be a string',
    'string.empty': 'Title cannot be empty',
    'string.min': 'Title must be at least 3 characters long',
    'any.required': 'Title is required'
  }),
  description: Joi.string().optional().messages({
    'string.base': 'Description must be a string'
  })
});

export const taskUpdateSchema = Joi.object({
    title: Joi.string().min(3).max(255).optional().messages({
        'string.base': 'Title must be a string',
        'string.empty': 'Title cannot be empty',
        'string.min': 'Title must be at least 3 characters long'
    }),
    description: Joi.string().optional().messages({
        'string.base': 'Description must be a string'
    }),
    completed: Joi.boolean().optional().messages({
        'boolean.base': 'Completed must be a boolean'
    })
});

// User registration validation schema
export const userRegistrationSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    'string.base': 'Username must be a string',
    'string.empty': 'Username cannot be empty',
    'string.min': 'Username must be at least 3 characters long',
    'any.required': 'Username is required'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be valid',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required'
  })
});

// User login validation schema
export const userLoginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be valid',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required'
  })
});
