USE employee_db;
INSERT INTO departments (name)
VALUES ('Sales'),
       ('Engineering'),
       ('Finance'),
       ('Legal');


INSERT INTO roles (title, salary, department_id)
VALUES ('Sales Lead', 100000, 1),
       ('Salesperson', 80000, 1),
       ('Software Engineer', 120000, 2),
       ('Account Manager', 160000, 3),
       ('Lawyer', 190000, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', 1, null),
       ('Mike', 'Chan', 1, 1),
       ('Kevin', 'Tupik', 2, null),
       ('Kunal', 'Signh', 3 , null),
       ('Tom', 'Allen', 4, null);

