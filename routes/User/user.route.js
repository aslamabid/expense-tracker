import express from "express";
import { userController } from "../../controllers";
import { auth } from "../../middlewares";
const userRoute = express.Router();

userRoute.get("/me", auth, userController.me);

export default userRoute;
