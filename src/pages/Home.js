// src/pages/Home.js
import React from "react";
import { Sparkles, Mic, Music } from "lucide-react";
import "../index.css"; // global Tailwind + custom styles

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background image */}
      <img
        src="/background.jpg"
        alt="Festival"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900 to-blue-900 opacity-80 z-0" />

      {/* Animated icons for flair */}
      <div className="absolute left-10 top-20 animate-spin-slow text-purple-400 opacity-40">
        <Mic size={100} strokeWidth={1.2} />
      </div>
      <div className="absolute right-10 bottom-10 animate-bounce text-blue-400 opacity-30">
        <Music size={80} strokeWidth={1.5} />
      </div>
      <div className="absolute right-10 top-10 animate-bounce text-purple-300">
        <Sparkles size={60} strokeWidth={1.5} />
      </div>

      {/* Hero content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6 text-white">
        <h1 className="text-6xl md:text-7xl font-extrabold uppercase leading-tight tracking-wider drop-shadow-2xl animate-fade-in">
          The <span className="text-purple-400">Ultimate</span> Festival Experience
        </h1>
        <p className="mt-6 text-xl max-w-3xl text-white/90">
          Lights. Bass. Madness. Dive into a universe of music, color and energy.
          Your next unforgettable memory starts here.
        </p>
        <div className="mt-10 flex flex-wrap gap-6">
          <button className="bg-purple-700 hover:bg-purple-900 text-white px-8 py-4 rounded-full text-xl font-bold shadow-lg transition transform hover:scale-105">
            Buy Tickets
          </button>
          <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 rounded-full text-xl font-bold transition transform hover:scale-105">
            Explore More
          </button>
        </div>
      </div>
    </div>
  );
}
