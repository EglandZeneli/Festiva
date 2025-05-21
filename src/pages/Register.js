// src/pages/Register.js
import { useState } from 'react'
import axios from "axios";
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const [form, setForm] = useState({ username:'', password:'' })
  const [error, setError] = useState('')
  const nav = useNavigate()

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      await axios.post('/auth/register', form)
      nav('/login')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    }
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-2xl mb-4">Sign Up</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Username"
          className="block w-full border p-2"
          required
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="block w-full border p-2"
          required
        />
        <button
          type="submit"
          className="bg-purple-700 text-white px-4 py-2 rounded"
        >
          Register
        </button>
      </form>
    </div>
  )
}
