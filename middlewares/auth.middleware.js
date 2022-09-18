import JwtService from "../services/jwt.service";
import { CustomErrorHandler } from "./index";

const auth = (req, res, next) => {
  const headerToken = req.headers.authorization;

  if (!headerToken) {
    return next(CustomErrorHandler.unAuthorized(401));
  }

  const token = headerToken.split(" ")[1];

  try {
    const { _id, fullName } = JwtService.verify(token);

    const user = {
      _id,
      fullName,
    };

    req.user = user;
    next();
  } catch (err) {
    return next(err);
  }
};

export default auth;
