import { useState } from "react";
import mockEvents from "../data/mockEvents";

const Events = () => {
  const [events] = useState(mockEvents);
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((fav) => fav !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {events.map((event) => (
          <div key={event.id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{event.title}</h2>
            <p>{event.date} @ {event.location}</p>
            <p className="font-bold text-blue-600">${event.price}</p>
            <button
              onClick={() => toggleFavorite(event.id)}
              className={`mt-2 px-4 py-2 rounded ${
                favorites.includes(event.id)
                  ? "bg-red-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {favorites.includes(event.id) ? "Unfavorite" : "Favorite"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;
