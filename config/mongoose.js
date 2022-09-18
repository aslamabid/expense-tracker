import mongoose from "mongoose";
import { MONGO_URI } from ".";

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", () => console.log("mongodb error!"));
// Success
db.once("open", () => console.log("mongodb connected!"));

export default db;
