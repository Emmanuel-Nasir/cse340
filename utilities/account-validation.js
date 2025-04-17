const { body, validationResult } = require("express-validator");

// Registration validation rules
const registrationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),
    body("account_lastname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a last name."),
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
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
      .withMessage("Password must be at least 12 characters and include at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol."),
  ];
};

// Middleware to handle registration validation results
const checkRegData = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = ""; // replace this with actual nav if needed
    res.render("account/register", {
      title: "Registration",
      nav,
      errors: errors.array(),
      account_firstname: req.body.account_firstname,
      account_lastname: req.body.account_lastname,
      account_email: req.body.account_email,
    });
    return;
  }
  next();
};

// Update account validation rules
const updateAccountRules = () => {
  return [
    body("account_firstname")
      .trim()
      .notEmpty()
      .withMessage("First name is required."),
    body("account_lastname")
      .trim()
      .notEmpty()
      .withMessage("Last name is required."),
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),
  ];
};

// Middleware to handle update validation results
const checkUpdateData = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = ""; // replace with nav if needed
    res.render("account/update", {
      title: "Update Account",
      nav,
      errors: errors.array(),
      accountData: req.body,
    });
    return;
  }
  next();
};

// Password update validation
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
      .withMessage("Password must be at least 12 characters and include at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol."),
  ];
};

// Middleware to handle password validation results
const checkPasswordData = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = ""; // replace with nav if needed
    res.render("account/update", {
      title: "Update Password",
      nav,
      errors: errors.array(),
      accountData: req.body,
    });
    return;
  }
  next();
};

module.exports = {
  registrationRules,
  checkRegData,
  updateAccountRules,
  checkUpdateData,
  passwordRules,
  checkPasswordData,
};
