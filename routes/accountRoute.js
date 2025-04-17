const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")
const utilities = require("../utilities/")
const checkLogin = require("../middleware/checkLogin")


router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.get("/register", utilities.handleErrors(accountController.buildRegister))
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Middleware to protect these routes
router.get("/", checkLogin, utilities.handleErrors(accountController.buildAccountManagement))
router.get("/update", checkLogin, utilities.handleErrors(accountController.buildUpdateAccount))


router.post(
  "/register",
  regValidate.registrationRules(), // ✅ not registationRules
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// ✅ POST route for login (you’re missing this!)
router.post(
  "/login",
  utilities.handleErrors(accountController.accountLogin) // Make sure this exists in your controller
)

router.post(
  "/update",
  checkLogin,
  regValidate.updateAccountRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)

router.post(
  "/update-password",
  checkLogin,
  regValidate.passwordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
)

module.exports = router
