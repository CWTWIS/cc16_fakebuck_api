const express = require("express");

const authController = require("../controllers/auth-controller");

const {
  validateRegister,
  validateLogin,
} = require("../middleware/validator/validate-auth");

const router = express.Router();

router.post("/register", validateRegister, authController.register);
router.post("/login", validateLogin, authController.login);

module.exports = router;
