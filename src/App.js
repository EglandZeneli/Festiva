import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar        from './components/Navbar'
import Home          from './pages/Home'
import Events        from './pages/Events'
import Login         from './pages/Login'
import Register      from './pages/Register'
import CreateEvent   from './pages/CreateEvent'
import Checkout      from './pages/Checkout'
import Cart          from './pages/Cart'
import PrivateRoute  from './components/PrivateRoute'

export default function App() {
  return (
    <BrowserRouter>
      {/* Nav is now rendered on every page */}
      <Navbar />

      <Routes>
        {/* Landing page */}
        <Route path="/" element={<Home />} />

        {/* Authentication */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Public listing */}
        <Route path="/events" element={<Events />} />

        {/* Only admin/organiser */}
        <Route
          path="/events/new"
          element={
            <PrivateRoute roles={['admin','organiser']}>
              <CreateEvent />
            </PrivateRoute>
          }
        />

        {/* Cart & Checkout (user must be logged in) */}
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          }
        />
        <Route
          path="/checkout/:id"
          element={
            <PrivateRoute>
              <Checkout />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
