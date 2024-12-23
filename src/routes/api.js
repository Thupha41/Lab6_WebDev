import { Router } from "express";
import usersRouter from "./users/users.routes";
const router = Router();

const initApiRoute = (app) => {
  //users
  router.use("/users", usersRouter);
  //api router
  return app.use("/api", router);
};
export default initApiRoute;
