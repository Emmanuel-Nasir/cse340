function checkEmployeeOrAdmin(req, res, next) {
  const accountType = res.locals.accountData?.account_type; // assuming locals are set after token verification

  if (accountType === "Employee" || accountType === "Admin") {
    return next();
  }

  req.flash("notice", "You must be logged in with proper credentials to view this page.");
  return res.status(403).render("account/login", {
    title: "Login",
    errors: null,
  });
}

module.exports = checkEmployeeOrAdmin;