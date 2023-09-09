import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth.middleware.js';
import AuthController from '../controllers/auth.controller.js';
import { changePasswordValidator, loginValidator, registerValidator, updateValidator } from '../validators/auth.validator.js';

const router: Router = Router();

router.route('/register').post(registerValidator, AuthController.register);
router.route('/login').post(loginValidator, AuthController.login);
router
	.route('/me')
	.get(AuthMiddleware, AuthController.getMe)
	.patch(AuthMiddleware, updateValidator, AuthController.updateUser)
	.delete(AuthMiddleware, AuthController.deleteUser);
router.route('/changepassword').patch(AuthMiddleware, changePasswordValidator, AuthController.changePassword);

export default router;
