const mysql = require('mysql');

const connection = mysql.createConnection({
    multipleStatements: true,
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'trackerDB',
});

connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
});

module.exports = connection;