// index.js (Backend)
require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const bcrypt   = require('bcrypt');
const jwt      = require('jsonwebtoken');

const app      = express();
app.use(cors());
app.use(express.json());

// In-memory “databases”
const users = [];   // { id, username, passwordHash, role }
let   events = [
  {
    id: 1,
    title: "Sunset Music Festival",
    category: "Concert",
    startDate: "2025-06-20",
    endDate: "2025-06-21",
    location: "Tirana Lake Park",
    imageUrl: "https://yourdomain.com/images/sunset.jpg",
    price: 25,
    ticketsAvailable: 200,
    organizer: "WOW Albania",
    description: "A 2-day music festival featuring top artists and DJs."
  },
  {
    id: 2,
    title: "Albanian Tech Expo",
    category: "Conference",
    startDate: "2025-07-15",
    endDate: "2025-07-17",
    location: "Tirana Congress Center",
    imageUrl: "https://yourdomain.com/images/tech-expo.jpg",
    price: 15,
    ticketsAvailable: 100,
    organizer: "TechAl",
    description: "Explore the future of tech in Albania with keynotes and live demos."
  }
];

/**
 * Helper: generate JWT for a user payload
 */
function generateToken(user) {
  return jwt.sign(
    { userId: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
}

/**
 * PUBLIC - Register new user
 */
app.post('/auth/register', async (req, res) => {
  const { username, password, role = 'user' } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }
  // prevent duplicate
  if (users.find(u => u.username === username)) {
    return res.status(409).json({ error: 'User already exists.' });
  }
  // hash & store
  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = { id: users.length + 1, username, passwordHash, role };
  users.push(newUser);
  res.status(201).json({ message: 'Registered successfully.' });
});

/**
 * PUBLIC - Login, returns JWT
 */
app.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: 'Invalid credentials.' });

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(401).json({ error: 'Invalid credentials.' });

  const token = generateToken(user);
  res.json({ token });
});

/**
 * MIDDLEWARE - Protect routes
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
}

/**
 * PUBLIC - Get all events
 */
app.get('/events', (req, res) => {
  res.json(events);
});

/**
 * PROTECTED - Create a new event
 * Only users with role 'admin' or 'organizer'
 */
app.post('/events', authenticate, (req, res) => {
  const { role } = req.user;
  if (!['admin', 'organizer'].includes(role)) {
    return res.status(403).json({ error: 'Insufficient permissions.' });
  }

  const {
    title, category, startDate, endDate,
    location, imageUrl, price,
    ticketsAvailable, organizer, description
  } = req.body;

  // simple validation
  if (!title || !category || !startDate || !location || !price || !ticketsAvailable) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const newEvent = {
    id: events.length + 1,
    title,
    category,
    startDate,
    endDate,
    location,
    imageUrl,
    price,
    ticketsAvailable,
    organizer,
    description
  };

  events.push(newEvent);
  res.status(201).json(newEvent);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
