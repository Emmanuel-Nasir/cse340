// controllers/accountController.js

const utilities = require("../utilities/");

/* ****************************************
 * Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
  });
}
async function buildRegister(req, res, next) {
  res.render("account/register", {
    title: "Register",
    notice: null, 
    errors: null, 
    account_firstname:"",
    account_lastname:"",
    account_email: ""
  })
}

module.exports = { buildLogin, buildRegister };