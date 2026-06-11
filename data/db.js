const mysql = require("mysql2")

const connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'mysql_root',
    database: 'pizzeria'
});

connection.connect((err) => {
    if (err) throw err;

    console.log("Connected to MySQL!");
});

module.exports = connection;