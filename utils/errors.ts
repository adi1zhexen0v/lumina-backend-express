import { Response } from 'express';
import { ValidationError } from 'express-validator';
import { StatusCodes } from 'http-status-codes';

import logger from './logger.js';

const handleError = (res: Response, status: number, message: string | ValidationError[]): Response => {
	if (status >= 500) {
		logger.error(message);
	} else {
		logger.warn(message);
	}
	return res.status(status).json({ error: message });
};

export const InternalServerError = (res: Response, error: Error): Response => {
	return handleError(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
};

export const BadRequestError = (res: Response, message: string | ValidationError[]): Response => {
	return handleError(res, StatusCodes.BAD_REQUEST, message || 'Bad request');
};

export const UnauthorizedError = (res: Response, message: string): Response => {
	return handleError(res, StatusCodes.FORBIDDEN, message || 'Unauthorized');
};

export const UnauthenticatedError = (res: Response, message: string): Response => {
	return handleError(res, StatusCodes.UNAUTHORIZED, message || 'Unauthenticated');
};

export const NotFoundError = (res: Response, message: string): Response => {
	return handleError(res, StatusCodes.NOT_FOUND, message || 'Not found');
};

export const ConflictError = (res: Response, message: string): Response => {
	return handleError(res, StatusCodes.CONFLICT, message || 'Conflict');
};