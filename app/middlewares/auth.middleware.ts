import { Request, Response, NextFunction } from 'express';

import { verifyToken } from '../../services/jwt.js';
import { UnauthorizedError } from '../../utils/errors.js';

export interface AuthenticatedRequest extends Request {
	userId?: string;
}

export default (req: AuthenticatedRequest, res: Response, next: NextFunction): void | Response => {
	const token: string = (req.headers.authorization || '').replace(/Bearer\s?/, '');

	if (token) {
		try {
			const decodedToken = verifyToken(token);
			req.userId = decodedToken._id;
			next();
		} catch (error) {
			return UnauthorizedError(res, 'Не получилось проверить токен');
		}
	} else {
		return UnauthorizedError(res, 'Нет доступа');
	}
};
