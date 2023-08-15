import { Router } from "express"; 
import UserController from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { changePasswordValidator, loginValidator, registerValidator, updateValidator } from "../validators/user.validator.js";

const router: Router = Router();

router.route('/register').post(registerValidator, UserController.register);
router.route('/login').post(loginValidator, UserController.login);
router.route('/me')
  .get(authMiddleware, UserController.getMe)
  .patch(authMiddleware, updateValidator, UserController.updateUser)
  .delete(authMiddleware, UserController.deleteUser);
router.route('/changepassword')
  .patch(authMiddleware, changePasswordValidator, UserController.changePassword);

export default router;