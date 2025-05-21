// Backend/index.js
require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');
const jwt      = require('jsonwebtoken');

// 1) Import Mongoose models from models/
const User  = require('./models/User');
const Event = require('./models/Events');

const app = express();
app.use(cors());
app.use(express.json());

// 2) Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// 3) JWT helper
function generateToken(user) {
  return jwt.sign(
    { userId: user._id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
}

// 4) Public routes: Register & Login
app.post('/auth/register', async (req, res) => {
  const { username, password, role = 'user' } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }
  if (await User.exists({ username })) {
    return res.status(409).json({ error: 'User already exists.' });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  await User.create({ username, passwordHash, role });
  res.status(201).json({ message: 'Registered successfully.' });
});

app.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ error: 'Invalid credentials.' });
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(401).json({ error: 'Invalid credentials.' });
  res.json({ token: generateToken(user) });
});

// 5) Middleware: protect routes
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header.' });
  }
  try {
    req.user = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
}

// 6) Event routes
// Public — get all events
app.get('/events', async (req, res) => {
  const events = await Event.find().sort({ startDate: 1 });
  res.json(events);
});

// Protected — create new event (admin/organizer only)
app.post('/events', authenticate, async (req, res) => {
  if (!['admin','organizer'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Insufficient permissions.' });
  }
  try {
    const newEvent = await Event.create(req.body);
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 7) Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend up at http://localhost:${PORT}`));
