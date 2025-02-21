const { Category } = require("../models/categories");

const findProductsByBlood = async (bloodType) => {
  // Find categories where the blood type is not allowed
  const findProducts = await Category.find({
    [`groupBloodNotAllowed.${bloodType}`]: true,
  });

  // Extract unique product categories
  const productsCategories = [
    ...new Set(findProducts.map((product) => product.categories[0])),
  ];

  return productsCategories;
};

module.exports = {
  findProductsByBlood,
};
