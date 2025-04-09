import dotenv from 'dotenv';
import pkg from 'pg';
import inquirer from 'inquirer';
import { pool, connectToDb as importedConnectToDb } from './connection';
// import axios from 'axios';

dotenv.config();

const { Pool } = pkg;
const API_URL = 'http://localhost:3001';

console.log('Welcome!');

const localPool = new Pool({
  user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: 'localhost',
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 5432,
});

const connectToDb = async () => {
    try {
        await localPool.connect();
        console.log('Connected to PostgreSQL database');
    } catch (error) {
        console.error('Error connecting to PostgreSQL database:', error);
        process.exit(1);
    }
}

async function showMenu() {
    const { action } = await inquirer.prompt({
      name: 'action',
      type: 'list',
      message: 'Choose an option:',
      choices: [
        'Add a new employee',
        'View all employees',
        'View all Roles',
        'Add a new role',
        'View all Departments',
        'Add a new department',
        'Exit',
      ],
    });
  
    try {
      switch (action) {
        case 'Add a new employee':
          await addEmployee();
          break;
  
        case 'View all employees':
            await viewEmployees();
          break;

        case 'View all Roles':
            await viewRoles();
          break;
        
        case 'Add a new role':
          await addRole();
            break;

        case 'View all Departments':
          await viewDepartments();
          break;
          
        case 'Add a new department':
          await addDepartment();
            break;

        case 'Exit':
          console.log('Goodbye!');
          process.exit(0);
      }
    } catch (error: any) {
      console.error('❌ Error:', error?.response?.data || error.message);
    }
  
    await showMenu();
  }
  
  async function addEmployee() {
    const rolesRes = await pool.query('SELECT * FROM role');
    const employeesRes = await pool.query('SELECT * FROM employee');
  
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'Enter first name:',
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'Enter last name:',
        },
        {
            type: 'list',
            name: 'roleId',
            message: 'Select role:',
            choices: rolesRes.rows.map(role => ({
            name: role.title,
            value: role.id,
            })),
        },
        {
            type: 'list',
            name: 'managerId',
            message: 'Select manager (optional):',
            choices: employeesRes.rows.map(employee => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
            })).concat({ name: 'None', value: null }),
        },
        ]);
  }

  const viewDepartments = async () => {
    const result = await pool.query('SELECT * FROM department');
    console.table(result.rows);
  };
  
  const viewRoles = async () => {
    const result = await pool.query('SELECT * FROM role');
    console.table(result.rows);
  };
  
  const viewEmployees = async () => {
    const result = await pool.query('SELECT * FROM employee');
    console.table(result.rows);
  };
  
  const addDepartment = async () => {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'departmentName',
        message: 'Please enter the department name:',
      },
    ]);
  
    const { departmentName } = answers;
    await pool.query(
      `INSERT INTO department (name) VALUES ($1)`,
      [departmentName]
    );
    console.log('Department inserted successfully!');
  };
  
  const addRole = async () => {
    const departments = await pool.query('SELECT id, name FROM department');
    const departmentChoices = departments.rows.map(department => ({
      name: department.name,
      value: department.id,
    }));
  
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'roleTitle',
        message:'Please enter the role title:',
      },
      {
        type: 'input',
        name: 'roleSalary',
        message:'Please enter the role salary:',
      },
      {
        type: 'list',
        name: 'roleDepartment',
        message:'Please select the department for this role:',
        choices: departmentChoices,
      },
    ]);
  
    const { roleTitle, roleSalary, roleDepartment } = answers;
    await pool.query(
      `INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)`,
      [roleTitle, roleSalary, roleDepartment]
    );
    console.log('Role inserted successfully!');
  };

importedConnectToDb().then(() => {
  showMenu();
    });
