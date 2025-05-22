// src/index.js
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import 'react-toastify/dist/ReactToastify.css'

// ← Add this so Tailwind & your custom CSS actually load
import './index.css'

import { ToastContainer } from 'react-toastify'

ReactDOM.render(
  <AuthProvider>
    <CartProvider>
      <App />
      <ToastContainer />
    </CartProvider>
  </AuthProvider>,
  document.getElementById('root')
)
