const pool = require('../database'); // Ensure correct path to database module

// Function to register a new account
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
    try {
        const sql = `
            INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) 
            VALUES ($1, $2, $3, $4, 'Client') RETURNING *`;
        const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_password]);

        if (result.rows.length === 0) throw new Error("Account registration failed.");
        return result.rows[0];
    } catch (error) {
        console.error("Error registering account:", error.message);
        throw new Error("Database error: " + error.message);
    }
}

// Function to retrieve an account by email
// models/accountModel.js


async function getAccountByEmail(email) {
  try {
    const result = await pool.query(
      'SELECT * FROM account WHERE account_email = $1',
      [email]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error('Database error: ' + error);
  }
}



// Function to retrieve an account by ID
async function getAccountById(account_id) {
    try {
        const sql = `SELECT * FROM account WHERE account_id = $1`;
        const result = await pool.query(sql, [account_id]);

        if (result.rows.length === 0) throw new Error("No account found with the provided ID.");
        return result.rows[0];
    } catch (error) {
        console.error("Error fetching account by ID:", error.message);
        throw new Error("Database error: " + error.message);
    }
}

// Function to update account details
async function updateAccount(account_id, account_firstname, account_lastname, account_email) {
    try {
        const sql = `
            UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 
            WHERE account_id = $4 RETURNING *`;
        const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_id]);

        if (result.rowCount === 0) throw new Error("Account update failed.");
        return result.rows[0];
    } catch (error) {
        console.error("Error updating account:", error.message);
        throw new Error("Database error: " + error.message);
    }
}

// Function to update account password
async function updatePassword(account_id, hashed_password) {
    try {
        const sql = `
            UPDATE account SET account_password = $1 WHERE account_id = $2 RETURNING *`;
        const result = await pool.query(sql, [hashed_password, account_id]);

        if (result.rowCount === 0) throw new Error("Password update failed.");
        return result.rows[0];
    } catch (error) {
        console.error("Error updating password:", error.message);
        throw new Error("Database error: " + error.message);
    }
}

// Test database connection
async function testDatabaseConnection() {
    try {
        const result = await pool.query("SELECT 1");
        console.log("Database connection successful:", result.rows);
    } catch (error) {
        console.error("Database connection failed:", error.message);
    }
}

// Execute test function
testDatabaseConnection();

module.exports = {
    registerAccount,
    getAccountByEmail,
    getAccountById,
    updateAccount,
    updatePassword,
};