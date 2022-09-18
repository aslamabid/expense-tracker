import express from "express";
import { APP_PORT } from "./config";
import db from "./config/mongoose";
import { errorHandler } from "./middlewares";
import { authRoute, transactionRoute, userRoute } from "./routes";

const app = express();

app.use(express.json());

app.use("/api", authRoute);
app.use("/api", userRoute);
app.use("/api", transactionRoute);

app.use(errorHandler);

app.listen(APP_PORT, () => {
  console.log(`Server is running on port ${APP_PORT}`);
});
