import express from "express";
import { transactionController } from "../../controllers";
import { auth } from "../../middlewares";
const transactionRoute = express.Router();

transactionRoute.post("/add", auth, transactionController.addTransaction);
transactionRoute.get(
  "/report/transaction",
  auth,
  transactionController.getReport
);
transactionRoute.get(
  "/transaction",
  auth,
  transactionController.getTransaction
);

export default transactionRoute;
