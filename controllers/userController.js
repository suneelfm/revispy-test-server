import Joi from "joi";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Account } from "../models/accounts.js";
import generateOTP from "../utils/generateOtp.js";
import { mailingOptions } from "../utils/sendOtp.js";

const validationSchema = Joi.object({
  name: Joi.string()
    .regex(/^[a-zA-Z0-9]+[a-zA-Z0-9 _-]+$/)
    .required(),
  emailId: Joi.string()
    .regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/)
    .required(),
  password: Joi.string()
    .regex(/^(?=.*[A-Z])(?=.*[!@#$&*%^-_.,'";:`])(?=.*[0-9])(?=.*[a-z]).{6,}$/)
    .required(),
}).options({ allowUnknown: true });

export const createAccount = async (req, res, next) => {
  try {
    const { error, message } = validationSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res
        .status(400)
        .send({ error: error.details.map((item) => item.message).join(", ") });
    }

    const existedAccount = await Account.findOne({
      emailId: req.body.emailId,
    });

    if (existedAccount) {
      return res
        .status(500)
        .send({ message: "Account is already exist for this email id." });
    }

    const hashed = bcrypt.hashSync(req.body.password, 10);
    const newAccount = new Account({
      ...req.body,
      _id: Math.random().toString(16).slice(2),
      password: hashed,
      isVerified: false,
    });

    await newAccount
      .save()
      .then((data) => {
        const { name, emailId } = data;
        const otp = generateOTP();
        const { transport, mailOptions } = mailingOptions(name, emailId, otp);
        const otpToken = jwt.sign({ otp, emailId }, process.env.JWT_SECRET, {
          expiresIn: "600000s",
        });
        transport
          .sendMail(mailOptions)
          .then(() => {
            res.send({
              emailId,
              otpToken,
              message: "Account has been created successfully.",
            });
          })
          .catch((error) =>
            res.status(500).send({
              message:
                "Account created successfully. Something went wrong while sending otp.",
              error,
            })
          );
      })
      .catch((error) => res.status(500).send({ error }));
  } catch (error) {
    next(error.message);
  }
};

export const signIn = async (req, res, next) => {
  try {
    Account.findOne({ emailId: req.body.emailId }).then((data) => {
      const isValidPsw = bcrypt.compareSync(req.body.password, data?.password);

      if (!data || !isValidPsw) {
        return res
          .status(400)
          .send({ message: "Please enter valid credentials." });
      }

      const payload = {
        name: data?.name,
        emailId: data?.emailId,
      };
      const authToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "12h",
      });
      res.send({
        message: "User signed in successfully.",
        authToken,
      });
    });
  } catch (error) {
    next(error.message);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    jwt.verify(req.body.otpToken, process.env.JWT_SECRET, (error, data) => {
      if (error)
        return res.status(403).send({
          message: "Invalid otp.",
          error,
        });

      if (data.otp === req.body.otp) {
        Account.findOneAndUpdate(
          { emailId: data.emailId },
          { isVerified: true },
          { new: true }
        )
          .then(() =>
            res.send({
              message: `Email ${data.emailId} has been verified successfully.`,
            })
          )
          .catch((error) =>
            res
              .status(500)
              .send({ message: "Something went wrong, try again.", error })
          );
      } else {
        res.status(403).send({
          message: "Invalid otp.",
        });
      }
    });
  } catch (error) {
    next(error.message);
  }
};

export const validateUser = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (
    authHeader === null ||
    authHeader === "undefined" ||
    authHeader === undefined
  )
    return res.status(401).send({ message: "Please login to start" });

  jwt.verify(authHeader, process.env.JWT_SECRET, (error, user) => {
    if (error)
      return res.status(403).send({
        message: "The session has expired, Please login again.",
        error,
      });

    req.user = user;
    next();
  });
};
