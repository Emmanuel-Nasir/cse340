const utilities = require("../utilities/");
const profileModel = require("../models/profileModel");

/* Show profile page */
async function buildProfile(req, res, next) {
  const account_id = res.locals.accountData.account_id;
  const profileData = await profileModel.getProfileByAccountId(account_id);

  const nav = await utilities.getNav();

  res.render("account/profile", {
    title: "Your Profile",
    nav,
    errors: null,
    profile: profileData,
  });
}

/* Handle profile updates */
async function updateProfile(req, res, next) {
  const { first_name, last_name, bio } = req.body;
  const account_id = res.locals.accountData.account_id;

  try {
    const result = await profileModel.updateProfile(account_id, first_name, last_name, bio);
    req.flash("notice", "Profile updated successfully.");
    res.redirect("/account/profile");
  } catch (error) {
    req.flash("error", "Profile update failed.");
    res.redirect("/account/profile");
  }
}

module.exports = {
  buildProfile,
  updateProfile,
};
