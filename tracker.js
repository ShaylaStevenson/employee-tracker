// dependencies
const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
const express = require('express')

// sources
const QD = require('./queries/queryDepartment.js');

// allows multiple queries in one statement
// var connection = mysql.createConnection({multipleStatements: true});


// create the connection information for the sql database
const connection = mysql.createConnection({
    multipleStatements: true,
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'trackerDB',
});

const start = (err, res) => {
    if (err) throw err;
    inquirer
    .prompt(
        {
            name: 'doWhat',
            message: 'What would you like to do?',
            type: 'rawlist',
            choices: ['View all employees', 'View all employees by department', 'View all employees by role',
            'View all employees by manager', 'Add employee', 'Remove employee', 'Update employee department', 'Update employee role', 
            'Update employee manager', 'Add role', 'View all roles', 'Add department', 'View all departments'],
            default: 'View all employees',
        }
    )    
    .then((answer) => {
        switch (answer.doWhat) {
            case 'View all employees':
                viewAllEmployees();
                break;
            case 'View all employees by department':
                viewAllEmployeesByDepartment();
                break;
            case 'View all employees by role':
                viewAllEmployeesByRole();
                break;
            case 'View all employees by manager':
                viewAllEmployeesByManager();
                break;
            case 'Add employee':
                addEmployee();
                break;
            case 'Remove employee':
                removeEmployee();
                break;
            case 'Update employee department':
                updateEmployeeDepartment();
                break;
            case 'Update employee role':
                updateEmployeeRole();
                break;
            case 'Update employee manager':
                updateEmployeeManager();
                break;
            case 'Add role':
                addRole();
                break;
            case 'View all roles':
                viewAllRoles();
                break;
            default:
                console.log('ERROR: choice not recognized');
                connection.end();
        }
    });
};

const viewAllEmployees = () => {
    connection.query(
        'SELECT * FROM Employee', (err, res) => {
        if (err) throw err;
        res.forEach(({ id, first_name, last_name, role_id, manager_id }) => {
            console.log(`${id} | ${first_name} | ${last_name} | ${role_id} | ${manager_id}`);
        });
        console.log('-----------------');
    });
};

const viewAllEmployeesByDepartment = () => {
    connection.query('SELECT * FROM Department', (err, res) => {
        if (err) throw err;
        inquirer
            .prompt(
                {
                    name: 'whichDepartment',
                    message: 'Select department',
                    type: 'rawlist',
                    choices() {
                        const choiceArray = [];
                        res.forEach(({ name }) => {
                          choiceArray.push(name);
                        });
                        return choiceArray;
                    },      
                }
            )
            .then((answer) => {
                console.log(answer.whichDepartment); 
            });
    });       
};

const viewAllEmployeesByRole = () => {
    connection.query('SELECT * FROM Role', (err, res) => {
        if (err) throw err;
        inquirer
            .prompt(
                {
                    name: 'whichRole',
                    message: 'Select role',
                    type: 'rawlist',
                    choices() {
                        const choiceArray = [];
                        res.forEach(({ title }) => {
                        choiceArray.push(title);
                        });
                        return choiceArray;
                    },
                }
            )
            .then((answer) => {
                console.log(answer.whichRole);
            });
    });     
};

const viewAllEmployeesByManager = () => {
    connection.query('SELECT * FROM Employee', (err, res) => {   
        inquirer
            .prompt(
                {
                    name: 'whichManager',
                    message: 'Select Manager',
                    type: 'rawlist',
                    choices() {
                        const choiceArray = [];
                        res.forEach(({ first_name, last_name }) => {
                        choiceArray.push(`${first_name} ${last_name}`);
                        });
                        return choiceArray;
                    },
                }
            )
            .then((answer) => {
                console.log(answer.whichManager);
            });
    });
};

const addEmployee = () => {
    let sql = 'SELECT * FROM Role;SELECT * FROM Employee';
    connection.query(sql, (err, res) => {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: 'newEmpFirstName',
                    message: "What is the employee's first name?",
                    type: 'input',
                },
                {
                    name: 'newEmpLastName',
                    message: "What is the employee's last name?",
                    type: 'input',
                },
                {
                    name: 'newEmpRole',
                    message: "What is the employee's role?",
                    type: 'rawlist',
                    choices() {
                        const choiceArray = [];
                        res[0].forEach(({ title }) => {
                        choiceArray.push(title);
                        });
                        return choiceArray;
                    },
                },
                {
                    name: 'newEmpManager',
                    message: "If applicable, who is the employee's manager?",
                    type: 'rawlist',
                    choices() {
                        const choiceArray = [];
                        res[1].forEach(({ first_name, last_name }) => {
                        choiceArray.push(`${first_name} ${last_name}`);
                        });
                        return choiceArray;
                    },
                }
            ])
            .then((answer) => {
                console.log('New employee added')
                console.log(`${answer.newEmpFirstName} ${answer.newEmpLastName} | ${answer.newEmpRole} | ${answer.newEmpManager}`);
            });
    });
};


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

// const queryAllEmployee = () => {
//     connection.query(
//         'SELECT * FROM Employee', (err, res) => {
//         if (err) throw err;
//         res.forEach(({ id, first_name, last_name, role_id, manager_id }) => {
//             console.log(`${id} | ${first_name} | ${last_name} | ${role_id} | ${manager_id}`);
//         });
//         console.log('-----------------');
//     });
//     connection.end();
// };

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

// // split the answer into individual words
            // const choice = (answer.doWhat).split(' ');
            
            // // return each word capitalized
            // const upperChoice = choice.map((word) => {
            //     return word[0].toUpperCase() + word.substring(1);
            // }).join(' ');

            // // remove white space
            // const whiteOut = upperChoice.replace(/\s+/g, '');
            
            // // make first letter of string lower case
            // //string = string.substring(0, 1).toLowerCase() + string.substring(1);
            // const finalChoice = whiteOut.substring(0, 1).toLowerCase() + whiteOut.substring(1) +'()';
            // console.log(finalChoice);

            // var choiceFunc = new Function(finalChoice);
            // choiceFunc();
            // console.log(choiceFunc);
