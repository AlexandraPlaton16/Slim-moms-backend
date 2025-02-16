const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  categories: {
    type: [String],
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  title: {
    ru: {
      type: String,
      required: true,
    },
    ua: {
      type: String,
      required: true,
    },
  },
  calories: {
    type: Number,
    required: true,
  },
  userInfo: {
    height: {
      type: Number,
      required: false,
    },
  },
  groupBloodNotAllowed: {
    type: [Number],
    required: true,
  },
});

const Category = mongoose.model("category", categorySchema, "categories");

module.exports = { Category };
