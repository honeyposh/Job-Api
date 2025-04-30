const asyncWrapper = require("../middleware/ayncWrapper");
const { createCustomError } = require("../errors/customApiError");
const bcyrpt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
exports.register = asyncWrapper(async (req, res, next) => {
  const { name, email, password } = req.body;
  const emailExist = await User.findOne({ email });
  if (emailExist) {
    return next(createCustomError("Email already exist", 409));
  }
  if (!name || !email || !password) {
    return next(createCustomError("email,password,name are required", 400));
  }
  const hashPassword = await bcyrpt.hash(password, 10);
  const user = await User.create({
    email: email,
    password: hashPassword,
    name: name,
  });
  res.status(201).json({ msg: "user created succesfully", user });
});
exports.login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(
      createCustomError("Please provide a valid email and password", 400)
    );
  }
  const user = await User.findOne({ email });
  if (!user) {
    return next(createCustomError("Email doesnt exist", 400));
  }
  const passwordMatch = await bcyrpt.compare(password, user.password);
  if (!passwordMatch) {
    return next(
      createCustomError("Wrong Password, please provide a valid password", 401)
    );
  }
  const token = jwt.sign(
    { id: user._id, name: user.name },
    process.env.jwt_secret,
    { expiresIn: "1h" }
  );
  res.status(200).json({ token });
});
