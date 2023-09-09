import { RequestHandler } from 'express';
import { ValidationChain } from 'express-validator';
import { CustomBodyValidator, createValidatorMiddleware } from './general.validator.js';
import 'dotenv/config';

const { PASSWORD_PATTERN } = process.env;
const passwordRegExp = new RegExp(PASSWORD_PATTERN!);

const firstName: ValidationChain = new CustomBodyValidator('firstName').string().length(2, 20).getValidator();

const lastName: ValidationChain = new CustomBodyValidator('lastName').string().length(2, 20).getValidator();

const email: ValidationChain = new CustomBodyValidator('email').email().length(2, 40).getValidator();

const password: ValidationChain = new CustomBodyValidator('password')
	.string()
	.length(8, 30)
	.matches(
		passwordRegExp,
		'Пароль должен быть не менее 8 символов и содержать как минимум одну заглавную букву, одну строчную букву, одну цифру и один специальный символ'
	)
	.getValidator();

const newPassword: ValidationChain = new CustomBodyValidator('newPassword')
	.string()
	.length(8, 30)
	.matches(
		passwordRegExp,
		'Пароль должен быть не менее 8 символов и содержать как минимум одну заглавную букву, одну строчную букву, одну цифру и один специальный символ'
	)
	.getValidator();

export const registerValidator: RequestHandler[] = createValidatorMiddleware([firstName, lastName, email, password]);

export const loginValidator: RequestHandler[] = createValidatorMiddleware([email, password]);

export const updateValidator: RequestHandler[] = createValidatorMiddleware([firstName, lastName, email]);

export const changePasswordValidator: RequestHandler[] = createValidatorMiddleware([password, newPassword]);
