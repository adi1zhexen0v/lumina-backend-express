import { Request, Response, NextFunction } from 'express';
import { param, body, validationResult, ValidationChain } from 'express-validator';
import { BadRequestError } from '../../utils/errors.js';

type RequestHandler = (req: Request, res: Response, next: NextFunction) => void;

export const createValidatorMiddleware = (array: (ValidationChain | RequestHandler)[]) => {
	return array.concat([
		(req: Request, res: Response, next: NextFunction) => {
			const errors = validationResult(req);
			if (!errors.isEmpty()) return BadRequestError(res, errors.array());
			next();
		}
	]);
};

export class CustomBodyValidator {
	private validator: ValidationChain;
	private fieldName: string;

	constructor(fieldName: string) {
		this.validator = body(fieldName).exists({ checkFalsy: true }).withMessage('Это обязательное поле');
		this.fieldName = fieldName;
	}

	string(): CustomBodyValidator {
		this.validator = this.validator.notEmpty().isString().withMessage('Это значение должно быть строкой');
		return this;
	}

	length(min: number, max: number): CustomBodyValidator {
		this.validator = this.validator.isLength({ min, max }).withMessage(`Длина этого поля должна быть от ${min} до ${max} символов`);
		return this;
	}

	email(): CustomBodyValidator {
		this.validator = this.validator.isEmail().withMessage('Это не корректный адрес электронной почты (включите символ @)');
		return this;
	}

	objectId(): CustomBodyValidator {
		this.validator = this.validator.isMongoId().withMessage('Это значение должно быть ObjectID');
		return this;
	}

	matches(pattern: RegExp, message: string): CustomBodyValidator {
		this.validator = this.validator.matches(pattern).withMessage(message);
		return this;
	}

	array(): CustomBodyValidator {
		this.validator = this.validator.isArray().withMessage('Это значение должно быть массивом');
		return this;
	}

	getValidator(): ValidationChain {
		return this.validator;
	}
}

export class CustomParamValidator {
	private validator: ValidationChain;
	private fieldName: string;

	constructor(fieldName: string) {
		this.validator = param(fieldName).isMongoId().withMessage('Это значение должно быть ObjectID');
		this.fieldName = fieldName;
	}

	getValidator(): ValidationChain {
		return this.validator;
	}
}

export const idValidator = new CustomParamValidator('id').getValidator();
export const checkIdParamValidator = createValidatorMiddleware([idValidator]);
