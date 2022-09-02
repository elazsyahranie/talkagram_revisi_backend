const sqlite3 = require('sqlite3').verbose();
const dbFile = __dirname + "../../../db/talkagram.db";

const connection = new sqlite3.Database(dbFile, sqlite3.OPEN_READWRITE, (err) => {
    if(err) throw err;
    console.log("You're now connected")
});

// const mysql = require('mysql2')
// require('dotenv').config()

// const connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME,
//   timezone: process.env.DB_TIMEZONE
// })

// connection.connect((error) => {
//   if (error) throw error
//   console.log("You're now Connected...")
// })

module.exports = connection
