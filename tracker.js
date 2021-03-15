// dependencies
const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

// sources
const QD = require('./queries/queryDepartment.js');

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
            //console.log('looks like communication with module.exports is working.');
            queryAllDepartment();
            queryAllRole();
            queryAllEmployee();
            //queryDeliDepartment();
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

const queryAllRole = () => {
    connection.query(
        'SELECT * FROM Role', (err, res) => {
        if (err) throw err;
        res.forEach(({ id, title, salary, department_id }) => {
            console.log(`${id} | ${title} | ${salary} | ${department_id}`);
        });
        console.log('-----------------');
    });
};

const queryAllEmployee = () => {
    connection.query(
        'SELECT * FROM Employee', (err, res) => {
        if (err) throw err;
        res.forEach(({ id, first_name, last_name, role_id, manager_id }) => {
            console.log(`${id} | ${first_name} | ${last_name} | ${role_id} | ${manager_id}`);
        });
        console.log('-----------------');
    });
    connection.end();
};

// const queryDeliDepartment = () => {
//     const query = connection.query(
//         'SELECT * FROM Department WHERE name=?',
//         ['Deli'],
//         (err, res) => {
//             if (err) throw err;
//             res.forEach(({ id, name }) => {
//                 console.log(`${id} | ${name}`);
//             });
//         }
//     );
//     console.log(query.sql);
//     connection.end();
// };

connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
    start();
    // queryAllDepartment();
    // queryDeliDepartment();
});
