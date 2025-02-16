const express = require("express");
const { findOne, findAll } = require("../../controllers/categories.controller");
const { ctrlWrapper } = require("../../helpers");

const router = express.Router();

// Route to get a specific category by ID
router.get("/:id", ctrlWrapper(findOne));

// Route to get all categories
router.get("/", ctrlWrapper(findAll));

module.exports = router;
