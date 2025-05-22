// src/pages/Register.js
import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

// validation schema
const schema = yup
  .object({
    username: yup.string().required('Username is required'),
    email: yup.string().email('Enter a valid email').required('Email is required'),
    password: yup
      .string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  })
  .required()

export default function Register() {
  const { user, register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(schema),
  })

  // If already logged in, redirect home
  if (user) {
    return <Navigate to="/" replace />
  }

  const onSubmit = async (data) => {
    setServerError('')
    try {
      // Pass the data object directly
      await registerUser(data)
      navigate('/')
    } catch (err) {
      setServerError(err.message || 'Registration failed')
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold">Create Account</h2>
      {serverError && <p className="text-red-500">{serverError}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            {...register('username')}
            name="username"
            placeholder="Username"
            className="w-full border p-2 rounded text-black"
          />
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username.message}</p>
          )}
        </div>

        <div>
          <input
            {...register('email')}
            name="email"
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded text-black"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div>
          <input
            {...register('password')}
            name="password"
            type="password"
            placeholder="Password"
            className="w-full border p-2 rounded text-black"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50"
        >
          {isSubmitting ? 'Registering…' : 'Register'}
        </button>
      </form>

      <p className="text-center">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-400 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  )
}