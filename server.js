require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');

const { sequelize, User, Project, Task } = require('./database/setup');
const requireAuth = require('./middleware/auth');

const app = express();
app.use(express.json());

// SESSION MIDDLEWARE
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

// ------------------- REGISTER -------------------
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  const exists = await User.findOne({ where: { email } });
  if (exists) return res.status(400).json({ error: "Email already exists" });

  const hashed = await bcrypt.hash(password, 10);

  await User.create({ username, email, password: hashed });

  res.json({ message: "User registered!" });
});

// ------------------- LOGIN -------------------
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: "Invalid credentials" });

  req.session.userId = user.id;
  res.json({ message: "Login successful!" });
});

// ------------------- LOGOUT -------------------
app.post('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out!" });
  });
});

// ------------------- PROTECTED ROUTE -------------------
app.get('/api/projects', requireAuth, async (req, res) => {
  const projects = await Project.findAll({
    where: { userId: req.session.userId }
  });
  res.json(projects);
});

// ------------------- START SERVER -------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));
