// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import PrivateRoute   from "./components/PrivateRoute";

import Navbar        from "./components/Navbar";
import Home          from "./pages/Home";
import Events        from "./pages/Events";
import CreateEvent   from "./pages/CreateEvent";
import Checkout      from "./pages/Checkout";
import Login         from "./pages/Login";
import Register      from "./pages/Register";  // <-- new

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Navbar />
          <Routes>
            {/* public */}
            <Route path="/"       element={<Home />} />
            <Route path="/login"  element={<Login />} />
            <Route path="/register" element={<Register />} />  {/* <-- new */}
            <Route path="/events" element={<Events />} />

            {/* protected */}
            <Route
              path="/checkout"
              element={
                <PrivateRoute>
                  <Checkout />
                </PrivateRoute>
              }
            />
            <Route
              path="/events/new"
              element={
                <PrivateRoute>
                  <CreateEvent />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
