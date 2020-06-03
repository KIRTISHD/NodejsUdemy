const mysql = require('mysql2');

//creating connection pool (kind of like multiple connection)
const pool = mysql.createPool({
    host:'localhost',
    user: 'root',
    database: 'node-complete',
    password: 'password'
});

module.exports = pool.promise();