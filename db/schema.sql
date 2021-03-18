DROP DATABASE IF EXISTS trackerDB;
CREATE DATABASE trackerDB;
USE trackerDB;

CREATE TABLE Department (
	id INT(10) auto_increment NOT NULL,
    name VARCHAR(30),
    PRIMARY KEY (id)
);

CREATE TABLE Role (
    id INT(10) auto_increment NOT NULL,
    title VARCHAR(30),
    salary DECIMAL(12,2),
    department_id INT(10) NOT NULL,
    PRIMARY KEY (id) 
);



CREATE TABLE Employee (
    id INT(10) auto_increment NOT NULL,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT(10) NOT NULL,
    manager_id INT(10),
    PRIMARY KEY (id)
);



