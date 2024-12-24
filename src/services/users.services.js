import bcrypt from "bcryptjs";
import db from "../models/index";
import { envConfig } from "../configs/config.env";
import { USERS_MESSAGES } from "../constants/messages";
import { signToken } from "../utils/jwt";
const SALT_ROUNDS = parseInt(envConfig.saltRounds, 10) || 10;
import { verifyToken } from "../utils/jwt";

class UserService {
  static createToken = (payload) => {
    return signToken({
      payload,
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

  //get user address
  static getLocatedAddress = async () => {
    try {
      // Use Geoapify IP-based geolocation API from website https://myprojects.geoapify.com/
      const response = await fetch(
        `https://api.geoapify.com/v1/ipinfo?&apiKey=${envConfig.geoAPI}`
      );
      const data = await response.json();
      if (!data) {
        return "Unknown location";
      }
      const decodedCity = Buffer.from(data.city?.name || "", "latin1").toString(
        "utf8"
      );
      const { location, country, ip, continent } = data;
      return {
        city: decodedCity,
        continent: continent?.name,
        country: country?.name_native,
        location,
        ip,
      };
    } catch (error) {
      console.error("Error retrieving address from IP:", error);
      return "Unknown location";
    }
  };

  static register = async (rawUserData) => {
    //Step 1: hash user password
    let hashPassword = await this.hashUserPassword(rawUserData.password);

    //Step 2: create new user
    await db.Users.create({
      username: rawUserData.username,
      password: hashPassword,
      role: rawUserData.role,
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

    const user_address = await this.getLocatedAddress();
    const payload = {
      user_id: user.id,
      login_time: new Date().toISOString(),
      login_address: JSON.stringify(user_address),
      role: user.role,
    };

    let token = await this.createToken(payload);

    // Create token in the database
    await db.Tokens.create({
      token,
      user_id: user.id,
    });

    const decoded = await verifyToken({
      token,
      secretOrPublicKey: envConfig.jwtSecret,
    });

    // Update login time and address for the user
    await db.Users.update(
      {
        loginTime: decoded.login_time,
        loginAddress: decoded.login_address,
      },
      {
        where: { id: user.id },
      }
    );

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
