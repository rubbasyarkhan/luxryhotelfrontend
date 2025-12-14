"use client";

import React, { useState, useEffect } from "react";
import {
  BedDouble,
  Calendar,
  Users2,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Info
} from "lucide-react";

const BookingForm = () => {
  const [rooms, setRooms] = useState([]);
  const [userid, setUserid] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [bookingStep, setBookingStep] = useState(1);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const [formData, setFormData] = useState({
    guest: "",
    room: "",
    checkInDate: "",
    checkOutDate: "",
    numberOfGuests: 1,
    specialRequests: "",
    paymentMode: "Online",
    totalAmount: 0
  });

  /* -------------------- Toast -------------------- */
  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 4000);
  };

  /* -------------------- Auth Init -------------------- */
  useEffect(() => {
    try {
      const auth = JSON.parse(localStorage.getItem("authState"));
      if (auth?.user?.id && auth?.token) {
        setUserid(auth.user.id);
        setToken(auth.token);
        setFormData(prev => ({ ...prev, guest: auth.user.id }));
      } else {
        showToast("Please login to continue", "error");
      }
    } catch {
      showToast("Authentication error", "error");
    } finally {
      setAuthLoading(false);
    }
  }, []);

  /* -------------------- Fetch Rooms -------------------- */
  const fetchRooms = async () => {
    if (!formData.checkInDate || !formData.checkOutDate) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        guests: formData.numberOfGuests.toString()
      });

      const res = await fetch(
        `http://localhost:3001/api/rooms/available?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const data = await res.json();
      setRooms(Array.isArray(data.rooms) ? data.rooms : []);
    } catch {
      showToast("Failed to load rooms", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchRooms();
  }, [
    token,
    formData.checkInDate,
    formData.checkOutDate,
    formData.numberOfGuests
  ]);

  /* -------------------- Price Calculation -------------------- */
  useEffect(() => {
    const room = rooms.find(r => r._id === formData.room);
    if (!room || !formData.checkInDate || !formData.checkOutDate) return;

    const nights =
      (new Date(formData.checkOutDate) - new Date(formData.checkInDate)) /
      (1000 * 60 * 60 * 24);

    setFormData(prev => ({
      ...prev,
      totalAmount: Math.ceil(nights) * room.pricePerNight
    }));
  }, [formData.room, formData.checkInDate, formData.checkOutDate, rooms]);

  const handleChange = (field, value) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  /* -------------------- Submit -------------------- */
  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.room) {
      showToast("Please select a room", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost:3001/api/bookings/guest-book",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            ...formData,
            bookingNumber: Math.floor(1000 + Math.random() * 9000),
            paymentStatus: "Pending"
          })
        }
      );

      if (!res.ok) throw new Error("Booking failed");
      showToast("Booking successful!", "success");
      setBookingStep(3);
    } catch {
      showToast("Booking error", "error");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <div className="text-center p-10">Loading...</div>;
  }

  const selectedRoom = rooms.find(r => r._id === formData.room);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      {/* Toast */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white font-medium z-50 animate-fade-in
          ${
            toast.type === "error"
              ? "bg-red-500"
              : toast.type === "success"
              ? "bg-green-500"
              : toast.type === "warning"
              ? "bg-yellow-500"
              : "bg-blue-500"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
          Book Your Stay
        </h1>
        <p className="text-center text-gray-600 mb-8">Find your perfect room and reserve it today</p>

        {bookingStep === 3 ? (
          <div className="bg-white p-10 rounded-xl shadow-lg text-center">
            <CheckCircle size={64} className="mx-auto text-green-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Booking Confirmed!
            </h2>
            <p className="text-gray-600">Your reservation has been successfully created.</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-lg p-8 space-y-6"
          >
            {/* Date and Guest Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="text-blue-600" size={20} />
                Select Dates & Guests
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-800"
                    value={formData.checkInDate}
                    onChange={e => handleChange("checkInDate", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-800"
                    value={formData.checkOutDate}
                    onChange={e => handleChange("checkOutDate", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Guests
                  </label>
                  <select
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-800 bg-white"
                    value={formData.numberOfGuests}
                    onChange={e =>
                      handleChange("numberOfGuests", Number(e.target.value))
                    }
                  >
                    {[1, 2, 3, 4, 5, 6].map(n => (
                      <option key={n} value={n}>
                        {n} Guest{n > 1 && "s"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Available Rooms */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <BedDouble className="text-blue-600" size={20} />
                Available Rooms
              </h3>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="text-gray-600 mt-2">Loading available rooms...</p>
                </div>
              ) : rooms.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <AlertCircle className="mx-auto text-gray-400 mb-2" size={32} />
                  <p className="text-gray-600">No rooms available for selected dates</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {rooms.map(room => (
                    <label
                      key={room._id}
                      className={`block border-2 p-5 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        formData.room === room._id
                          ? "border-blue-600 bg-blue-50 shadow-md"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <input
                          type="radio"
                          name="room"
                          className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                          value={room._id}
                          onChange={e => handleChange("room", e.target.value)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-gray-800 text-lg">
                              Room {room.roomNumber}
                            </span>
                            <span className="text-blue-600 font-bold text-lg">
                              Rs {room.pricePerNight}
                              <span className="text-sm text-gray-500 font-normal">/night</span>
                            </span>
                          </div>
                          {room.type && (
                            <span className="text-sm text-gray-600">{room.type}</span>
                          )}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Total Amount */}
            {selectedRoom && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-2 border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                    <p className="text-3xl font-bold text-gray-800">
                      Rs {formData.totalAmount.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {Math.ceil(
                        (new Date(formData.checkOutDate) - new Date(formData.checkInDate)) /
                        (1000 * 60 * 60 * 24)
                      )}{" "}
                      night(s) × Rs {selectedRoom.pricePerNight}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !formData.room}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  Confirm Booking
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookingForm;