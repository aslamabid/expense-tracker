import Joi from "joi";
import { CustomErrorHandler } from "../../middlewares";
import { User } from "../../models";
import bcrypt from "bcrypt";
import UserWithOutPassword from "../../response/user.without.password";
import JwtService from "../../services/jwt.service";

const authController = {
  async register(req, res, next) {
    const { fullName = "", email = "", mobile = "", password = "" } = req.body;

    const registerSchema = Joi.object({
      fullName: Joi.string().min(8).max(30).required(),
      mobile: Joi.string()
        .length(10)
        .pattern(/^[0-9]+$/)
        .required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(8).max(20),
    });

    const { error } = registerSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    try {
      const emailExist = await User.findOne({ email });
      if (emailExist) {
        return next(
          CustomErrorHandler.alreadyExist(401, "Email already exists")
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        fullName,
        mobile,
        email,
        password: hashedPassword,
      });

      await user.save();

      const access_token = JwtService.sign({
        _id: user._id,
        fullName: user.fullName,
      });

      res.status(201).json({
        success: true,
        ...new UserWithOutPassword(user),
        access_token,
      });
    } catch (err) {
      return next(err);
    }
  },

  async login(req, res, next) {
    const { email = "", password = "" } = req.body;

    const loginSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).max(20),
    });

    const { error } = loginSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return next(CustomErrorHandler.wrongCredentials(401));
      }

      const comparePassword = await bcrypt.compare(password, user.password);

      if (!comparePassword) {
        return next(CustomErrorHandler.wrongCredentials(401));
      }

      const access_token = JwtService.sign({
        _id: user._id,
        fullName: user.fullName,
      });

      res.status(201).json({
        success: true,
        access_token,
        ...new UserWithOutPassword(user),
      });
    } catch (err) {
      return next(err);
    }
  },
};

export default authController;
