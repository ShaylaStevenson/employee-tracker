// dependencies
const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

// sources
const connection = require('./config/connection.js');
const qEmp = require('./queries/queryEmployee.js');
const QD = require('./queries/queryDepartment.js');

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
    connection.query('SELECT * FROM Employee', (err, res) => {
        if (err) throw err;
        console.table('All Employees', res);
        //start();
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
                console.log(answer.whichDepartment);

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
                        connection.query('SELECT * FROM Employee WHERE ?',
                            {
                                role_id : number,
                            },
                            (err, res) => {
                                if (err) throw err;
                                console.table(`Employees in ${answer.whichDepartment} department`, res);
                            }
                        );
                    }); 
                } else {
                    console.log('There are no employees in that department');
                    //start();
                };
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
                    (err) => {
                      if (err) throw err;
                      console.log('Your employee was added successfully');
                      console.log(`${answer.newEmpFirstName} ${answer.newEmpLastName} | ${answer.newEmpRole} | ${role_id} | ${answer.newEmpManager} | ${manager_id}`);
                      
                      //re-prompt first question
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
            });
    });
};

const updateEmployeeRole = () => {
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
                console.log(`Updated ${answer.whichEmployee}'s role to ${answer.whichRole}`);
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
