const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const bcrypt = require('bcrypt'); // ✅ Added bcrypt for password hashing

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from 'frontend' folder
app.use(express.static(path.join(__dirname, 'frontend')));

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'your_username',
  password: 'your_password', 
  database: 'golden_fork'
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
  console.log('Connected to database.');
});

// Reservation API endpoint
app.post('/api/reservations', (req, res) => {
  const { name, email, phone, date, time, guests, 'special-requests': specialRequests } = req.body;

  const sql = `
    INSERT INTO reservations (name, email, phone, date, time, guests, special_requests)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [name, email, phone, date, time, guests, specialRequests];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting reservation:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json({ message: 'Reservation submitted successfully!' });
  });
});

// Contact form API endpoint
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;

  const sql = `
    INSERT INTO contacts (name, email, subject, message)
    VALUES (?, ?, ?, ?)
  `;
  const values = [name, email, subject, message];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting contact message:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json({ message: 'Message sent successfully!' });
  });
});

// Route to serve index.html at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// ✅ Signup with hashed password
app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // 10 = salt rounds

    const sql = `
      INSERT INTO users (name, email, password)
      VALUES (?, ?, ?)
    `;
    const values = [name, email, hashedPassword];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error inserting user:', err);
        return res.status(500).json({ message: 'Database error' });
      }
      res.json({ message: 'User registered successfully!' });
    });
  } catch (err) {
    console.error('Hashing error:', err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// ✅ Login with hashed password check
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const sql = `SELECT * FROM users WHERE email = ?`;
  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error('Login error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({ message: 'Login successful', email: user.email });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
