import UserModel, { IUser } from '../models/user.model.js';

export type CreateUserDto = Pick<IUser, 'firstName' | 'lastName' | 'email' | 'password'>;
export type UpdateUserDto = Pick<IUser, 'firstName' | 'lastName' | 'email'>;

class AuthRepository {
	async createUser(data: CreateUserDto) {
		return await new UserModel(data).save();
	}

	async getUserByEmail(email: string) {
		return await UserModel.findOne({ email });
	}

	async getUserById(id: string) {
		return await UserModel.findById(id);
	}

	async updateUser(id: string, data: UpdateUserDto) {
		await UserModel.findByIdAndUpdate(id, data);
	}

	async updateUserPassword(id: string, password: string) {
		await UserModel.findByIdAndUpdate(id, {
			$set: { password }
		});
	}

	async deleteUser(id: string) {
		const deletedUser = await UserModel.findByIdAndDelete(id);
		return deletedUser !== null;
	}
}

export default new AuthRepository();