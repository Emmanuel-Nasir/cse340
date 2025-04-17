const bcrypt = require("bcryptjs");
const utilities = require("../utilities/");
const accountModel = require("../models/account-model");

// Renders login page
async function buildLogin(req, res) {
    let nav = await utilities.getNav();
    res.render("account/login", {
        title: "Login",
        nav,
        account_email: "",
        messages: req.flash("notice"),
    });
}

// Renders registration page
async function buildRegister(req, res) {
    let nav = await utilities.getNav();
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
        account_firstname: "",
        account_lastname: "",
        account_email: "",
        messages: req.flash("notice"),
    });
}

// Handles new account registration
async function registerAccount(req, res) {
    let nav = await utilities.getNav();
    const { firstname, lastname, email, password } = req.body;

    try {
        // Input validation
        if (!firstname || !lastname || !email || !password) {
            req.flash("notice", "All fields are required.");
            return res.status(400).render("account/register", {
                title: "Register",
                nav,
                errors: null,
                firstname,
                lastname,
                email,
                messages: req.flash("notice"),
            });
        }

        if (!/^\S+@\S+\.\S+$/.test(email)) {
            req.flash("notice", "Invalid email format.");
            return res.status(400).render("account/register", {
                title: "Register",
                nav,
                errors: null,
                firstname,
                lastname,
                email,
                messages: req.flash("notice"),
            });
        }

        if (password.length < 12 || !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{12,}$/.test(password)) {
            req.flash("notice", "Password must be at least 12 characters with numbers, uppercase, lowercase, and symbols.");
            return res.status(400).render("account/register", {
                title: "Register",
                nav,
                errors: null,
                firstname,
                lastname,
                email,
                messages: req.flash("notice"),
            });
        }

        // Check for existing account
        const existingAccount = await accountModel.getAccountByEmail(email);
        if (existingAccount) {
            req.flash("notice", "That email is already registered.");
            return res.status(400).render("account/register", {
                title: "Register",
                nav,
                errors: null,
                firstname,
                lastname,
                email,
                messages: req.flash("notice"),
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Register new account
        const regResult = await accountModel.registerAccount(firstname, lastname, email, hashedPassword);
        if (!regResult) {
            req.flash("notice", "Registration failed. Please try again.");
            return res.status(500).render("account/register", {
                title: "Register",
                nav,
                errors: null,
                firstname,
                lastname,
                email,
                messages: req.flash("notice"),
            });
        }

        // Store user session after successful registration
        req.session.user = regResult;

        // Redirect to welcome page
        req.flash("notice", `Welcome, ${firstname}!`);
        return res.redirect("/welcome");
        
    } catch (error) {
        console.error("Registration error:", error.message);
        req.flash("notice", "An unexpected error occurred.");
        return res.status(500).render("account/register", {
            title: "Register",
            nav,
            errors: null,
            firstname,
            lastname,
            email,
            messages: req.flash("notice"),
        });
    }
}

// Handles login
async function accountLogin(req, res) {
    const { email, password } = req.body;
    let nav = await utilities.getNav();

    try {
        console.log("Attempting login for:", email);
        const account = await accountModel.getAccountByEmail(email);

        if (!account) {
            req.flash("notice", "No account found.");
            return res.status(400).render("account/login", {
                title: "Login",
                nav,
                email,
                messages: { error: req.flash("notice") },
            });
        }

        const match = await bcrypt.compare(password, account.account_password);
        if (!match) {
            req.flash("notice", "Incorrect password.");
            return res.status(400).render("account/login", {
                title: "Login",
                nav,
                email,
                messages: { error: req.flash("notice") },
            });
        }

        delete account.account_password;
        req.session.user = account;
        req.flash("notice", `Welcome back, ${account.account_firstname}!`);
        return res.redirect("/account");
    } catch (error) {
        console.error("Login error:", error.message);
        req.flash("notice", "An unexpected error occurred.");
        return res.status(500).render("account/login", {
            title: "Login",
            nav,
            email,
            messages: { error: req.flash("notice") },
        });
    }
}

// Account management page
async function buildAccountManagement(req, res) {
    let nav = await utilities.getNav();
    const accountData = req.session.user || null;
    res.render("account/management", {
        title: "Account Management",
        nav,
        accountData,
        messages: req.flash("notice"),
    });
}

// Welcome page after registration
async function buildWelcomePage(req, res) {
    let nav = await utilities.getNav();
    if (!req.session.user) {
        req.flash("notice", "You must be logged in to view this page.");
        return res.redirect("/account/login");
    }
    res.render("account/welcome", {
        title: "Welcome!",
        nav,
        user: req.session.user,
        messages: req.flash("notice"),
    });
}

module.exports = {
    buildLogin,
    buildRegister,
    registerAccount,
    accountLogin,
    buildAccountManagement,
    buildWelcomePage,
};