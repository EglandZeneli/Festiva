// src/components/Navbar.js
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { cart } = useCart();
  return (
    <nav className="bg-gradient-to-r from-purple-800 to-black p-4 flex justify-between items-center text-white shadow-md">
      <h1 className="text-3xl font-bold">Festiva</h1>
      <div className="space-x-6">
        <Link to="/">Home</Link>
        <Link to="/events">Events</Link>
        <Link to="/checkout">Checkout ({cart.length})</Link>
      </div>
    </nav>
  );
}
