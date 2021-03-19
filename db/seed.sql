USE trackerDB;


-- Data for Department table --
INSERT INTO Department (id, name)
VALUES (1, 'Administration'), (2, 'Front End'), (3, 'Merchandising'),
(4, 'Food Court'), (5, 'Deli'), (6, 'Bakery'),
(7, 'Pharmacy'), (8, 'Optical'), (9, 'Hearing Aid');

-- Data for Role table --
INSERT INTO Role (id, title, salary, department_id)
VAlUES (1, 'Payroll Clerk', 60000, 1), (2, 'Sales Auditor', 58000, 1),
(3, 'Cashier', 50000, 2), (4, 'Cart Puller', 30000, 2),
(5, 'Forklift Driver', 50000, 3), (6, 'Stocker', 40000, 3),
(7, 'FC Cashier', 35000, 4), (8, 'FC Prepper', 37000, 4),
(9, 'Deli Prepper', 37000, 5), (10, 'Chicken Chef', 35000, 5),
(11, 'Baker', 50000, 6), (12, 'Wrapper', 35000, 6),
(13, 'Pharmacy Technician', 70000, 7), (14, 'Pharmacist', 90000, 7),
(15, 'Optometrist', 85000, 8), (16, 'Optical Technician', 60000, 8),
(17, 'Hearing Aid Specialist', 75000, 9), (18, 'Hearing Aid Dispenser', 58000, 9),
(19, 'General Manager', 100000, 1);


-- Data for Employee table --
INSERT INTO Employee (id, first_name, last_name, role_id, manager_id)
VALUES (1, 'Bertha', 'Blue', 1, 19), (2, 'Hue', 'Lui', 2, 19),
(3, 'Ben', 'Tens', 3, 19), (4, 'Wina', 'Slima', 4, 3),
(5, 'Gert', 'Mert', 5, 19), (6, 'Beatrice', 'Bert', 6, 5), --merch
(7, 'Gertie', 'Green', 7, 8), (8, 'Bing', 'Tune', 8, 19), --FC
(9, 'Roja', 'Red', 9, 19), (10, 'Azul', 'Blue', 10, 9), --deli
(11, 'Kim', 'Bin', 11, 19), (12, 'Zach', 'Lack', 12, 11),
(13, 'Sam', 'Clam', 13, 14), (14, 'Marietta', 'Smart', 14, 19),
(15, 'Wanda', 'Vision', 15, 19), (16, 'Hatti', 'Thate', 16, 15),
(17, 'Cam', 'Can', 17, 5), (18, 'Ron', 'Long', 18, 17),
(19, 'Mildred', 'Boss', 19);

