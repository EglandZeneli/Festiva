// src/pages/CreateEvent.js
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useNavigate } from 'react-router-dom'
import axios from '../axiosConfig'
import { useAuth } from '../context/AuthContext'

const schema = yup.object({
  title:            yup.string().required(),
  category:         yup.string().required(),
  startDate:        yup.date().required(),
  endDate:          yup.date().min(yup.ref('startDate'), 'End must be after start').nullable(),
  location:         yup.string().required(),
  imageUrl:         yup.string().url('Must be a URL').nullable(),
  price:            yup.number().positive().required(),
  ticketsAvailable: yup.number().integer().positive().required(),
  organizer:        yup.string().nullable(),
  description:      yup.string().nullable(),
});

export default function CreateEvent() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const { register, handleSubmit, formState:{ errors, isSubmitting }} = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async data => {
    try {
      const res = await axios.post('/events', data, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (res.data.success) navigate('/events');
      else setError(res.data.error);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const fields = [
    { name:'title',           label:'Title',           type:'text' },
    { name:'category',        label:'Category',        type:'text' },
    { name:'startDate',       label:'Start Date',      type:'date' },
    { name:'endDate',         label:'End Date',        type:'date' },
    { name:'location',        label:'Location',        type:'text' },
    { name:'imageUrl',        label:'Image URL',       type:'url' },
    { name:'price',           label:'Price',           type:'number' },
    { name:'ticketsAvailable',label:'Tickets Available', type:'number' },
    { name:'organizer',       label:'Organizer',       type:'text' },
  ];

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Create Event</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {fields.map(f => (
          <div key={f.name}>
            <label className="block mb-1">{f.label}</label>
            <input
              type={f.type}
              {...register(f.name)}
              className="w-full border rounded px-2 py-1"
            />
            {errors[f.name] && <p className="text-red-500 text-sm">{errors[f.name].message}</p>}
          </div>
        ))}

        <div>
          <label className="block mb-1">Description</label>
          <textarea
            {...register('description')}
            className="w-full border rounded px-2 py-1"
            rows={4}
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
        >
          {isSubmitting ? 'Creating…' : 'Create Event'}
        </button>
      </form>
    </div>
  );
}
