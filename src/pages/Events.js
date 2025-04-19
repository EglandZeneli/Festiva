// ✅ Events.js (FRONTEND)
import { useState, useEffect } from "react";
import axios from "axios";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  const [newEvent, setNewEvent] = useState({
    title: "",
    category: "",
    startDate: "",
    endDate: "",
    location: "",
    imageUrl: "",
    price: "",
    ticketsAvailable: "",
    organizer: "",
    description: ""
  });

  useEffect(() => {
    axios.get("http://localhost:5000/events")
      .then((res) => setEvents(res.data))
      .catch((err) => {
        console.error(err);
        setError("Could not load events.");
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await axios.post("http://localhost:5000/events", {
        ...newEvent,
        price: parseFloat(newEvent.price),
        ticketsAvailable: parseInt(newEvent.ticketsAvailable)
      });
      setEvents([...events, res.data]);
      setNewEvent({
        title: "",
        category: "",
        startDate: "",
        endDate: "",
        location: "",
        imageUrl: "",
        price: "",
        ticketsAvailable: "",
        organizer: "",
        description: ""
      });
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to create event.");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newEvent.title.trim()) newErrors.title = "Title is required";
    if (!newEvent.category) newErrors.category = "Category is required";
    if (!newEvent.startDate) newErrors.startDate = "Start date is required";
    if (!newEvent.location.trim()) newErrors.location = "Location is required";
    if (!newEvent.price || isNaN(newEvent.price) || Number(newEvent.price) <= 0) newErrors.price = "Price must be valid";
    if (!newEvent.ticketsAvailable || isNaN(newEvent.ticketsAvailable)) newErrors.ticketsAvailable = "Valid ticket count required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Create New Event</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="grid gap-4 mb-10">
        {Object.keys(newEvent).map((key) => (
          <div key={key}>
            {key === "description" ? (
              <textarea
                name={key}
                placeholder={key}
                value={newEvent[key]}
                onChange={handleChange}
                className={`border p-2 w-full ${errors[key] ? 'border-red-500' : ''}`}
              />
            ) : (
              <input
                type={key.includes("Date") ? "date" : key === "price" || key === "ticketsAvailable" ? "number" : "text"}
                name={key}
                placeholder={key}
                value={newEvent[key]}
                onChange={handleChange}
                className={`border p-2 w-full ${errors[key] ? 'border-red-500' : ''}`}
              />
            )}
            {errors[key] && <p className="text-red-500 text-sm">{errors[key]}</p>}
          </div>
        ))}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Event
        </button>
      </form>

      <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {events.map((event) => (
          <div key={event.id} className="border p-4 rounded shadow bg-white">
            <img src={event.imageUrl} alt={event.title} className="h-48 w-full object-cover rounded mb-2" />
            <p className="text-sm text-gray-500">{event.category}</p>
            <h2 className="text-xl font-bold mb-1">{event.title}</h2>
            <p className="text-sm">{event.startDate} – {event.endDate}</p>
            <p className="text-sm mb-1">{event.location}</p>
            <p className="text-blue-600 font-bold">${event.price}</p>
            <p className="text-sm">Tickets left: {event.ticketsAvailable}</p>
            <p className="text-sm italic text-gray-600">{event.description}</p>
            <p className="text-xs mt-2">Organized by: {event.organizer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;
