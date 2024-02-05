const catchError = require("../utils/catch-error");
const createError = require("../utils/create-error");
const userService = require("../services/user-service");
const hashService = require("../services/hash-service");
const jwtService = require("../services/jwt-service");

exports.register = catchError(async (req, res, next) => {
  console.log(req.body.email, req.body.mobile);
  const existsUser = await userService.findUserByEmailOrMobile(
    req.body.email || req.body.mobile
  );
  if (existsUser) {
    createError("EMAIL_MOBILE_IN_USE", 400);
    // const error = new Error("email address or mobile number already in use");
    // error.statusCode = 400;
    // throw error;
  }
  req.body.password = await hashService.hash(req.body.password);
  const newUser = await userService.createUser(req.body);
  const payload = { userId: newUser.id };
  const accessToken = jwtService.sign(payload);
  delete newUser.password;
  res.status(201).json({ accessToken, newUser });
});

exports.login = catchError(async (req, res, next) => {
  const existsUser = await userService.findUserByEmailOrMobile(
    req.body.emailOrMobile
  );
  if (!existsUser) {
    createError("invalid credentials", 400);
  }
  const isMatch = await hashService.compare(
    req.body.password,
    existsUser.password
  );
  if (!isMatch) {
    createError("invalid credentials", 400);
  }
  const payload = { userId: existsUser.id };
  const accessToken = jwtService.sign(payload);
  delete existsUser.password;
  res.status(201).json({ accessToken, user: existsUser });
});
exports.getMe = (req, res, next) => {
  res.status(200).json({ user: req.user });
};
