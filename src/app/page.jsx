"use client";
import React from "react";
import {
  BedDouble,
  Users2,
  Wifi,
  Coffee,
  Waves,
  MapPin,
  Star,
} from "lucide-react";
import HeroCarousel from "./Components/HeroCarousel";

const rooms = [
  {
    id: 1,
    name: "Deluxe Room",
    price: 8500,
    capacity: 2,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945",
  },
  {
    id: 2,
    name: "Executive Suite",
    price: 14500,
    capacity: 4,
    image:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
  },
  {
    id: 3,
    name: "Family Room",
    price: 11000,
    capacity: 5,
    image:
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39",
  },
];

const HomePage = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center text-center px-6 text-white">
        <HeroCarousel />

        <div className="relative z-10 max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Experience Luxury & Comfort
          </h1>
          <p className="text-lg mb-8 text-gray-200">
            Book premium rooms with world-class amenities and unforgettable
            hospitality.
          </p>

          <div className="flex justify-center gap-4">
            <a
              href="/booking"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all"
            >
              Book a Room
            </a>
            <a
              href="#rooms"
              className="px-8 py-4 bg-white text-gray-900 font-bold rounded-xl shadow-lg hover:bg-gray-100 transition-all"
            >
              View Rooms
            </a>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { icon: <Wifi />, label: "Free Wi-Fi" },
          { icon: <Coffee />, label: "Breakfast Included" },
          { icon: <Waves />, label: "Swimming Pool" },
          { icon: <MapPin />, label: "Prime Location" },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow text-center"
          >
            <div className="text-blue-600 flex justify-center mb-3">
              {item.icon}
            </div>
            <h4 className="font-semibold text-gray-800">{item.label}</h4>
          </div>
        ))}
      </section>

      {/* ROOMS */}
      <section id="rooms" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
          Our Rooms
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-2xl shadow-xl overflow-hidden hover:scale-105 transition-transform"
            >
              <img
                src={room.image}
                alt={room.name}
                className="h-56 w-full object-cover"
              />

              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-bold text-gray-900">
                    {room.name}
                  </h3>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star size={16} fill="currentColor" />
                    4.8
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <span className="flex items-center gap-1">
                    <Users2 size={14} /> {room.capacity} Guests
                  </span>
                  <span className="flex items-center gap-1">
                    <BedDouble size={14} /> King Bed
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-blue-600">
                    Rs {room.price.toLocaleString()}/night
                  </span>
                  <a
                    href="/booking"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                  >
                    Book Now
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
