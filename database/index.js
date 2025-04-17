const { Pool } = require("pg")
require("dotenv").config()

let pool

if (process.env.NODE_ENV === "production") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Required by some cloud providers like Render
    },
  })
} else {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true, // ✅ No SSL for local dev
  })
}

// Export query helper
module.exports = {
  async query(text, params) {
    try {
      const res = await pool.query(text, params)
      console.log("executed query", { text })
      return res
    } catch (error) {
      console.error("error in query", { text })
      throw error
    }
  },
}