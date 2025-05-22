// src/pages/Login.js
import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

// validation schema
const schema = yup
  .object({
    email: yup
      .string()
      .email('Please enter a valid email')
      .required('Email is required'),
    password: yup.string().required('Password is required'),
  })
  .required()

export default function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  })

  if (user) {
    // already logged in → redirect home
    return <Navigate to="/" replace />
  }

  const onSubmit = async (data) => {
    setServerError('')
    try {
      // Pass the data object directly to match AuthContext's login function
      await login(data)
      navigate('/')
    } catch (err) {
      setServerError(err.message || 'Login failed')
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold">Log In</h2>
      {serverError && <p className="text-red-500">{serverError}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          className="w-full bg-green-600 text-white p-2 rounded disabled:opacity-50"
        >
          {isSubmitting ? 'Logging in…' : 'Login'}
        </button>
      </form>
      <p className="text-center">
        Don't have an account?{' '}
        <Link to="/register" className="text-blue-400 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  )
}