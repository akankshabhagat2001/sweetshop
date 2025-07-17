const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('./db');

const app = express();
const port = process.env.PORT || 3000;
const JWT_SECRET = 'supersecretjwtkey';

app.use(express.json());
app.use(express.static('public'));

// JWT authentication middleware
function requireAuth(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

// User registration
app.post('/auth/register', async(req, res) => {
    const { username, password } = req.body;
    const [rows] = await pool.query('SELECT * FROM users WHERE username=?', [username]);
    if (rows.length > 0) {
        return res.status(409).json({ error: 'Username already exists' });
    }
    const hash = bcrypt.hashSync(password, 10);
    await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash]);
    res.status(201).json({ username });
});

// User login
app.post('/auth/login', async(req, res) => {
    const { username, password } = req.body;
    const [rows] = await pool.query('SELECT * FROM users WHERE username=?', [username]);
    if (rows.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    const user = rows[0];
    if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

// Get all sweets
app.get('/sweets', async(req, res) => {
    const [rows] = await pool.query('SELECT * FROM sweets');
    res.json(rows);
});

// Add a sweet
app.post('/sweets', requireAuth, async(req, res) => {
    const { name, price, quantity, category } = req.body;
    const [maxIdRows] = await pool.query('SELECT MAX(id) as maxId FROM sweets');
    const nextId = (maxIdRows[0].maxId || 1000) + 1;
    await pool.query(
        'INSERT INTO sweets (id, name, category, price, quantity) VALUES (?, ?, ?, ?, ?)', [nextId, name, category, price, quantity]
    );
    res.status(201).json({ id: nextId, name, category, price, quantity });
});

// Update a sweet
app.put('/sweets/:id', requireAuth, async(req, res) => {
    const id = parseInt(req.params.id);
    const { name, price, quantity, category } = req.body;
    const [result] = await pool.query(
        'UPDATE sweets SET name=?, category=?, price=?, quantity=? WHERE id=?', [name, category, price, quantity, id]
    );
    if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Sweet not found' });
    }
    res.json({ id, name, category, price, quantity });
});

// Delete a sweet
app.delete('/sweets/:id', requireAuth, async(req, res) => {
    const id = parseInt(req.params.id);
    const [result] = await pool.query('DELETE FROM sweets WHERE id=?', [id]);
    if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Sweet not found' });
    }
    res.json({ success: true });
});

// Search sweets by name
app.get('/sweets/search', async(req, res) => {
    const q = req.query.q || '';
    const [rows] = await pool.query('SELECT * FROM sweets WHERE name LIKE ?', [`%${q}%`]);
    res.json(rows);
});

// Sort sweets by field
app.get('/sweets/sort', async(req, res) => {
    const field = req.query.field || 'name';
    const allowed = ['id', 'name', 'category', 'price', 'quantity'];
    if (!allowed.includes(field)) return res.status(400).json({ error: 'Invalid sort field' });
    const [rows] = await pool.query(`SELECT * FROM sweets ORDER BY ${field}`);
    res.json(rows);
});

app.listen(port, () => {
    console.log(`Sweet Shop API (MySQL) listening at http://localhost:${port}`);
});