const catchError = require("../utils/catch-error");
const userService = require("../services/user-service");
const createError = require("../utils/create-error");
const hashService = require("../services/hash-service");
const jwtService = require("../services/jwt-service");

exports.register = catchError(async (req, res, next) => {
  //   throw new Error("test catch error function");
  const existUser = await userService.findUserByEmailOrMobile(
    req.body.email || req.body.mobile
  );
  if (existUser) {
    createError("email address or mobile number already in use", 400);
    // const error = new Error("email address or mobile number already in use");
    // error.statusCode = 400;
    // throw error;
  }
  req.body.password = await hashService.hash(req.body.password);
  const newUser = await userService.createUser(req.body);
  const payload = { userId: newUser.id };
  const accessToken = jwtService.sign(payload);

  res.status(201).json({ accessToken });
});
