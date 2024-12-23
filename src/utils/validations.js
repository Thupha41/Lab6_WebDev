import { validationResult } from "express-validator";
import HTTP_STATUS from "../constants/httpStatus";
import { EntityError, ErrorWithStatus } from "./Error";

const validate = (validation) => {
  return async (req, res, next) => {
    await validation.run(req);
    const errors = validationResult(req);

    // If there are no errors, proceed to the next middleware
    if (errors.isEmpty()) {
      return next();
    }

    const errorsObject = errors.mapped();
    console.log(errorsObject);

    const entityError = new EntityError({ errors: {} });

    for (const key in errorsObject) {
      const { msg } = errorsObject[key];
      // Handle non-validation errors
      if (
        msg instanceof ErrorWithStatus &&
        msg.status !== HTTP_STATUS.UNPROCESSABLE_ENTITY
      ) {
        return next(msg);
      }
      entityError.errors[key] = errorsObject[key];
    }
    console.log(entityError);
    next(entityError);
  };
};

export { validate };
