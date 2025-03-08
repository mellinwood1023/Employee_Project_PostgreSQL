import express from 'express';
import { QueryResult } from 'pg';
import { pool, connectToDb } from './connection.js';


await connectToDb();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/employees', async (req, res) => {
    const pool = new Pool();
    const result = await pool.query('SELECT * FROM employees');
    res.send(result.rows);
});

app.get('/employees/:id', async (req, res) => {
    const pool = new Pool();
    const result = await pool.query('SELECT * FROM employees WHERE id = $1', [req.params.id]);
    res.send(result.rows);
});

app.post('/employees', async (req, res) => {
    const pool = new Pool();
    const result = await pool.query('INSERT INTO employees (name, age, salary) VALUES ($1, $2, $3)', [req.body.name, req.body.age, req.body.salary]);
    res.send(result.rows);
});

app.use((req, res) => {
    res.status(404).send('Not Found');
});

app.listen(port, () => {    
    console.log(`Server is running on port ${port}`);
});

