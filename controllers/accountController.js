const bcrypt = require("bcryptjs")
const utilities = require("../utilities/")
const accountModel = require("../models/account-model")

// Renders login page
async function buildLogin(req, res) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    // message: req.flash("notice"),
    account_email: "",
  })
}

// Renders registration page
async function buildRegister(req, res) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
    // notice: req.flash("notice"),
    account_firstname: "",
    account_lastname: "",
    account_email: "",
  })
}

// Handles new account registration
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  try {
    const existingAccount = await accountModel.getAccountByEmail(account_email)

    if (existingAccount.rows.length > 0) {
      req.flash("notice", "That email is already in use.")
      return res.status(400).render("account/register", {
        title: "Register",
        nav,
        errors: null,
        notice: req.flash("notice"),
        account_firstname,
        account_lastname,
        account_email,
      })
    }

    const hashedPassword = await bcrypt.hash(account_password, 10)

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )

    if (regResult.rows.length > 0) {
      req.flash("notice", `Registration successful! Please log in.`)
      return res.redirect("/account/login")
    } else {
      req.flash("notice", "Registration failed. Try again.")
      return res.status(500).render("account/register", {
        title: "Register",
        nav,
        errors: null,
        notice: req.flash("notice"),
        account_firstname,
        account_lastname,
        account_email,
      })
    }
  } catch (error) {
    console.error("Registration error:", error)
    req.flash("notice", "An unexpected error occurred.")
    return res.status(500).render("account/register", {
      title: "Register",
      nav,
      errors: null,
      notice: req.flash("notice"),
      account_firstname,
      account_lastname,
      account_email,
    })
  }
}

// Handles login
async function accountLogin(req, res) {
  const { account_email, account_password } = req.body
  let nav = await utilities.getNav()
  const data = await accountModel.getAccountByEmail(account_email)

  if (!data.rows.length) {
    req.flash("notice", "Invalid email or password.")
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      account_email,
      message: req.flash("notice"),
    })
  }

  const account = data.rows[0]
  const match = await bcrypt.compare(account_password, account.account_password)
  if (!match) {
    req.flash("notice", "Invalid email or password.")
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      account_email,
      message: req.flash("notice"),
    })
  }

  delete account.account_password
  req.session.user = account
  req.flash("notice", `Welcome back, ${account.account_firstname}.`)
  return res.redirect("/account")
}

// Account management page
async function buildAccountManagement(req, res) {
  let nav = await utilities.getNav()
  const accountData = res.locals.accountData
  res.render("account/management", {
    title: "Account Management",
    nav,
    accountData,
    message: req.flash("notice")
  })
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccountManagement,
}
