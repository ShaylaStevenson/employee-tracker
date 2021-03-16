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
            name: 'doWhat',
            message: 'What would you like to do?',
            type: 'rawlist',
            choices: ['View all employees', 'View all employees by department', 'View all employees by role',
             'Add employee', 'Remove employee', 'Update employee role', 'Update employee manager', 'Add role',
             'View all roles', 'Add department', 'View all departments'],
            default: 'View all employees',
        })
        .then((answer) => {

            // split the answer into individual words
            const choice = (answer.doWhat).split(' ');
            
            // return each word capitalized
            const upperChoice = choice.map((word) => {
                return word[0].toUpperCase() + word.substring(1);
            }).join(' ');

            // remove white space
            const whiteOut = upperChoice.replace(/\s+/g, '');
            
            // make first letter of string lower case
            //string = string.substring(0, 1).toLowerCase() + string.substring(1);
            const finalChoice = whiteOut.substring(0, 1).toLowerCase() + whiteOut.substring(1) +'()';
            console.log(finalChoice);

            var choiceFunc = new Function(finalChoice);
            choiceFunc();
           

            //free code camp, capitalize each first letter
            // const mySentence = "freeCodeCamp is an awesome resource";
            // const words = mySentence.split(" ");

            // words.map((word) => { 
            //     return word[0].toUpperCase() + word.substring(1); 
            // }).join(" ");

            //remove white space future studio.io
            //const stripped = '    My String With A    Lot Whitespace  '.replace(/\s+/g, '');

            //lowercase first letter stack overflow
            // string = Character.toLowerCase(string.charAt(0)) + string.substring(1);



            // .then((answer) => {
            //     // based on their answer, either call the bid or the post functions
            //     if (answer.postOrBid === 'POST') {
            //       postAuction();
            //     } else if (answer.postOrBid === 'BID') {
            //       bidAuction();
            //     } else {
            //       connection.end();
            //     }
            //   });
            //console.log('looks like communication with module.exports is working.');
            // queryAllDepartment();
            // queryAllRole();
            // queryAllEmployee();
            //queryDeliDepartment();
        })
}
function viewAllEmployees() {
    console.log('I cant fucking believe this worked');
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
