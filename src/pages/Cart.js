// src/pages/Cart.js
import React from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../axiosConfig'         // your configured axios instance
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { toast } from 'react-toastify'

export default function Cart() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { items, updateQuantity, clearCart } = useCart()

  // Compute total
  const total = items.reduce(
    (sum, i) => sum + i.quantity * i.event.price,
    0
  )

  const handlePlaceOrder = async () => {
    // If not logged in, send them to login
    if (!user) {
      return navigate('/login')
    }

    try {
      await API.post('/orders', {
        items: items.map(i => ({
          eventId:  i.event._id,
          quantity: i.quantity
        }))
      })
      toast.success('Order placed! Confirmation email sent.')
      clearCart()
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.error || err.message)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400">Your cart is empty.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-md mx-auto">
        <h2 className="text-white text-2xl font-semibold mb-6">Your Cart</h2>

        {items.map(i => (
          <div
            key={i.event._id}
            className="border border-white rounded px-5 py-4 mb-4 bg-gray-800"
          >
            <p className="text-white font-medium mb-1">
              {i.event.title}
            </p>
            <p className="text-gray-400 mb-2">
              ${i.event.price} each
            </p>

            <div className="flex items-center space-x-2 mb-2">
              <label className="text-gray-300">Qty:</label>
              <input
                type="number"
                min="1"
                max={i.event.ticketsAvailable}
                value={i.quantity}
                onChange={e =>
                  updateQuantity(
                    i.event._id,
                    Math.max(
                      1,
                      Math.min(
                        i.event.ticketsAvailable,
                        parseInt(e.target.value, 10) || 1
                      )
                    )
                  )
                }
                className="w-16 text-black px-2 py-1 rounded"
              />
            </div>

            <p className="text-white">
              Subtotal: ${(i.quantity * i.event.price).toFixed(2)}
            </p>
          </div>
        ))}

        <div className="text-white font-bold text-lg mb-4">
          Total: ${total.toFixed(2)}
        </div>

        <button
          onClick={handlePlaceOrder}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded"
        >
          Place Order
        </button>
      </div>
    </div>
  )
}
