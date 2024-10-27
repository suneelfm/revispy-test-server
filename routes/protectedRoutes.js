import express from "express";
import {
  fetchCategories,
  saveInterest,
} from "../controllers/categoryController.js";
const protectedRoutes = express.Router();

protectedRoutes.get("/category", fetchCategories);
protectedRoutes.put("/category", saveInterest);

export default protectedRoutes;
