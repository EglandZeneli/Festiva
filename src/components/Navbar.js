// src/components/Navbar.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { cart }      = useCart();
  const { user, logout } = useAuth();
  const nav           = useNavigate();

  const handleLogout = () => {
    logout();
    nav("/");
  };

  return (
    <nav className="bg-gradient-to-r from-purple-800 to-black p-4 flex justify-between items-center text-white shadow-md">
      <h1 className="text-3xl font-bold">Festiva</h1>
      <div className="space-x-6 flex items-center">
        <Link to="/" className="hover:text-purple-300">Home</Link>
        <Link to="/events" className="hover:text-purple-300">Events</Link>
        <Link to="/checkout" className="hover:text-purple-300">
          Checkout ({cart.length})
        </Link>

        {!user ? (
          <>
            <Link to="/login" className="hover:text-purple-300">Log In</Link>
            <Link to="/register" className="ml-4 hover:text-purple-300">Sign Up</Link>
          </>
        ) : (
          <>
            <span className="font-medium">Hi, {user.username}</span>
            <button
              onClick={handleLogout}
              className="ml-2 underline hover:text-purple-300"
            >
              Log Out
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
