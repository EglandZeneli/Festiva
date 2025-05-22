
import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { toast } from 'react-toastify'    

export default function Navbar() {
  const { user, logout } = useAuth()
  const { items = [] } = useCart()
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0)

  // ← wrap logout in a toast
  const handleLogout = () => {
    logout()
    toast.info('You have been logged out.') 
  }

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-2xl font-bold hover:underline">
            Festiva
          </Link>
          {user && (
            <div className="flex items-center space-x-2">
              <span className="text-lg text-gray-300">Hello,</span>
              <span className="text-lg font-semibold text-white">
                {user.username}
              </span>
              {user.role && (
                <span className="text-xs bg-blue-500 px-2 py-1 rounded-full">
                  {user.role}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/" className="hover:underline hover:text-gray-300">
            Home
          </Link>
          <Link to="/events" className="hover:underline hover:text-gray-300">
            Events
          </Link>
          {user && ['admin','organiser'].includes(user.role) && (
            <Link to="/events/new" className="hover:underline hover:text-gray-300">
              New Event
            </Link>
          )}
          {user ? (
            <button 
              onClick={handleLogout}             // ← use the wrapped handler
              className="hover:underline hover:text-gray-300"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className="hover:underline hover:text-gray-300">
              Login
            </Link>
          )}
          <Link to="/cart" className="relative hover:underline hover:text-gray-300">
            <svg
              className="w-6 h-6 inline-block"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4"></path>
              <circle cx="7" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  )
}
