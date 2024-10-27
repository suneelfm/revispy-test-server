import mongoose from "mongoose";

const account = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  emailId: { type: String, required: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, required: true },
});

export const Account = mongoose.model("Accounts", account);
