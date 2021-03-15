DROP DATABASE IF EXISTS trackerDB;
CREATE DATABASE trackerDB;
USE trackerDB;

CREATE TABLE department (
	id int(10) auto_increment NOT NULL,
    name VARCHAR(30),
    PRIMARY KEY (id)
);