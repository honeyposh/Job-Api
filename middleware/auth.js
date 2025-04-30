const { createCustomError } = require("../errors/customApiError");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return next(createCustomError("Invalid Authentication", 400));
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return next(createCustomError("Log in to get access", 401));
  }
  try {
    const decodedtoken = jwt.verify(token, process.env.jwt_secret);
    const user = await User.findById({ _id: decodedtoken.id });
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
module.exports = authMiddleware;
