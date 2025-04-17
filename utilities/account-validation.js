const { body, validationResult } = require("express-validator")

const registrationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .notEmpty()
      .withMessage("Please provide a first name."),

    body("account_lastname")
      .trim()
      .notEmpty()
      .withMessage("Please provide a last name."),

    body("account_email")
      .trim()
      .isEmail()
      .withMessage("A valid email is required."),

    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        "Password must be at least 12 characters long and include an uppercase letter, a number, and a special character."
      ),
  ]
}

const loginRules = () => {
  return [
    body("account_email")
      .trim()
      .isEmail()
      .withMessage("A valid email is required."),

    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required."),
  ]
}

const updateAccountRules = () => {
  return [
    body("account_firstname")
      .trim()
      .notEmpty()
      .withMessage("Please provide a first name."),

    body("account_lastname")
      .trim()
      .notEmpty()
      .withMessage("Please provide a last name."),

    body("account_email")
      .trim()
      .isEmail()
      .withMessage("A valid email is required."),
  ]
}

const passwordRules = () => {
  return [
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        "Password must be at least 12 characters long and include an uppercase letter, a number, and a special character."
      ),
  ]
}

const checkRegData = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    req.flash("error", errors.array().map(e => e.msg).join("<br>"))
    return res.redirect("/account/register")
  }
  next()
}

const checkLoginData = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    req.flash("error", errors.array().map(e => e.msg).join("<br>"))
    return res.redirect("/account/login")
  }
  next()
}

const checkUpdateData = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    req.flash("error", errors.array().map(e => e.msg).join("<br>"))
    return res.redirect("/account/update")
  }
  next()
}

const checkPasswordData = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    req.flash("error", errors.array().map(e => e.msg).join("<br>"))
    return res.redirect("/account/update")
  }
  next()
}

module.exports = {
  registrationRules,
  loginRules,
  updateAccountRules,
  passwordRules,
  checkRegData,
  checkLoginData,
  checkUpdateData,
  checkPasswordData,
}
