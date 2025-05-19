// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Checkout from "./pages/Checkout";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/"      element={<Home />} />
        <Route path="/events"   element={<Events />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </Router>
  );
}
