const express = require("express");
const {
  getAll,
  addDiary,
  deleteProduct,
} = require("../../controllers/diary.controller");

const { ctrlWrapper } = require("../../helpers");
const { authenticate } = require("../../middlewares");

const { validation } = require("../../middlewares");
const { schemas } = require("../../models/diary");

const router = express.Router();

// Middleware to get the full list for creating the table
router.get("/:date", authenticate, ctrlWrapper(getAll));

// Middleware to add a product to the diary
router.post(
  "/add",
  authenticate,
  // validation(schemas.add),
  ctrlWrapper(addDiary),
);

// Middleware to delete a product from the diary
router.delete("/delete", authenticate, ctrlWrapper(deleteProduct));

module.exports = router;
