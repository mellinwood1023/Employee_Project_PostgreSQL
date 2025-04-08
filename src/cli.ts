import inquirer from 'inquirer';
import axios from 'axios';

const API_URL = 'http://localhost:3001';

async function showMenu() {
  const { action } = await inquirer.prompt({
    name: 'action',
    type: 'list',
    message: 'What would you like to do?',
    choices: [
      'Add a new employee',
      'View all employees',
      'Get Employee by ID',
      'View all Roles',
      'View all Departments',
      'Exit',
    ],
  });

  try {
    switch (action) {
      case 'Add a new employee':
        await addEmployee();
        break;

      case 'View all employees':
        const employees = await axios.get(`${API_URL}/employees`);
        console.table(employees.data);
        break;

      case 'Get Employee by ID':
        const { id } = await inquirer.prompt({
          name: 'id',
          type: 'input',
          message: 'Enter employee ID:',
        });
        const emp = await axios.get(`${API_URL}/employees/${id}`);
        console.log('Employee:', emp.data);
        break;

      case 'View all Roles':
        const roles = await axios.get(`${API_URL}/roles`);
        console.table(roles.data);
        break;

      case 'View all Departments':
        const departments = await axios.get(`${API_URL}/departments`);
        console.table(departments.data);
        break;

      case 'Exit':
        console.log('Goodbye!');
        return;
    }
  } catch (error: any) {
    console.error('❌ Error:', error?.response?.data || error.message);
  }

  await showMenu();
}

async function addEmployee() {
  const rolesRes = await axios.get<{ id: number; title: string }[]>(`${API_URL}/roles`);
  const employeesRes = await axios.get<{ id: number; first_name: string; last_name: string }[]>(`${API_URL}/employees`);

  const answers = await inquirer.prompt([
    { name: 'first_name', type: 'input', message: 'Enter first name:' },
    { name: 'last_name', type: 'input', message: 'Enter last name:' },
    {
      name: 'role_id',
      type: 'list',
      message: 'Select role:',
      choices: rolesRes.data.map((role: any) => ({
        name: role.title,
        value: role.id,
      })),
    },
    {
      name: 'manager_id',
      type: 'list',
      message: 'Select manager:',
      choices: [
        { name: 'None', value: null },
        ...employeesRes.data.map((emp: any) => ({
          name: `${emp.first_name} ${emp.last_name}`,
          value: emp.id,
        })),
      ],
    },
  ]);

  const res = await axios.post(`${API_URL}/employees`, answers);
  console.log('✅ Employee added:', res.data);
}

showMenu();
