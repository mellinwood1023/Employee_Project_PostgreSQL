INSERT INTO department (name)
VALUES  ('Sales'),
        ('Engineering'),
        ('Finance'),
        ('Legal');

INSERT INTO role (title, salary, department_id)
VALUES  ('Sales Lead', 100000, 1),
        ('Salesperson', 80000, 1),
        ('Lead Engineer', 120000, 2),
        ('Software Engineer', 100000, 2),
        ('Accountant', 90000, 3),
        ('Legal Team Lead', 150000, 4),
        ('Lawyer', 120000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ('George', 'Straight', 1, NULL),
        ('Will', 'Smith', 2, 1),
        ('Jim', 'Carrey', 3, NULL),
        ('Betty', 'White', 4, 3),
        ('Jack', 'Black', 5, NULL),
        ('Angelina', 'Jolie', 6, NULL),
        ('Brad', 'Pitt', 7, NULL);
