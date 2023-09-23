import { RequestHandler } from 'express';
import { ValidationChain } from 'express-validator';
import { CustomBodyValidator, createValidatorMiddleware, idValidator } from './general.validator.js';

const caption: ValidationChain = new CustomBodyValidator('caption').string().length(1, 1000).getValidator();
const tags: ValidationChain = new CustomBodyValidator('tags').array().getValidator();

export const createPostValidator: RequestHandler[] = createValidatorMiddleware([caption, tags]);
export const updatePostValidator: RequestHandler[] = createValidatorMiddleware([idValidator, caption, tags]);