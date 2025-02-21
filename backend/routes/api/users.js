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

// Ruta pentru înregistrare
router.post("/register", validation(schemas.register), ctrlWrapper(register));

// Ruta pentru login
router.post("/login", validation(schemas.login), ctrlWrapper(login));

// Obține detalii despre utilizatorul curent
router.get("/current", authenticate, ctrlWrapper(getCurrent));

// Logout utilizator
router.post("/logout", authenticate, ctrlWrapper(logout));

// Actualizează informațiile utilizatorului
router.patch("/updateUserInfo", authenticate, ctrlWrapper(updateUserInfo));

module.exports = router;
