const inquirer = require('inquirer');
require('console.table');
const db = require('./config/config');

function mainMenu() {
    inquirer.prompt({
        type: 'list',
        name: 'userChoice',
        message: 'What would you like to do?',
        choices: [
        {
            name: 'View all Employees',
            value: 'viewEmp'
        },
        {
            name: 'Add Employee',
            value: 'addEmp'
        },
        {
            name: 'Update Employee Role',
            value: 'updateEmp'
        },
        {
            name: 'View all Roles',
            value: 'viewRole'
        },
        {
            name: 'Add Role',
            value: 'addRole'
        },
        {
            name: 'View all Departments',
            value: 'viewDep'
        },
        {
            name: 'Add a Department',
            value: 'addDep'
        },
        {
            name: 'Nevermid',
            value: 'end'
        }
        ]
    }).then(data => {
        switch(data.userChoice) {
            case 'viewEmp':     
                viewEmployees();
                break;
            case 'addEmp':
                addEmployee();
                break;
            case 'updateEmp':
                updateEmployee();
                break;
            case 'viewRole':
                viewRoles();
                break;
            case 'addRole':
                addRole();
                break;
            case 'viewDep':
                viewDepartments();
                break;
            case 'addDep':
                addDepartment();
                break;
            default:
                process.exit();
        }
    })
}

function viewEmployees() {
    db.promise().query(
        `SELECT e.id, e.first_name, e.last_name, title, salary, CONCAT(m.first_name, ' ',  m.last_name) AS manager 
        FROM employees AS e 
        JOIN roles ON e.role_id = roles.id
        LEFT JOIN employees AS m
        ON e.manager_id = m.id`
        ).then(data => {
        console.table(data[0]);
        mainMenu();
    });
}

function addEmployee() {
    db.promise().query(
        `SELECT id, title FROM roles`
        ).then(data => {
        const rolesList = data[0].map(row => {
            return {
                name: row.title,
                value: row.id
            }
        })
        db.promise().query(
            `SELECT id, CONCAT(first_name, ' ',  last_name) AS name FROM employees`
            ).then(data => {
                const employeesList = data[0].map(row => {
                    return {
                        name: row.name,
                        value: row.id
                    }
                })
                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'first',
                        message: 'Employees first name?'
                    },
                    {
                        type: 'input',
                        name: 'last',
                        message: 'Employees last name?'
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: 'What role?',
                        choices: rolesList
                    },
                    {
                        type: 'list',
                        name: 'manager',
                        message: 'What manager?',
                        choices: employeesList
                    }

                ]).then(data => {
                    db.promise().query(
                        `INSERT INTO employees (first_name, last_name, role_id, manager_id)
                        VALUES ('${data.first}', '${data.last}', ${data.role}, ${data.manager})`
                        ).then(data => {
                        console.log('Employee Added!')
                        mainMenu();
                    });
                })
            });
    });
}

function updateEmployee() {
    db.promise().query(
        `SELECT id, CONCAT(first_name, ' ',  last_name) AS name, role_id FROM employees`
        ).then(data => {
            const employeesList = data[0].map(row => {
                return {
                    name: row.name,
                    value: row.id
                }
            })
            db.promise().query(
                `SELECT id, title FROM roles`
                ).then(data => {
                const rolesList = data[0].map(row => {
                    return {
                        name: row.title,
                        value: row.id
                    }
                })
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'emp',
                        mesage: 'Which Employee would you like to update?',
                        choices: employeesList
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: 'Which role do you want to assign the selected employee?',
                        choices: rolesList
                    }
                ]).then(data => {
                    db.promise().query(
                        `UPDATE employees SET role_id = ${data.role} WHERE id = ${data.emp}`
                        ).then(data => {
                        console.log('Employee Updated!')
                        mainMenu();
                    })
            })
        })    
    })
}


function viewRoles() {
    db.promise().query(
        `SELECT roles.id, title, salary, name AS department_name 
        FROM roles
        LEFT JOIN departments
        ON roles.department_id = departments.id`
        ).then(data => {
        console.table(data[0]);
        mainMenu();
    });
}

function addRole() {
    db.promise().query(
        `SELECT * FROM departments`
        ).then(data => {
        const departmentList = data[0].map(row => {
            return {
                name: row.name,
                value: row.id
            }
        })
        inquirer.prompt([
            {
                type: 'input',
                name: 'role',
                message: 'What Role would you like to add?'
            },
            {
                type: 'input',
                name: 'money',
                message: 'What is the Salary of this position?'
            },
            {
                type: 'list',
                name: 'dep',
                message: 'What Department is this Role?',
                choices: departmentList
            }
        ]).then(data => {
            db.promise().query(
                `INSERT INTO roles (title, salary, department_id)
                VALUES ('${data.role}', ${data.money}, ${data.dep})`
                ).then(data => {
                console.log('Role Added!')
                mainMenu();
            });
        });
    });
}

function viewDepartments() {
    db.promise().query(
        `SELECT * FROM departments`
        ).then(data => {
        console.table(data[0]);
        mainMenu();
    });
}

function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'dep',
            message: 'What Department would you like to add?'
        }
    ]).then(data => {
        db.promise().query(
            `INSERT INTO departments (name)
            VALUES ('${data.dep}')`
            ).then(data => {
            console.log('Department Added!')
            mainMenu();
        });
    })
};

mainMenu();