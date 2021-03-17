DROP DATABASE IF EXISTS trackerDB;
CREATE DATABASE trackerDB;
USE trackerDB;

CREATE TABLE Department (
	id INT(10) auto_increment NOT NULL,
    name VARCHAR(30),
    PRIMARY KEY (id)
);

INSERT INTO Department (name)
VALUES ('Major Sales'), ('Optical'), ('Hearing Aid'), ('Pharmacy'), ('Deli');

CREATE TABLE Role (
    id INT(10) auto_increment NOT NULL,
    title VARCHAR(30),
    salary DECIMAL(12,2),
    department_id INT(10) NOT NULL,
    PRIMARY KEY (id) 
);

INSERT INTO Role (title, salary, department_id)
VAlUES ('Sales Associate', 40000, 1),
('Optometrist', 92000, 2),
('Licensed Dispencer', 73000, 3),
('Technician', 71000, 4),
('Chicken Guy', 33000, 5),
('Prep Person', 36000, 5);

CREATE TABLE Employee (
    id INT(10) auto_increment NOT NULL,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT(10) NOT NULL,
    manager_id INT(10),
    PRIMARY KEY (id)
);

INSERT INTO Employee (first_name, last_name, role_id, manager_id)
VALUES ('Bertha', 'Blue', 1, 5), ('Hue', 'Lui', 2, 5), ('Ben', 'Tens', 3, 5), ('Wina', 'Slima', 4, 5), ('Gert', 'Mert', 5, null), ('Beatrice', 'Bert', 5, 5);

