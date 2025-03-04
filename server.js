import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { database } from "./configure/index.js";
import authRoute from "./routes/authRoutes.js";
import protectedRoutes from "./routes/protectedRoutes.js";
import { validateUser } from "./controllers/userController.js";

dotenv.config();
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

app.use("/auth", authRoute);
app.use("/", validateUser, protectedRoutes);

database.on("error", console.error.bind(console, "MongoDB connection error:"));

app.listen(
  process.env.PORT,
  console.log(`App running in port ${process.env.PORT}`)
);
