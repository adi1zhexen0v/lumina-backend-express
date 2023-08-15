import { Request, Response } from "express";
import UserRepository from "../repositories/user.repository.js";
import { BadRequestError, ConflictError, InternalServerError, NotFoundError, UnauthenticatedError } from "../../utils/errors.js";
import { hashPassword, isValidPassword } from "../../services/bcrypt.js";
import { createToken } from "../../services/jwt.js";
import { StatusCodes } from "http-status-codes";
import { AuthenticatedRequest } from "../middlewares/auth.middleware.js";

class UserController {
  async register(req: Request, res: Response) {
    try {
      const { firstName, lastName, email, password } = req.body;

      const emailAlreadyExixts = await UserRepository.getUserByEmail(email);
      if (emailAlreadyExixts) {
        return ConflictError(res, 'Данная электронная почта занята');
      }

      const hashedPassword = await hashPassword(password);
      const user = await UserRepository.createUser({firstName, lastName, email, password: hashedPassword!});

      const token = createToken(user._id);

      res.status(StatusCodes.CREATED).json({user, token});
    } catch (error) {
      InternalServerError(res, error as Error)
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await UserRepository.getUserByEmail(email);
      if (!user) {
        return UnauthenticatedError(res, 'Неверный e-mail или пароль');
      }

      const passwordIsValid = await isValidPassword(password, user.password);
      if (!passwordIsValid) {
        return UnauthenticatedError(res, 'Неверный e-mail или пароль');
      }

      const token = createToken(user._id);

      res.status(StatusCodes.OK).json({ user, token });
    } catch (error) {
      InternalServerError(res, error as Error)
    }
  }

  async updateUser(req: AuthenticatedRequest, res: Response) {
    try {
      const { firstName, lastName, email } = req.body;

      await UserRepository.updateUser(req.userId!, { firstName, lastName, email });
      res.status(StatusCodes.OK).json({
        message: 'Данные пользователя успешно обновлены'
      });
    } catch (error) {
      InternalServerError(res, error as Error)
    }
  }

  async changePassword(req: AuthenticatedRequest, res: Response) {
    try {
      const id = req.userId!;
      const { password, newPassword } = req.body;

      const user = await UserRepository.getUserById(id);
  
      const isPasswordValid = await isValidPassword(password, user!.password);
      if (!isPasswordValid) {
        return BadRequestError(res, 'Не получилось обновить пароль');
      }
  
      const newHashedPassword = await hashPassword(newPassword);
      await UserRepository.updateUserPassword(id, newHashedPassword!);

      res.status(StatusCodes.OK).json({
        message: 'Пароль пользователя успешно обновлен'
      });
    } catch (error) {
      InternalServerError(res, error as Error)
    }
  }

  async getMe(req: AuthenticatedRequest, res: Response) {
    try {
      const id = req.userId!;

      const user = await UserRepository.getUserById(id);
      if (!user) {
        return NotFoundError(res, 'Пользователь не найден');
      }

      res.status(StatusCodes.OK).json(user);
    } catch (error) {
      InternalServerError(res, error as Error)
    }
  }

  async deleteUser(req: AuthenticatedRequest, res: Response) {
    try {
      const id = req.userId!;
      const isDeleted = await UserRepository.deleteUser(id);
      if (!isDeleted) {
        return NotFoundError(res, 'Пользователь не найден');
      }

      res.status(StatusCodes.OK).json({
        message: 'Пользователь успешно удален'
      });
    } catch (error) {
      
    }
  }
}

export default new UserController();