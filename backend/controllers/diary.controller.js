const mongoose = require("mongoose");
const { Diary } = require("../models/diary");
const { createError, ctrlWrapper } = require("../helpers");

const getAll = async (req, res) => {
  const { userId, date } = req.query;
  if (!userId || !date) {
    throw createError(400, "Missing userId or date");
  }

  const entries = await Diary.find({ owner: userId, date });
  console.log("📤 Entries found:", entries);

  // Dezactivează caching-ul
  res.set("Cache-Control", "no-store");
  res.json(entries);
};

const addDiary = async (req, res, next) => {
  const { _id: owner } = req.user;
  const { date, product } = req.body;

  if (!date || !product) {
    return next(createError(400, "Missing required fields"));
  }

  try {
    let diary = await Diary.findOne({ date, owner });

    if (!diary) {
      diary = await Diary.create({
        date,
        owner,
        productList: [product],
        caloriesReceived: product.calories || 0, // Verifică dacă există caloriile
      });
    } else {
      diary.productList.push(product);
      diary.caloriesReceived += product.calories || 0; // Verifică dacă există caloriile
      await diary.save();
    }

    res.json(diary);
  } catch (error) {
    console.error("❌ Error adding diary:", error);
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  const { _id: owner } = req.user;
  const { date, _id } = req.body;

  if (!date || !_id) {
    return next(createError(400, "Missing required fields"));
  }

  try {
    const diary = await Diary.findOne({ date, owner });

    if (!diary) {
      return next(createError(404, "Diary entry not found"));
    }

    diary.productList = diary.productList.filter(
      (product) => product._id.toString() !== _id
    );

    diary.caloriesReceived = diary.productList.reduce(
      (sum, product) => sum + (product.calories || 0),
      0
    );

    await diary.save();

    res.json(diary);
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    next(error);
  }
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  addDiary: ctrlWrapper(addDiary),
  deleteProduct: ctrlWrapper(deleteProduct),
};
