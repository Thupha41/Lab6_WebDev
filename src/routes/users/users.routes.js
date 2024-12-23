import { Router } from "express";
import {
  loginController,
  registerController,
  logoutController,
} from "../../controllers/users.controllers";
import {
  loginValidator,
  registerValidator,
  tokenValidator,
} from "../../middlewares/users.middlewares";
import { wrapRequestHandler } from "../../utils/handlers";

const userRouter = Router();

/**
 * Description: Login a user
 * Path: /login
 * method: POST
 * Body: {username: string, password: string}
 */

userRouter.post("/login", loginValidator, wrapRequestHandler(loginController));
/**
 * Description: Register a new user
 * Path: /register
 * method: POST
 * Body: {username: string, password: string}
 */
userRouter.post(
  "/register",
  registerValidator,
  wrapRequestHandler(registerController)
);

/**
 * Description: Logout a user
 * Path: /logout
 * method: POST
 * Body: {token: string}
 */
userRouter.post(
  "/logout",
  tokenValidator,
  wrapRequestHandler(logoutController)
);

/**
 * Description: Verify token
 * Path: /verify
 * method: GET
 * Query: {token: string}
 */
userRouter.get("/verify", tokenValidator, (req, res) => {
  res.status(200).json({
    message: "Token is valid",
    decoded: req.decoded,
  });
});
export default userRouter;
