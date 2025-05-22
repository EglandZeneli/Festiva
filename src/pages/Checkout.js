import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../axiosConfig'               
import { useAuth } from '../context/AuthContext'

export default function Checkout() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [event, setEvent]       = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [error, setError]       = useState('')

  // Load the single event
  useEffect(() => {
    async function loadEvent() {
      try {
        const { data } = await API.get(`/events/${id}`)
        setEvent(data)
      } catch (err) {
        setError(err.response?.data?.error || err.message)
      }
    }
    loadEvent()
  }, [id])

  // Handle the purchase
  const handleBuy = async e => {
    e.preventDefault()
    if (!user) {
      return navigate('/login')
    }
    setError('')
    try {
      await API.post('/orders', {
        items: [{ eventId: event._id, quantity }]
      })
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || err.message)
    }
  }

  if (error) return <p className="text-red-500 p-4">Error: {error}</p>
  if (!event) return <p className="p-4">Loading…</p>

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">{event.title}</h2>
      <p className="mb-2">
        <strong>Date:</strong>{' '}
        {new Date(event.startDate).toLocaleDateString()}
      </p>
      <p className="mb-2">
        <strong>Price per ticket:</strong> ${event.price}
      </p>
      <p className="mb-4 text-gray-600">
        Tickets left: {event.ticketsAvailable}
      </p>

      <form onSubmit={handleBuy} className="space-y-4">
        <div>
          <label className="block mb-1">Quantity</label>
          <input
            type="number"
            min="1"
            max={event.ticketsAvailable}
            value={quantity}
            onChange={e => {
              let v = parseInt(e.target.value, 10) || 1
              v = Math.max(1, Math.min(v, event.ticketsAvailable))
              setQuantity(v)
            }}
            className="w-full border rounded px-2 py-1"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Buy {quantity} Ticket{quantity > 1 ? 's' : ''} (${(quantity * event.price).toFixed(2)})
        </button>
      </form>
    </div>
  )
}
