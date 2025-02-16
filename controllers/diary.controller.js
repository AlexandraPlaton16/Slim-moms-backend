const { Diary } = require("../models/diary"); // Asigură-te că folosești corect modelul Diary
const { createError, ctrlWrapper } = require("../helpers");

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { date } = req.params;
  // Folosește "Diary" în loc de "Dairy"
  const result = await Diary.findOne({ date, owner });

  if (!result) {
    throw createError(404, "No diary entries found for this date");
  }
  res.json(result);
};

const addDiary = async (req, res) => {
  const { _id: owner } = req.user;
  const { date, product } = req.body;

  const result = await Diary.findOne({ date, owner }); // Folosește "Diary" în loc de "Dairy"
  if (!result) {
    const diary = await Diary.create({
      date,
      owner,
      productList: [product],
      caloriesReceived: product.calories,
    });
    return res.json(diary);
  }

  result.productList.push(product);
  result.caloriesReceived += product.calories;
  await result.save();
  res.json(result);
};

const deleteProduct = async (req, res) => {
  const { _id: owner } = req.user;
  const { date, _id } = req.body;
  const result = await Diary.findOne({ date, owner }); // Folosește "Diary" în loc de "Dairy"

  if (!result) {
    throw createError(404, "Diary entry not found");
  }

  result.productList = result.productList.filter(
    (el) => el._id.toString() !== _id
  );
  result.caloriesReceived = Math.max(
    0,
    result.caloriesReceived - (result.productList.calories || 0)
  );
  await result.save();

  res.json(result);
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  addDiary: ctrlWrapper(addDiary),
  deleteProduct: ctrlWrapper(deleteProduct),
};
