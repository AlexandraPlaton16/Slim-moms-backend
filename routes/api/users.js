const express = require("express");
const {
  register,
  login,
  logout,
  getCurrent,
  updateUserInfo,
} = require("../../controllers/auth.controller");

const { ctrlWrapper } = require("../../helpers");
const { validation, authenticate } = require("../../middlewares");
const { schemas } = require("../../models/user");

const router = express.Router();

// User registration
router.post("/register", validation(schemas.register), ctrlWrapper(register));

// User login
router.post("/login", validation(schemas.login), ctrlWrapper(login));

// Get current user details
router.get("/current", authenticate, ctrlWrapper(getCurrent));

// User logout (should be a POST request)
router.post("/logout", authenticate, ctrlWrapper(logout));

// Update user information
router.patch("/updateUserInfo", authenticate, ctrlWrapper(updateUserInfo));

module.exports = router;
