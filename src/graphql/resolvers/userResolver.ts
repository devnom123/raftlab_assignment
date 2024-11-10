import { createUser, getUserByEmail } from '../../services/userService.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { IUser } from '../../models/userModel.js';
import { throwError } from '../../utils/errorUtils.js';
import { userLoginSchema, userRegistrationSchema } from '../../utils/validator.js';

export const userResolvers = {
    Query: {
        currentUser: async (_: any, __: any, { user }: { user: IUser }) => {
            return user;
        }
    },
    Mutation: {
        signup: async (_: any, { userInput }: { userInput: { name: string; email: string; password: string } }) => {
            const { error } = userRegistrationSchema.validate(userInput);
            if (error) {
                throwError(error.message, 400);
            }
            try {
                let { name, email, password } = userInput;
                let isUserExist = await getUserByEmail(email);
                if (isUserExist) {
                    throwError('User already exist', 409);
                }
                console.log('password', password);
                password = await bcrypt.hash(password, 10);
                let createdUser = await createUser({ name, email, password });
                console.log('createdUser', createdUser);
                let token = jwt.sign({ userId: createdUser._id }, process.env.JWT_SECRET)
                return { token, user: createdUser };
            } catch (error) {
                console.log(error);
                throwError(error.message, error.code || 500);
            }
        },
        login: async (_: any, { userInput }:{ userInput: {email:string,password:string} }) => {
            const { email, password } = userInput;
            console.log('email', email);
            const { error } = userLoginSchema.validate({ email, password });
            if (error) {
                throwError(error.message, 400);
            }
            try {
                let user = await getUserByEmail(email);
            if (!user) {
                throwError('User not found', 404);
            }
            let isPasswordMatch = await bcrypt.compare(password, user.password);
            if (!isPasswordMatch) {
                throwError('Invalid credentials', 401);
            }
            let token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)
            return { token, user };
            } catch (e) {
                throwError(e.message, e.code || 500);
            }
        }
    },
};