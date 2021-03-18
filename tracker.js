// dependencies
const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

// sources
const connection = require('./config/connection.js');

const start = (err, res) => {
    if (err) throw err;
    inquirer
    .prompt(
        {
            name: 'doWhat',
            message: 'What would you like to do?',
            type: 'rawlist',
            choices: ['View all employees', 'View all employees by department', 'View all employees by role',
            'View all employees by manager', 'Add employee', 'Remove employee', 'Update employee role', 
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
            case 'Add department':
                addDepartment();
                break;
            case 'View all departments':
                viewAllDepartments();
                break;
        };
    });
};

const viewAllEmployees = () => {
    let sql = `SELECT id AS 'Emp ID', CONCAT(first_name, last_name) AS 'Name' FROM Employee`
    connection.query(sql, (err, res) => {
        if (err) throw err;
        console.table('All Employees', res);
        start();
    });
};

const viewAllEmployeesByDepartment = () => {
    let sql = 'SELECT * FROM Employee;SELECT * FROM Role;SELECT * FROM Department'
    connection.query(sql, (err, res) => {
        if (err) throw err;
        inquirer
            .prompt(
                {
                    name: 'whichDepartment',
                    message: 'Select department',
                    type: 'rawlist',
                    choices() {
                        const choiceArray = [];
                        res[2].forEach(({ name }) => {
                          choiceArray.push(name);
                        });
                        return choiceArray;
                    },      
                }
            )
            .then((answer) => {

                // determine departmentId based on answer
                let departmentId;
                res[2].forEach((deptName) => {
                    if (deptName.name === answer.whichDepartment) {
                        departmentId = deptName.id;
                    };
                });

                // determine which roles to query based on departmentId
                let roleArr = [];
                res[1].forEach((role) => {
                    if (departmentId === role.department_id) {
                        roleArr.push(role.id);
                    };
                });

                // run query using the roleArr of relevent role_ids
                if (roleArr !== '') {
                    roleArr.forEach((number) => {
                        let sql =
                        `SELECT id AS 'Emp Id', CONCAT(first_name, last_name) AS 'Name'
                        FROM Employee
                        WHERE ?`
                        connection.query(sql,
                            {
                                role_id : number,
                            },
                            (err, res) => {
                                if (err) throw err;
                                console.table(`Employees in ${answer.whichDepartment} department`, res);
                                start();
                            }
                        );
                    }); 
                } else {
                    console.log('There are no employees in that department');
                    start();
                };
            });
    });       
};

const viewAllEmployeesByRole = () => {
    // use the title's from Role table to list choices
    connection.query('SELECT title FROM Role', (err, res) => {
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
                // inner join Role and Employee to display table
                let sql =
                `SELECT Employee.id AS 'Emp ID', CONCAT(Employee.first_name, ' ', Employee.last_name) AS 'Name'
                FROM Role
                INNER JOIN Employee
                ON Role.id = Employee.role_id
                WHERE Role.title = '${answer.whichRole}'`;
                connection.query(sql, (err, res) => {
                    if (err) throw err;
                    if (res !== '') {
                        console.table(`Employees assigned to ${answer.whichRole}`, res);
                        start();
                    } else {
                        console.log(`There are no employees assigned to the role of ${answer.whichRole}`);
                        start();
                    };    
                });
            });
    });     
};

const viewAllEmployeesByManager = () => {
    // show choice of managers (ie, all employees) full name
    connection.query('SELECT first_name, last_name FROM Employee', (err, res) => {  
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
                // find the id of the selected manager and save as mngId
                let sql =
                `SELECT id, CONCAT(first_name, ' ', last_name) AS fullName 
                FROM Employee
                WHERE CONCAT(first_name, ' ', last_name) = '${answer.whichManager}'`;
                connection.query(sql, (err, res) => {
                    if (err) throw err;
                    //console.log(res[0].id);
                    const mngId = res[0].id;
                    //console.log(mngId);
                
                    // use the mngId to select employees with matching manager_id
                    let sql2 = 
                    `SELECT id AS 'Emp ID', CONCAT(first_name, ' ', last_name) AS 'Name'
                    FROM Employee
                    WHERE manager_id = '${mngId}'`;
                    connection.query(sql2, (err, res) => {
                        if (err) throw err;
                        if (res != '') {
                            console.table(`Employees reporting to ${answer.whichManager}`, res);
                            start();
                        } else {
                            console.log(`There are no employees reporting to ${answer.whichManager}`);
                            start();
                        }; 
                    });
                });
            });    
    });
};

const addEmployee = () => {
    // use data from Role and Employee tables to display choices
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

                // determine the role_id based on answer
                let role_id;
                res[0].forEach((role) => {
                    if (role.title === answer.newEmpRole) {
                        role_id = role.id;
                    };
                });
            
                // determine the manager_id based on answer
                let manager_id;
                res[1].forEach((person) => {
                    const fullName = `${person.first_name} ${person.last_name}`;

                    if (fullName === answer.newEmpManager) {
                        manager_id = person.id;
                    } 
                })

                // add new employee to database
                connection.query('INSERT INTO Employee SET ?',
                    {
                        first_name: answer.newEmpFirstName,
                        last_name: answer.newEmpLastName,
                        role_id: role_id,
                        manager_id: manager_id,
                    },
                    (err, res) => {
                      if (err) throw err;
                      console.log('Your employee was added successfully');
                      console.table(`${answer.newEmpFirstName} ${answer.newEmpLastName} | ${answer.newEmpRole} ${role_id} | ${answer.newEmpManager} ${manager_id}`);
                      
                      start();
                    }
                );
            });
    });
};

const removeEmployee = () => {
    connection.query('SELECT * FROM Employee', (err, res) => {
        if (err) throw err;
        inquirer
            .prompt(
                {
                    name: 'removeWho',
                    message: 'Which employee do you want to remove?',
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
                console.log('Removed employee:');
                console.log(answer.removeWho);
                // determine the employee's id # based on answer
                let empId;
                res.forEach((employee) => {
                    if (`${employee.first_name} ${employee.last_name}` === answer.removeWho) {
                        empId = employee.id;
                        console.log(empId);
                    };
                });

                // delete the employee with matching id from database
                let sql = `DELETE FROM Employee WHERE id = ${empId}`;
                connection.query(sql, (err, res) => {
                    if (err) throw err;
                    console.table(`${answer.removeWho} has been removed`);
                    start();
                });
            });
    });
};

const updateEmployeeRole = () => {
    // use data from Employee and Role tables to display choices
    let sql = 'SELECT * FROM Employee;SELECT * FROM Role';
    connection.query(sql, (err, res) => {
        inquirer
            .prompt([
                {
                    name: 'whichEmployee',
                    message: 'Select employee',
                    type: 'rawlist',
                    choices() {
                        const choiceArray = [];
                        res[0].forEach(({ first_name, last_name }) => {
                        choiceArray.push(`${first_name} ${last_name}`);
                        });
                        return choiceArray;
                    },
                },
                {
                    name: 'whichRole',
                    message: 'Select new role',
                    type: 'rawlist',
                    choices() {
                        const choiceArray = [];
                        res[1].forEach(({ title }) => {
                        choiceArray.push(title);
                        });
                        return choiceArray;
                    },
                }
            ])
            .then((answer) => {

                // determine the employee's id # based on answer
                let empId;
                res[0].forEach((employee) => {
                    if (`${employee.first_name} ${employee.last_name}` === answer.whichEmployee) {
                        empId = employee.id;
                    };
                });

                // determine the role's id # based on answer
                let roleId;
                res[1].forEach((role) => {
                    if (role.title === answer.whichRole) {
                        roleId = role.id;
                    };
                });
                
                // update the selected employee's role in database
                let sql =
                `UPDATE Employee
                SET role_id = ${roleId}
                WHERE id = ${empId}`;
                connection.query(sql, (err, res) => {
                    if(err) return err;
                    console.table(`${answer.whichEmployee}'s role has been updated to ${answer.whichRole}`);
                });
            });
    });
};

const updateEmployeeManager = () => {
    connection.query('SELECT * FROM Employee', (err, res) => {
        inquirer
            .prompt([
                {
                    name: 'selectEmployee',
                    message: 'Select an employee',
                    type: 'rawlist',
                    choices() {
                        const choiceArray = [];
                        res.forEach(({ first_name, last_name }) => {
                        choiceArray.push(`${first_name} ${last_name}`);
                        });
                        return choiceArray;
                    },
                },
                {
                    name: 'selectManager',
                    message: 'Select a new manager',
                    type: 'rawlist',
                    choices() {
                        const choiceArray = [];
                        res.forEach(({ first_name, last_name }) => {
                        choiceArray.push(`${first_name} ${last_name}`);
                        });
                        return choiceArray;
                    },
                }
            ])
            .then((answer) => {
                console.log(`${answer.selectEmployee}'s manager is now ${answer.selectManager}`);
            });
    });
};

const addRole = () => {
    connection.query('SELECT * FROM Role', (err, res) => {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: 'newTitle',
                    message: "What is the role's title?",
                    type: 'input'
                },
                {
                    name: 'newSalary',
                    message: "What is the role's salary?",
                    type: 'input'
                },
                {
                    name: 'newDept',
                    message: "What is the role's department?",
                    type: 'rawlist',
                    choices() {
                        const choiceArray = [];
                        res.forEach(({ title }) => {
                        choiceArray.push(title);
                        });
                        return choiceArray;
                    },
                }
            ])
            .then((answer) => {
                console.log('New role added:');
                console.log(`${answer.newTitle} | ${answer.newSalary} | ${answer.newDept}`);
            })
    });        
};

const viewAllRoles = () => {
    connection.query('SELECT * FROM Role', (err, res) => {
        if (err) throw err;
        res.forEach(({ id, title, salary, department_id }) => {
            console.log(`${id} | ${title} | ${salary} | ${department_id}`);
        });
    });
};

const addDepartment = () => {
    inquirer
        .prompt(
            {
                name: 'deptName',
                message: 'What is the name of the department?',
                type: 'input',
            }
        )
        .then((answer) => {
            console.log('New department added:');
            console.log(answer.deptName);
        });
};

const viewAllDepartments = () => {
    connection.query('SELECT * FROM Department', (err, res) => {
        if (err) throw err;
        res.forEach(({ id, name }) => {
            console.log(`${id} | ${name}`);
        });
    });
};

start();

// connection.connect((err) => {
//     if (err) throw err;
//     console.log(`connected as id ${connection.threadId}`);
//     start();
// });

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
