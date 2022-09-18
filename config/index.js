import dotenv from "dotenv";
dotenv.config();

export const { APP_PORT, JWT_SECRET, MONGO_URI, DEBUG_MODE } = process.env;
