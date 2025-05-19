// src/pages/Checkout.js
import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { cart, setCart } = useCart();
  const navigate = useNavigate();

  const confirmPurchase = () => {
    alert("Thank you for your reservation!");
    setCart([]);
    navigate("/");
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="space-y-2">
            {cart.map(item => (
              <li key={item.id} className="flex justify-between border-b pb-2">
                <span>{item.title}</span>
                <span>€{item.price}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={confirmPurchase}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
          >
            Confirm Purchase
          </button>
        </>
      )}
    </div>
  );
}
