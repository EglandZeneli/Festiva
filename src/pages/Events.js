import { useState, useEffect } from "react";
import axios from "axios";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");

  // State for new event form
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    location: "",
    price: ""
  });

  // Fetch events on load
  useEffect(() => {
    axios.get("http://localhost:5000/events")
      .then((res) => setEvents(res.data))
      .catch((err) => {
        console.error(err);
        setError("Could not load events.");
      });
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic form validation
    if (!newEvent.title || !newEvent.date || !newEvent.location || !newEvent.price) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/events", {
        ...newEvent,
        price: parseFloat(newEvent.price)
      });

      // Update list instantly
      setEvents([...events, res.data]);

      // Clear form and error
      setNewEvent({ title: "", date: "", location: "", price: "" });
      setError("");

    } catch (err) {
      console.error(err);
      setError("Failed to create event.");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>

      {/* Error feedback */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Create Event Form */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Event title"
          value={newEvent.title}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          type="date"
          name="date"
          placeholder="Event date"
          value={newEvent.date}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          type="text"
          name="location"
          placeholder="Event location"
          value={newEvent.location}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={newEvent.price}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Event
        </button>
      </form>

      {/* Events list */}
      <div className="grid gap-6 md:grid-cols-2">
        {events.map((event) => (
          <div key={event.id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{event.title}</h2>
            <p>{event.date} @ {event.location}</p>
            <p className="font-bold text-blue-600">${event.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;
