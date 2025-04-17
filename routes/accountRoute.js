const express = require("express")
const router = new express.Router()

const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation") 
const utilities = require("../utilities")
const checkLogin = require("../middleware/checkLogin")

// ===== PUBLIC ROUTES =====

// GET login page
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// GET registration page
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// POST registration form
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// POST login form
router.post(
  "/login",
  utilities.handleErrors(accountController.accountLogin)
)


// ===== PROTECTED ROUTES (Requires Login) =====

// GET account management dashboard
router.get(
  "/",
  checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
)

// GET account update page
router.get(
  "/update",
  checkLogin,
  utilities.handleErrors(accountController.buildUpdateAccount)
)

// POST update account info (name, email)
router.post(
  "/update",
  checkLogin,
  regValidate.updateAccountRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)

// POST update password
router.post(
  "/update-password",
  checkLogin,
  regValidate.passwordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
)

module.exports = router
