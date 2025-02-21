const { Category } = require("../models/categories");
const { createError, ctrlWrapper } = require("../helpers");
const { ObjectId } = require("mongoose").Types;

const findOne = async (req, res) => {
  const { id } = req.params;

  console.log(`🔎 Căutăm categoria cu ID: ${id}`);

  // Verificăm dacă id-ul primit este valid
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ObjectId format" });
  }

  const result = await Category.findById(id);

  if (!result) {
    console.log(`⚠️ Categoria cu ID-ul ${id} nu a fost găsită!`);
    throw createError(404, "Category not found");
  }

  console.log(`✅ Categorie găsită: ${JSON.stringify(result)}`);
  res.status(200).json(result);
};

const findAll = async (req, res) => {
  try {
    const result = await Category.find({});
    console.log("📂 Datele returnate din MongoDB:", result);

    if (!result.length) {
      console.log("⚠️ Nu există categorii în baza de date!");
      return res.status(404).json({ message: "Nu există categorii" });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("❌ Eroare la preluarea categoriilor:", error);
    res.status(500).json({ message: "Eroare internă" });
  }
};

module.exports = {
  findOne: ctrlWrapper(findOne),
  findAll: ctrlWrapper(findAll),
};
