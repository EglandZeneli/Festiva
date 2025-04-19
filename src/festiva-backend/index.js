// ✅ index.js (BACKEND)
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

let events = [
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

app.get('/events', (req, res) => {
  res.json(events);
});

app.post('/events', (req, res) => {
  const {
    title, category, startDate, endDate,
    location, imageUrl, price,
    ticketsAvailable, organizer, description
  } = req.body;

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

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
