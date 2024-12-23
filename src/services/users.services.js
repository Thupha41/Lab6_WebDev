import bcrypt from "bcryptjs";
import db from "../models/index";
import { envConfig } from "../configs/config.env";
import { USERS_MESSAGES } from "../constants/messages";
import { signToken } from "../utils/jwt";
const SALT_ROUNDS = parseInt(envConfig.saltRounds, 10) || 10;

class UserService {
  static createToken = (user_id) => {
    return signToken({
      payload: {
        user_id,
      },
      privateKey: envConfig.jwtSecret,
      options: {
        expiresIn: envConfig.jwtExpiresIn,
      },
    });
  };
  static hashUserPassword = async (userPassword) => {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hash = await bcrypt.hash(userPassword, salt);
    return hash;
  };

  static checkUserExists = async (username) => {
    const user = await db.Users.findOne({
      where: {
        username,
      },
      raw: true,
    });
    return user;
  };

  static checkPassword = (inputPassword, hashPassword) => {
    return bcrypt.compareSync(inputPassword, hashPassword);
  };

  static register = async (rawUserData) => {
    //Step 1: hash user password
    let hashPassword = await this.hashUserPassword(rawUserData.password);

    //Step 2: create new user
    await db.Users.create({
      username: rawUserData.username,
      password: hashPassword,
    });
    return {
      message: USERS_MESSAGES.REGISTER_SUCCESS,
    };
  };

  static login = async (rawUserData) => {
    let user = await this.checkUserExists(rawUserData.username);
    let checkPw = this.checkPassword(rawUserData.password, user.password);
    if (!checkPw) {
      throw new Error(USERS_MESSAGES.USERNAME_OR_PASSWORD_IS_INCORRECT);
    }
    let token = await this.createToken(rawUserData.id);
    await db.Tokens.create({
      token,
      user_id: user.id,
    });
    return {
      token,
    };
  };

  static logout = async (token) => {
    await db.Tokens.destroy({
      where: {
        token,
      },
    });
    return {
      message: USERS_MESSAGES.LOGOUT_SUCCESS,
    };
  };
}

export default UserService;
