import { Category } from "../models/categories.js";

export const fetchCategories = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) ?? 1;
    const limit = parseInt(req.query.limit) ?? 6;

    const skip = (page - 1) * limit;

    const total = await Category.countDocuments();

    Category.find()
      .skip(skip)
      .limit(limit)
      .exec()
      .then((data) => {
        res.send({
          total,
          page,
          categories: data,
          totalPages: Math.ceil(total / limit),
          message: "Categories fetched successfully.",
        });
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
