// models/profileModel.js
const pool = require("../database/");

async function getProfileByAccountId(accountId) {
  try {
    const result = await pool.query(
      "SELECT * FROM user_profiles WHERE account_id = $1",
      [accountId]
    );
    return result.rows[0];
  } catch (error) {
    console.error("getProfileByAccountId error", error);
  }
}

async function updateProfile(accountId, bio, location) {
  try {
    const result = await pool.query(
      `UPDATE user_profiles
       SET bio = $1, location = $2
       WHERE account_id = $3`,
      [bio, location, accountId]
    );
    return result.rowCount > 0;
  } catch (error) {
    console.error("updateProfile error", error);
  }
}

module.exports = { getProfileByAccountId, updateProfile };
