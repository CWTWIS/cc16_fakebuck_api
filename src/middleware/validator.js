const Joi = require("joi");
const registerSchema = Joi.object({
  firstName: Joi.string().required().trim().messages({
    "string.empty": "First name is required",
    "any.required": "First name is required",
  }),
  lastName: Joi.string().required().trim().messages({
    "string.empty": "Last name is required",
    "any.required": "Last name is required",
  }),
  emailOrMobile: Joi.alternatives([
    Joi.string().email({ tlds: false }),
    Joi.string().pattern(/^[0-9]{10}$/),
  ])
    .required()
    .messages({
      "alternatives.match": "Invalid email address or mobile number",
      "any.required": "email address or mobile number is required",
    })
    .strip(),
  password: Joi.string()
    .required()
    .pattern(/^[a-zA-Z0-9]{6,}$/)
    .messages({
      "string.empty": "Password is required",
      "string.pattern.base":
        "Password must be at least 6 characters and contains only alphabet and number",
      "any.required": "password is required",
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "string.empty": "Confirm password is required",
      "any.only": "Password and confirm password are not match",
      "any.required": "Confirm password is required",
    })
    .strip(),
  email: Joi.forbidden().when("emailOrMobile", {
    is: Joi.string().email({ tlds: false }),
    then: Joi.string().default(Joi.ref("emailOrMobile")),
  }),
  mobile: Joi.forbidden().when("emailOrMobile", {
    is: Joi.string().pattern(/^[a-zA-Z0-9]{6,}$/),
    then: Joi.string().default(Joi.ref("emailOrMobile")),
  }),
});

const validateRegister = (req, res, next) => {
  const { value, error } = registerSchema.validate(req.body);
  //   console.log(value);
  if (error) {
    throw error;
  }
  req.body = value;
  next();
};
module.exports = validateRegister;
