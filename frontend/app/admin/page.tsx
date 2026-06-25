"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BookingChart from "../../components/BookingChart";
import { saveAs } from "file-saver";

export default function AdminPage() {
  const router = useRouter();
  
  const [bookings, setBookings] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [prediction, setPrediction] = useState({
  expectedSeats: 0,
  occupancy: 0,
  confidence: 0,
});

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      const res = await fetch("https://smart-cafe-ai-1.onrender.com/bookings");
      const data = await res.json();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const fetchOrders = async () => {
  try {
    const res = await fetch("https://smart-cafe-ai-1.onrender.com/orders");
    const data = await res.json();
    setOrders(data);
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
};

const deleteOrder = async (id: string) => {
  try {
    await fetch(`https://smart-cafe-ai-1.onrender.com/order/${id}`, {
      method: "DELETE",
    });

    fetchOrders();
  } catch (error) {
    console.error("Error deleting order:", error);
  }
};
const fetchContacts = async () => {
  try {
    const res = await fetch("https://smart-cafe-ai-1.onrender.com/contacts");
    const data = await res.json();
    setContacts(data);
  } catch (error) {
    console.error("Error fetching contacts:", error);
  }
};
const deleteContact = async (id: string) => {
  try {
    await fetch(`https://smart-cafe-ai-1.onrender.com/contact/${id}`, {
      method: "DELETE",
    });

    fetchContacts();
  } catch (error) {
    console.error("Error deleting contact:", error);
  }
};

  // Delete booking
  const deleteBooking = async (id: string) => {
    try {
      await fetch(`https://smart-cafe-ai-1.onrender.com/booking/${id}`, {
        method: "DELETE",
      });

      fetchBookings();
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  // Export CSV
 const exportCSV = () => {
  const headers = [
    "Name",
    "Mobile",
    "Email",
    "Date",
    "Time",
    "Seats",
  ];

  const rows = bookings.map((booking) => [
    booking.name || "",
    `="${booking.mobile || ""}"`,
    booking.email || "",
    booking.date || "",
    booking.time || "",
    booking.seats || 0,
  ]);

  const csvContent =
    headers.join(",") +
    "\n" +
    rows.map((row) => row.join(",")).join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  saveAs(blob, "bookings.csv");
};
  useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    router.push("/login");
    return;
  }

  fetchBookings();
  fetchOrders();
  fetchContacts();
  const fetchPrediction = async () => {
  const res = await fetch("https://smart-cafe-ai-1.onrender.com/prediction");
  const data = await res.json();
  setPrediction(data);
};

fetchPrediction();
}, [router]);

  const totalBookings = bookings.length;

 const bookedSeats = bookings.reduce(
  (total, booking) => total + Number(booking.seats || 0),
  0
);

  const totalSeats = 50;
  const availableSeats = totalSeats - bookedSeats;
  const revenue = bookedSeats * 100;
  const totalOrders = orders.length;
  const totalMessages = contacts.length;

  return (
    <main className="min-h-screen bg-black text-white p-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-5xl font-bold text-amber-400">
          Booking Management
        </h1>

        <div className="flex gap-3">
          <button
            onClick={exportCSV}
            className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg font-semibold"
          >
            Export CSV
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              router.push("/login");
            }}
            className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg font-semibold"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Analytics Chart */}
      <div className="mb-10">
        <BookingChart />
      </div>

      {/* Dashboard Cards */}
        
<div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-10">
        <div className="bg-zinc-900 p-6 rounded-xl">
          <h3 className="text-zinc-400">Total Bookings</h3>
          <p className="text-4xl font-bold text-amber-400">
            {totalBookings}
          </p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-xl">
          <h3 className="text-zinc-400">Booked Seats</h3>
          <p className="text-4xl font-bold text-green-400">
            {bookedSeats}
          </p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-xl">
          <h3 className="text-zinc-400">Available Seats</h3>
          <p className="text-4xl font-bold text-blue-400">
            {availableSeats}
          </p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-xl">
          <h3 className="text-zinc-400">Revenue</h3>
          <p className="text-4xl font-bold text-purple-400">
            ₹{revenue}
          </p>
        </div>
        <div className="bg-zinc-900 p-6 rounded-xl">
  <h3 className="text-zinc-400">Total Orders</h3>
  <p className="text-4xl font-bold text-orange-400">
    {totalOrders}
  </p>
</div>

<div className="bg-zinc-900 p-6 rounded-xl">
  <h3 className="text-zinc-400">Messages</h3>
  <p className="text-4xl font-bold text-pink-400">
    {totalMessages}
  </p>
</div>
      </div>

      <div className="bg-zinc-900 p-6 rounded-xl mb-10 border border-zinc-700">
  <h2 className="text-3xl font-bold text-amber-400 mb-4">
    AI Occupancy Prediction
  </h2>

  <div className="space-y-3 text-xl">
    <p>
      Expected Seats:
      <span className="text-green-400 ml-2">
        {prediction.expectedSeats}/50
      </span>
    </p>

    <p>
      Occupancy:
      <span className="text-blue-400 ml-2">
        {prediction.occupancy}%
      </span>
    </p>

    <p>
      Confidence:
      <span className="text-purple-400 ml-2">
        {prediction.confidence}%
      </span>
    </p>
  </div>
</div>

      {/* Booking Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-zinc-700">
          <thead>
            <tr className="bg-zinc-900">
              <th className="p-3">Name</th>
              <th className="p-3">Mobile</th>
              <th className="p-3">Email</th>
              <th className="p-3">Date</th>
              <th className="p-3">Time</th>
              <th className="p-3">Seats</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking) => (
              <tr
                key={booking._id}
                className="border-t border-zinc-700 text-center"
              >
                <td className="p-3">{booking.name}</td>
               <td className="p-3">{booking.mobile || "-"}</td>
               <td className="p-3">{booking.email || "-"}</td>
                <td className="p-3">{booking.date
                ? new Date(booking.date).toLocaleDateString()
                : "-"}
                </td>
                <td className="p-3">{booking.time}</td>
                <td className="p-3">{booking.seats}</td>

                <td className="p-3">
                  <button
                    onClick={() => deleteBooking(booking._id)}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2 className="text-3xl font-bold text-amber-400 mt-12 mb-4">
  Orders
</h2>

<div className="overflow-x-auto mb-10">
  <table className="w-full border border-zinc-700">
    <thead>
      <tr className="bg-zinc-900">
        <th className="p-3">Customer</th>
        <th className="p-3">Mobile</th>
        <th className="p-3">Items</th>
        <th className="p-3">Amount</th>
        <th className="p-3">Action</th>
      </tr>
    </thead>

    <tbody>
      {orders.map((order) => (
        <tr
          key={order._id}
          className="border-t border-zinc-700 text-center"
        >
          <td className="p-3">{order.customerName}</td>
          <td className="p-3">{order.mobile}</td>

          <td className="p-3">
            {order.items?.map((item: any) => item.name).join(", ")}
          </td>

          <td className="p-3">₹{order.totalAmount}</td>
    <td className="p-3">
  <button
    onClick={() => deleteOrder(order._id)}
    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
  >
    Delete
  </button>
</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
<h2 className="text-3xl font-bold text-amber-400 mt-12 mb-4">
  Contact Messages
</h2>

<div className="overflow-x-auto mb-10">
  <table className="w-full border border-zinc-700">
    <thead>
      <tr className="bg-zinc-900">
        <th className="p-3">Name</th>
        <th className="p-3">Email</th>
        <th className="p-3">Message</th>
      </tr>
    </thead>

    <tbody>
      {contacts.map((contact) => (
        <tr
          key={contact._id}
          className="border-t border-zinc-700 text-center"
        >
          <td className="p-3">{contact.name}</td>
          <td className="p-3">{contact.email}</td>
          <td className="p-3">{contact.message}</td>
          <td className="p-3">
  <button
    onClick={() => deleteContact(contact._id)}
    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
  >
    Delete
  </button>
</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

</main>
    
  );
}