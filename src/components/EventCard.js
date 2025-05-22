import React from 'react'
import { useCart } from '../context/CartContext'

export default function EventCard({ event }) {
  const { addToCart } = useCart()
  return (
    <div className="border rounded overflow-hidden shadow hover:shadow-lg transition">
      {event.imageUrl && (
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-40 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold">{event.title}</h3>
        <p className="text-sm text-gray-600">{event.category}</p>
        <p className="text-sm">
          {new Date(event.startDate).toLocaleDateString()}
          {event.endDate && ` – ${new Date(event.endDate).toLocaleDateString()}`}
        </p>
        <p className="mt-2">{event.location}</p>
        <p className="mt-1 font-bold">${event.price}</p>
        <p className="text-sm">{event.ticketsAvailable} tickets left</p>
        {event.organizer && (
          <p className="text-sm italic">By {event.organizer}</p>
        )}
        <button
          onClick={() => addToCart(event, 1)}
          className="mt-3 w-full bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}
