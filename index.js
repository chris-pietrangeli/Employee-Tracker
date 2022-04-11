const mysql = require('mysql2');
const inquirer = require('inquirer');
const db = require('./config/connections');

db.connect((err) => {
    if (err) throw err;
    console.log("Your connection was succesfull, Check out the terminal for more!");
    homepage();
});

const homepage = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'homepage',
            message: 'What would you like to do?',
            choices: ["view all departments", "view all employees", 
            "view all roles", "add a role", "add a department", 
            "add an employee", "update an employee role"]
        }
    ])
        .then((answer) => {
            switch (answer.homepage) {
                case "view all departments":
                    viewDepartment();
                    break;

                case "view all employees":
                    viewEmployees();
                    break;
                
                case "view all roles":
                    viewRoles();
                    break;

                case "add a role":
                    addRole();
                    break;

                case "add a department":
                    addDepartment();
                    break;

                case "add an employee":
                    addEmployee();
                    break;

                case "update an employee role":
                    updateEmployee();
                    break;

                default:
                    break;
            }
        })
};

function viewDepartment() {
    db.query("SELECT * FROM departments", (err, res) => {
        if (err) throw err;
        console.table(res);
        homepage();
    })
};

function viewEmployees() {
    db.query("SELECT * FROM employees", (err, res) => {
        if (err) throw err;
        console.table(res);
        homepage();
    })
};

function viewRoles() {
    db.query("SELECT * FROM roles", (err, res) => {
        if (err) throw err;
        console.table(res);
        homepage();
    })
};

function addRole() {
    db.query("SELECT id, name FROM  departments", (err, department) => {
        inquirer.prompt ([
            {
                type: 'input',
                name: 'role_title',
                message: 'What role would you like to add?'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'what is there salary?'
            },
            {
                type: 'list',
                name: 'department_id',
                message: 'What is the department_id for this role?',
                choices: department.map(i => ({name: i.name, value: i.id}))
            }
        ])
            .then((answer) => {
                db.query("INSERT INTO roles (role_title, salary, department_id) VALUES (?,?,?)", 
                [answer.role_title, answer.salary, answer.department_id], (err, res) => {
                    if (err) throw err;
                    console.table(res);
                    homepage();
                });
            });
    });
};

function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Name the department you would like to add'
        }
    ])
        .then((answer) => {
            db.query("INSERT INTO departments (name) VALUES (?)", answer.name, (err, res) => {
                if (err) throw err;
                console.table(res);
                homepage();
            })
        })
};

function addEmployee() {
    db.query("SELECT id, role_title FROM roles", (err, role) => {
        db.query("SELECT id, last_name FROM employees", (err, employee) => {
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'first_name',
                    message: 'Employee first name?'
                },
                {
                    type: 'input',
                    name: 'last_name',
                    message: 'Employee last name?'
                },
                {
                    type: 'list',
                    name: 'role_id',
                    message: 'What is the employee role id?',
                    choices: role.map(i => ({name: i.role_title, value: i.id}))
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: 'What is the manager id for the new employee',
                    choices: employee.map(i => ({name: i.first_name, value: i.id}))
                }
            ])
                .then((answer) => {
                    db.query("INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)", 
                    [answer.first_name, answer.last_name, answer.role_id, answer.manager], (err, res) => {
                        if (err) throw err;
                        console.table(res);
                        homepage();
                    });
                });
        });
    });
};

function updateEmployee() {
    db.query("SELECT id, first_name FROM employees", (err, employees) => {
        db.query("SELECT id, role_title FROM roles", (err, roles) => {
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employees',
                    message: 'What employee do you want to update?',
                    choices: employees.map(i => ({name: i.first_name, value: i.id}))
                },
                {
                    type: 'list',
                    name: 'roles',
                    message: 'Change employees role?',
                    choices: roles.map(i => ({name: i.role_title, value: i.id}))
                }
            ])
                .then((answer) => {
                    db.query("UPDATE employees SET role_id = '?' WHERE 'id' = '?' ", 
                    [answer.roles.id, answer.employees], (err, res) => {
                        if (err) throw err;
                        console.table(res);
                        homepage();
                    });
                });
        });
    });
};