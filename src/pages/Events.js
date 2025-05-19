// src/pages/Events.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";

export default function Events() {
  const { cart, setCart } = useCart();
  const [events, setEvents]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    axios.get("/events")
      .then(res => {
        setEvents(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Could not load events.");
        setLoading(false);
      });
  }, []);

  const addToCart = ev => {
    if (!cart.some(i => i.id === ev.id)) {
      setCart([...cart, ev]);
    }
  };

  if (loading) return <p className="p-8 text-white">Loading events…</p>;
  if (error)   return <p className="p-8 text-red-500">{error}</p>;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 p-8">
      {events.map(ev => (
        <div key={ev.id} className="border rounded shadow p-4">
          <h3 className="text-xl font-bold">{ev.title}</h3>
          <p>
            {ev.startDate}
            {ev.endDate ? ` – ${ev.endDate}` : ""}
            {" @ "}{ev.location}
          </p>
          <p className="font-semibold">€{ev.price}</p>
          <button
            onClick={() => addToCart(ev)}
            disabled={cart.some(i => i.id === ev.id)}
            className="mt-2 bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
          >
            {cart.some(i => i.id === ev.id) ? "In Cart" : "Add to Cart"}
          </button>
        </div>
      ))}
    </div>
  );
}
