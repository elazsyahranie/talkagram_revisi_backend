const sqlite3 = require('sqlite3')
const sqlite3Trans  = require('sqlite3-trans');
// TransactionDatabase = require("sqlite3-transactions").TransactionDatabase;
const dbFile = __dirname + "../../../db/talkagram.db";

const connection = sqlite3Trans.wrap(new sqlite3.Database(dbFile, sqlite3.OPEN_READWRITE, (err) => {
        if(err) throw err;
        console.log("You're now connected")
    }));
// const connection = new sqlite3.Database(dbFile, sqlite3.OPEN_READWRITE, (err) => {
//         if(err) throw err;
//         console.log("You're now connected")
//     })

// const connection = new TransactionDatabase(
//     new sqlite3.Database(dbFile, sqlite3.OPEN_READWRITE, (err) => {
//         if(err) throw err;
//         console.log("You're now connected")
//     })
// );

module.exports = connection
