import { checkSchema } from "express-validator";
import { USERS_MESSAGES } from "../constants/messages";
import { validate } from "../utils/validations";
import UserService from "../services/users.services";
import { ErrorWithStatus } from "../utils/Error";
import HTTP_STATUS from "../constants/httpStatus";
import { verifyToken } from "../utils/jwt";
import { JsonWebTokenError } from "jsonwebtoken";
import db from "../models";
import { envConfig } from "../configs/config.env";
import { capitalize } from "lodash";
const usernameSchema = {
  notEmpty: {
    errorMessage: USERS_MESSAGES.NAME_IS_REQUIRED,
  },
  isString: {
    errorMessage: USERS_MESSAGES.NAME_MUST_BE_A_STRING,
  },
  trim: true,

  isLength: {
    options: {
      min: 1,
      max: 100,
    },
    errorMessage: USERS_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_100,
  },
};

const passwordSchema = {
  notEmpty: {
    errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED,
  },
  isString: {
    errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_A_STRING,
  },
  isLength: {
    options: {
      min: 8,
      max: 50,
    },
    errorMessage: USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_8_TO_50,
  },
  isStrongPassword: {
    options: {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRONG,
  },
};

export const loginValidator = validate(
  checkSchema(
    {
      username: {
        ...usernameSchema,
        custom: {
          options: async (value, { req }) => {
            const user = await UserService.checkUserExists(value);
            if (user === null) {
              throw new Error(USERS_MESSAGES.USERNAME_OR_PASSWORD_IS_INCORRECT);
            }
          },
        },
      },
      password: passwordSchema,
    },
    ["body"]
  )
);

export const registerValidator = validate(
  checkSchema(
    {
      username: {
        ...usernameSchema,
        custom: {
          options: async (value) => {
            const user = await UserService.checkUserExists(value);
            if (user?.username === value) {
              throw new Error(USERS_MESSAGES.USERNAME_ALREADY_EXISTS);
            }
            return true;
          },
        },
      },
      password: passwordSchema,
    },
    ["body"]
  )
);

export const tokenValidator = validate(
  checkSchema(
    {
      token: {
        trim: true,
        custom: {
          options: async (value, { req }) => {
            value = value || req.body.token || req.query.token;
            if (!value) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.TOKEN_IS_REQUIRED,
                status: HTTP_STATUS.UNAUTHORIZED,
              });
            }
            try {
              const [decoded, token] = await Promise.all([
                verifyToken({
                  token: value,
                  secretOrPublicKey: envConfig.jwtSecret,
                }),
                db.Tokens.findOne({ where: { token: value } }),
              ]);
              if (token === null) {
                throw new ErrorWithStatus({
                  message: USERS_MESSAGES.USED_TOKEN_OR_NOT_EXIST,
                  status: HTTP_STATUS.UNAUTHORIZED,
                });
              }
              req.decoded = decoded;
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  message: capitalize(error.message),
                  status: HTTP_STATUS.UNAUTHORIZED,
                });
              }
              throw error;
            }
            return true;
          },
        },
      },
    },
    ["body" || "query"]
  )
);

export const roleValidator = validate(
  checkSchema(
    {
      Authorization: {
        custom: {
          options: async (value, { req }) => {
            const token = (value || "").split(" ")[1];
            console.log(token);
            if (!token) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.TOKEN_IS_REQUIRED,
                status: HTTP_STATUS.UNAUTHORIZED,
              });
            }

            try {
              const decoded = await verifyToken({
                token: token,
                secretOrPublicKey: envConfig.jwtSecret,
              });

              if (decoded.role !== "admin") {
                throw new ErrorWithStatus({
                  message: USERS_MESSAGES.ACCESS_DENIED_ROLE_ADMIN,
                  status: HTTP_STATUS.UNAUTHORIZED,
                });
              }
              req.user = decoded;
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  message: capitalize(error.message),
                  status: HTTP_STATUS.UNAUTHORIZED,
                });
              }
              throw error;
            }
          },
        },
      },
    },
    ["headers"]
  )
);
