class CustomErrorHandler extends Error {
  constructor(statusCode, msg) {
    super();
    this.statusCode = statusCode;
    this.message = msg;
  }

  static alreadyExist(statusCode, msg) {
    return new CustomErrorHandler(statusCode, msg);
  }

  static wrongCredentials(statusCode, msg = "email and password invalid") {
    return new CustomErrorHandler(statusCode, msg);
  }

  static unAuthorized(statusCode, msg = "unAuthorized") {
    return new CustomErrorHandler(statusCode, msg);
  }

  static notFound(statusCode, msg = "404 Not Found") {
    return new CustomErrorHandler(statusCode, msg);
  }
}

export default CustomErrorHandler;
