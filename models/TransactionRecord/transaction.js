import mongoose, { Schema } from "mongoose";

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    index: true,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  notes: {
    type: String,
    required: false,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    index: true,
    required: true,
  },
});

export default mongoose.model("Transaction", transactionSchema, "transactions");
