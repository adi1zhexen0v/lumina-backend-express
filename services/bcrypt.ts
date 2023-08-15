import { genSalt, hash, compare } from 'bcrypt';
import logger from '../utils/logger.js';

export const hashPassword = async (passwd: string, saltRounds: number = 10) => {
	try {
		const salt = await genSalt(saltRounds);
		return await hash(passwd, salt);
	} catch (error) {
		logger.error(error);
	}
};

export const isValidPassword = async (passwordFromRequest: string, hashedPassword: string) => {
	try {
		return await compare(passwordFromRequest, hashedPassword);
	} catch (error) {
		logger.error(error);
	}
};