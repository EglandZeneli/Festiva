// src/pages/Events.js
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from '../axiosConfig'
import { useAuth } from '../context/AuthContext'
import EventCard from '../components/EventCard'

export default function Events() {
  const [events, setEvents] = useState([])
  const [error, setError]   = useState('')
  const { user }            = useAuth()

  useEffect(() => {
    async function fetchEvents() {
      try {
        const { data } = await axios.get('/events')
          setEvents(data)            // data is your events array
      } catch (err) {
        setError(err.response?.data?.error || err.message)
      }
    }
    fetchEvents()
  }, [])

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Events</h1>
        {user && ['admin','organiser'].includes(user.role) && (
          <Link
            to="/events/new"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            New Event
          </Link>
        )}
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map(evt => (
          <EventCard key={evt._id} event={evt} />
        ))}
      </div>
    </div>
  )
}
