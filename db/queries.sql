INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', 1, NULL); 

SELECT * FROM employee;

UPDATE employee
SET role_id = 2 
WHERE id = 1; 

DELETE FROM employee
WHERE id = 1;
