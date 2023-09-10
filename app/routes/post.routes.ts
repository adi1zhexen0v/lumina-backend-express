import { Router } from 'express';
import AuthMiddleware from '@middlewares/auth.middleware.js';
import PostController from '@controllers/post.controller.js';
import { createPostValidator, updatePostValidator } from '@validators/post.validator.js';
import { checkIdParamValidator } from '@validators/general.validator.js';

const router: Router = Router();

router.route('/create').post(AuthMiddleware, createPostValidator, PostController.createPost);
router
	.route('/:id')
	.patch(AuthMiddleware, updatePostValidator, PostController.updatePost)
	.delete(AuthMiddleware, checkIdParamValidator, PostController.deletePost);

export default router;
