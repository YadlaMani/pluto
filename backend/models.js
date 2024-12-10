import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  privateKey: String,
  publicKey: String,
  transactionSignatures: { type: [String], default: [] },
});
const usermodel = mongoose.model("users", UserSchema);
export default usermodel;
