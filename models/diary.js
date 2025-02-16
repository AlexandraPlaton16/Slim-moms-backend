const { Schema, model } = require("mongoose");
const Joi = require("joi");

const diarySchema = new Schema(
  {
    date: {
      type: String,
      required: [true, "Date is required"],
    },
    productList: [
      {
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
      },
    ],
    caloriesReceived: {
      type: Number,
      default: 0,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { versionKey: false, timestamps: true },
);

const add = Joi.object({
  date: Joi.string().required(),
  productList: Joi.array().items(
    Joi.object({
      weight: Joi.number().required(),
      title: Joi.object({
        ru: Joi.string().required(),
        ua: Joi.string().required(),
      }),
      calories: Joi.number().required(),
    }),
  ),
  caloriesReceived: Joi.number().default(0),
});

const schemas = {
  add,
};

const Diary = model("diary", diarySchema); // Corectat numele modelului

module.exports = {
  Diary,
  schemas,
};
