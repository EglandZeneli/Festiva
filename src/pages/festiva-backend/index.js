const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let events = [
  {
    id: 1,
    title: "Rock Festival",
    date: "2025-06-15",
    location: "Tirana Arena",
    price: 20,
  },
  {
    id: 2,
    title: "Tech Conference",
    date: "2025-07-01",
    location: "Innovation Hub",
    price: 35,
  }
];

// GET all events
app.get('/events', (req, res) => {
  res.json(events);
});

// ✅ POST a new event
app.post('/events', (req, res) => {
  const { title, date, location, price } = req.body;

  // Basic validation
  if (!title || !date || !location || !price) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const newEvent = {
    id: events.length + 1,
    title,
    date,
    location,
    price
  };

  events.push(newEvent);

  res.status(201).json(newEvent); // Respond with the new event
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
