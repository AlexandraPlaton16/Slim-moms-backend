const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const { createError } = require("../helpers");

const { JWT_SECRET } = process.env;

const authenticate = async (req, res, next) => {
  try {
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");
    if (bearer !== "Bearer" || !token) {
      throw createError(401, "Unauthorized");
    }

    try {
      const { id } = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(id);
      if (!user) {
        throw createError(401, "Unauthorized");
      }

      req.user = user;
      next();
    } catch {
      throw createError(401, "Unauthorized");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = authenticate;
