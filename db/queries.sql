INSERT INTO employees (first_name, last_name, email, hire_date, job_title)
VALUES ('John', 'Doe', 'john.doe@example.com', '2023-01-15', 'Software Engineer');


SELECT * FROM employees;


UPDATE employees
SET job_title = 'Senior Software Engineer'
WHERE employee_id = 1;


DELETE FROM employees
WHERE employee_id = 1;