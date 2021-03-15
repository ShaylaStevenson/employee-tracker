// dependencies
const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

// sources
// const QD = require('./queries/queryDepartment');

// create the connection information for the sql database
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'trackerDB',
});

const start = () => {
    inquirer
        .prompt({
            name: 'greeting',
            message: 'Welcome to Employee Tracker.\nLets begin!'
        })
        .then((answer) => {
            console.log('looks like functionality!');
            queryAllDepartment();
            queryDeliDepartment();
        })
}

//////////////////////////////////
const queryAllDepartment = () => {
    connection.query(
        'SELECT * FROM Department', (err, res) => {
        if (err) throw err;
        res.forEach(({ id, name }) => {
            console.log(`${id} | ${name}`);
        });
        console.log('-----------------');
    });
};

const queryDeliDepartment = () => {
    const query = connection.query(
        'SELECT * FROM Department WHERE name=?',
        ['Deli'],
        (err, res) => {
            if (err) throw err;
            res.forEach(({ id, name }) => {
                console.log(`${id} | ${name}`);
            });
        }
    );
    console.log(query.sql);
    connection.end();
};

connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
    start();
    // queryAllDepartment();
    // queryDeliDepartment();
});