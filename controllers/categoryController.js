import { Category } from "../models/categories.js";

export const fetchCategories = (req, res, next) => {
  try {
    Category.find()
      .then((data) => {
        res.send({ data, message: "Categories fetched successfully." });
      })
      .catch((error) => {
        res.status(500).send({ message: "Something went wrong." });
      });
  } catch (error) {
    next(error.message);
  }
};

export const saveInterest = (req, res, next) => {
  try {
    Category.findOneAndUpdate(
      { _id: req.body._id },
      { isInterested: req.body.isInterested },
      { new: true }
    )
      .then(() => {
        res.send({ message: "Your interest saved successfully." });
      })
      .catch((error) => {
        res.status(500).send({ message: "Something went wrong.", error });
      });
  } catch (error) {
    next(error.message);
  }
};
