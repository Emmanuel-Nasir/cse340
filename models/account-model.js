const pool = require("../database/")

async function registerAccount(account_firstname, account_lastname, account_email, account_password){
  try {
    const sql = `INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) 
                 VALUES ($1, $2, $3, $4, 'Client') RETURNING *`
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
  } catch (error) {
    return error.message
  }
}

async function getAccountById(accountId) {
  const sql = `SELECT * FROM account WHERE account_id = $1`
  const result = await pool.query(sql, [accountId])
  return result.rows[0]
}

async function updateAccount(accountId, firstName, lastName, email) {
  const sql = `UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *`
  return await pool.query(sql, [firstName, lastName, email, accountId])
}

async function updatePassword(accountId, hashedPassword) {
  const sql = `UPDATE account SET account_password = $1 WHERE account_id = $2 RETURNING *`
  return await pool.query(sql, [hashedPassword, accountId])
}

module.exports = {
  registerAccount,
  getAccountById,
  updateAccount,
  updatePassword,
}
