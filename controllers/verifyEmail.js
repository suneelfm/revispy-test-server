import { Account } from "../models/accounts.js";

export const isEmailVerified = async (req, res, next) => {
  const account = await Account.findOne({ emailId: req.body?.emailId });
  if (!account?.isVerified) {
    return res.status(406).send({ message: "Your email has not verified." });
  }
  next();
};
