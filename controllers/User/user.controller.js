import { CustomErrorHandler } from "../../middlewares";
import { User } from "../../models";
import UserWithOutPassword from "../../response/user.without.password";

const userController = {
  async me(req, res, next) {
    try {
      const user = await User.findOne({ _id: req.user._id });

      if (!user) {
        return next(CustomErrorHandler.unAuthorized(401));
      }

      res.status(200).json({
        success: true,
        ...new UserWithOutPassword(user),
      });
    } catch (err) {
      return next(err);
    }
  },
};

export default userController;
