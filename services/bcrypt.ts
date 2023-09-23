import { genSalt, hash, compare } from 'bcrypt';

export const hashPassword = async (passwd: string, saltRounds: number = 10) => {
	const salt = await genSalt(saltRounds);
	return await hash(passwd, salt);
};

export const isValidPassword = async (passwordFromRequest: string, hashedPassword: string) => {
	return await compare(passwordFromRequest, hashedPassword);
};