// src/pages/CreateEvent.js
import React, { useState } from 'react';
import axios from 'axios';                    // ← use axios directly
import { useNavigate } from 'react-router-dom';

export default function CreateEvent() {
  const [form, setForm]   = useState({
    title: '',
    category: '',
    startDate: '',
    endDate: '',
    location: '',
    imageUrl: '',
    price: '',
    ticketsAvailable: '',
    organizer: '',
    description: ''
  });
  const [error, setError] = useState('');
  const navigate          = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // Because you set "proxy" in package.json to http://localhost:5000
      await axios.post('/events', {
        ...form,
        price: Number(form.price),
        ticketsAvailable: Number(form.ticketsAvailable)
      });
      navigate('/events');
    } catch (err) {
      setError(err.response?.data?.error || 'Could not create event');
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h2 className="text-2xl mb-4">Create New Event</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.keys(form).map(key => (
          <div key={key}>
            <label className="block font-medium capitalize">{key}</label>
            <input
              name={key}
              value={form[key]}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              type={
                key === 'price' || key === 'ticketsAvailable' 
                  ? 'number' 
                  : key.includes('Date') 
                    ? 'date' 
                    : 'text'
              }
            />
          </div>
        ))}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Event
        </button>
      </form>
    </div>
  );
}
