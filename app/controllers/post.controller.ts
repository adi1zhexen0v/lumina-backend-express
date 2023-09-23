import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import { Types } from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import PostRepository, { CreatePostDto, UpdatePostDto } from '../repositories/post.repository.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { InternalServerError, NotFoundError } from '../../utils/errors.js';
import { deleteFileFromAWS, uploadFileToAWS } from '../../services/s3.js';

class PostController {
	async createPost(req: AuthenticatedRequest, res: Response) {
		try {
			const { caption, tags } = req.body;
			
			const postData: CreatePostDto = {
				caption,
				tags,
				userId: new Types.ObjectId(req.userId)
			};

			if (req.files && req.files.media) {
				const files = req.files!.media as UploadedFile[];
				let media: string[] = [];

				if (Array.isArray(files)) {
					for(const file of files) {
						const url = await uploadFileToAWS(file, '/posts');
						media.push(url!);
					}
				} else {
					const url = await uploadFileToAWS(files, '/posts');
					media = [url!];
				}

				postData.media = media;
			}

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
			const postData: UpdatePostDto = {
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
			const post = await PostRepository.getById(id);
			const isDeleted = await PostRepository.deletePost(id);
			if (!isDeleted) {
				return NotFoundError(res, 'Пользователь не найден');
			}

			if (post?.media) {
				for(const fileUrl of post.media!) {
					await deleteFileFromAWS(fileUrl);
				}
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