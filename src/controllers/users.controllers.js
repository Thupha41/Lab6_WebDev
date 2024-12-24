import usersService from "../services/users.services";
import { USERS_MESSAGES } from "../constants/messages";

export const loginController = async (req, res) => {
  const result = await usersService.login(req.body);
  res.json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    result,
  });
  return;
};

export const registerController = async (req, res) => {
  const result = await usersService.register(req.body);
  res.json({
    result,
  });
  return;
};

export const logoutController = async (req, res) => {
  const { token } = req.body;
  const result = await usersService.logout(token);
  res.json(result);
  return;
};
