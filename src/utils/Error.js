import HTTP_STATUS from "../constants/httpStatus";
import { USERS_MESSAGES } from "../constants/messages";

class ErrorWithStatus {
  constructor({ message, status }) {
    this.message = message;
    this.status = status;
  }
}

class EntityError extends ErrorWithStatus {
  constructor({ message = USERS_MESSAGES.VALIDATION_ERROR, errors }) {
    super({ message, status: HTTP_STATUS.UNPROCESSABLE_ENTITY });
    this.errors = errors;
  }
}

export { ErrorWithStatus, EntityError };
