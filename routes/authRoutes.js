import express from "express";
import {
  createAccount,
  signIn,
  verifyEmail,
} from "../controllers/userController.js";
import { isEmailVerified } from "../controllers/verifyEmail.js";
const authRoute = express.Router();

authRoute.post("/sign-up", createAccount);
authRoute.post("/sign-in", isEmailVerified, signIn);
authRoute.put("/verify", verifyEmail);

export default authRoute;
