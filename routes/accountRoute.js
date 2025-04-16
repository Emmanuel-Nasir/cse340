const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController.js")
const utilities = require("../utilities")
// const {handleErrors} = require("../middleware/errorHandler")
// Route for /account
router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.get("/register", utilities.handleErrors(accountController.buildRegister))

module.exports = router
