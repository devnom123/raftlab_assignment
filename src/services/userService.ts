import User, {IUser} from "../models/userModel.js";

export const createUser = async (userData: IUser) => {
    const user = new User(userData);
    return await user.save();
};

export const getUsers = async () => {
    return await User.find();
};

export const getUserByIdr = async (id: string):Promise<IUser> => {
    return await User.findById(id)
}

export const updateUser = async (id: string, updateData: Partial<IUser>) => {
    return await User.findByIdAndUpdate(id, updateData, {new: true});
}

export const deleteUser = async (id: string) => {
    return await User.findByIdAndDelete(id);
}

export const getUserByEmail = async (email: string) => {
    return await User.findOne({email});
}