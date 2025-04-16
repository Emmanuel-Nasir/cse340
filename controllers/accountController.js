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
  let nav=await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav, 
    errors: null,
    message:null 
  })
}

module.exports = { buildLogin, buildRegister };