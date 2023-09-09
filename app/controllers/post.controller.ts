import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import PostRepository, { TypeCreatePost, TypeUpdatePost } from '../repositories/post.repository.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { InternalServerError, NotFoundError } from '../../utils/errors.js';

class PostController {
	async createPost(req: AuthenticatedRequest, res: Response) {
		try {
			const { caption, tags } = req.body;
			const postData: TypeCreatePost = {
				caption,
				tags,
				media: [],
				userId: new Types.ObjectId(req.userId)
			};

			const post = await PostRepository.createPost(postData);
			res.status(StatusCodes.CREATED).json(post);
		} catch (error) {
			InternalServerError(res, error as Error);
		}
	}

	async updatePost(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const { caption, tags } = req.body;
			const postData: TypeUpdatePost = {
				caption,
				tags
			};

			await PostRepository.updatePost(postData, id);
			res.status(StatusCodes.OK).json({
				message: 'Пост был успешно обновлен'
			});
		} catch (error) {
			InternalServerError(res, error as Error);
		}
	}

	async deletePost(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const isDeleted = await PostRepository.deletePost(id);
			if (!isDeleted) {
				return NotFoundError(res, 'Пользователь не найден');
			}

			res.status(StatusCodes.OK).json({
				message: 'Пост успешно удален'
			});
		} catch (error) {
			InternalServerError(res, error as Error);
		}
	}
}

export default new PostController();
