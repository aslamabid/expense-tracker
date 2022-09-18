import mongoose from "mongoose";

const Category = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    maxlength: 15,
    trim: true,
  },
});

export default mongoose.model("Category", Category, "categories");
