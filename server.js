const inquirer = require('inquirer');
require('console.table');
const mysql = require('mysql2');
require('dotenv').config()
console.log(process.env.DB_USER);

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    }
)

// db.connect((err) => {
//  if(err) {
//     console.log(err)
//  }
// })

db.promise().query(
    `SELECT e.id, e.first_name, e.last_name, title, salary, CONCAT(m.first_name, ' ',  m.last_name) AS manager 
    FROM employees AS e 
    JOIN roles ON e.role_id = roles.id
    LEFT JOIN employees AS m
    ON e.manager_id = m.id`
    ).then(data => {
    console.table(data[0])
})