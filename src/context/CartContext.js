import React, { createContext, useContext, useState } from 'react'

const CartContext = createContext({
  items: [],
  addToCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {}
})

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  // Add or bump quantity
  function addToCart(event, qty = 1) {
    setItems(prev => {
      const found = prev.find(i => i.event._id === event._id)
      if (found) {
        return prev.map(i =>
          i.event._id === event._id
            ? {
                ...i,
                quantity: Math.min(i.quantity + qty, event.ticketsAvailable)
              }
            : i
        )
      }
      return [...prev, { event, quantity: qty }]
    })
  }

  // Set exact quantity (remove if 0)
  function updateQuantity(eventId, qty) {
    setItems(prev =>
      prev
        .map(i =>
          i.event._id === eventId
            ? { ...i, quantity: Math.min(Math.max(qty, 0), i.event.ticketsAvailable) }
            : i
        )
        .filter(i => i.quantity > 0)
    )
  }

  // Empty cart
  function clearCart() {
    setItems([])
  }

  return (
    <CartContext.Provider value={{ items, addToCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
