const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

/* ===============================
 * Deliver Registration View
 * =============================== */
async function buildRegister(req, res) {
  try {
    const nav = await utilities.getNav();
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
      messages: req.flash("error") || [],
      firstname: "",
      lastname: "",
      email: "",
    });
  } catch (err) {
    console.error("Error loading register view:", err);
    res.status(500).send("Server Error");
  }
}

/* ===============================
 * Process Registration
 * =============================== */
async function registerAccount(req, res) {
  const { firstname, lastname, email, password } = req.body;
  const errors = validationResult(req);

  const nav = await utilities.getNav();

  if (!errors.isEmpty()) {
    return res.status(400).render("account/register", {
      title: "Register",
      nav,
      messages: req.flash("error"),
      errors: errors.array(),
      firstname,
      lastname,
      email,
    });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Register the account
    const regResult = await accountModel.registerAccount(
      firstname,
      lastname,
      email,
      hashedPassword
    );

    if (regResult) {
      req.flash("notice", "Registration successful. Please log in.");
      res.redirect("/account/login");
    } else {
      req.flash("error", "Sorry, registration failed. Please try again.");
      res.status(500).render("account/register", {
        title: "Register",
        nav,
        messages: req.flash("error"),
        errors: [],
        firstname,
        lastname,
        email,
      });
    }
  } catch (error) {
    console.error("Registration error:", error);
    req.flash("error", "An error occurred. Please try again.");
    res.status(500).render("account/register", {
      title: "Register",
      nav,
      messages: req.flash("error"),
      errors: [],
      firstname,
      lastname,
      email,
    });
  }
}

/* ===============================
 * Deliver Login View
 * =============================== */
async function buildLogin(req, res) {
  try {
    const nav = await utilities.getNav();
    res.render("account/login", {
      title: "Login",
      nav,
      messages: req.flash("error") || [],
      email: "",
    });
  } catch (err) {
    console.error("Error loading login view:", err);
    res.status(500).send("Server Error");
  }
}

module.exports = {
  buildRegister,
  registerAccount,
  buildLogin,
};
