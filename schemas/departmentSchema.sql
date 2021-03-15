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

