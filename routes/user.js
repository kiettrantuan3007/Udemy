const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../errorClass/catchAsync");
const methodOverride = require('method-override')

const passport = require("passport");
const userController = require("../controller/user")

router.get("/register", userController.renderRegisterForm)
router.post("/register", catchAsync(userController.postCreateUser))
router.get("/login", catchAsync(userController.renderLoginForm))
router.post("/login", passport.authenticate('local', { failureFlash: true, failureRedirect: "/user/login" }), userController.postLogin)
router.get("/logout", userController.getLogout)

module.exports = router