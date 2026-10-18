"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BookingChart from "../../components/BookingChart";
import { saveAs } from "file-saver";

import {
  Coffee,
  CalendarDays,
  IndianRupee,
  ShoppingBag,
  Users,
  Mail,
  RefreshCw,
  Download,
  LogOut,
} from "lucide-react";

import { API_URL } from "@/lib/api";

interface Prediction {
  expectedSeats: number;
  occupancy: number;
  confidence: number;
}

interface Booking {
  _id: string;
  name: string;
  mobile: string;
  email: string;
  date: string;
  time: string;
  seats: number;
}

interface OrderItem {
  name: string;
  price: number;
  quantity?: number;
}

interface Order {
  _id: string;
  customerName: string;
  mobile: string;
  items: OrderItem[];
  totalAmount: number;
}

interface Contact {
  _id: string;
  name: string;
  email: string;
  message: string;
}

const TOTAL_SEATS = 50;

export default function AdminPage() {
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);

  const [prediction, setPrediction] = useState<Prediction>({
    expectedSeats: 0,
    occupancy: 0,
    confidence: 0,
  });

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // ==========================================
  // API BASE URL
  // ==========================================

  const BASE_URL = API_URL.replace(/\/+$/, "");

  // ==========================================
  // SAFE API FETCH
  // ==========================================

  const fetchJSON = async (
    endpoint: string
  ): Promise<any | null> => {
    try {
      const url = `${BASE_URL}${endpoint}`;

      console.log("Fetching:", url);

      const response = await fetch(url, {
        cache: "no-store",
      });

      console.log(
        `${endpoint} status:`,
        response.status
      );

      if (!response.ok) {
        console.error(
          `API Error ${endpoint}:`,
          response.status,
          response.statusText
        );

        return null;
      }

      const text = await response.text();

      if (!text) {
        console.warn(
          `Empty response from ${endpoint}`
        );

        return null;
      }

      try {
        return JSON.parse(text);
      } catch (error) {
        console.error(
          `Invalid JSON from ${endpoint}:`,
          text
        );

        return null;
      }
    } catch (error) {
      console.error(
        `Network error ${endpoint}:`,
        error
      );

      return null;
    }
  };

  // ==========================================
  // NORMALIZE API DATA
  // ==========================================

  const extractArray = (
    response: any
  ): any[] => {
    if (!response) return [];

    if (Array.isArray(response)) {
      return response;
    }

    if (Array.isArray(response.data)) {
      return response.data;
    }

    if (
      response.data &&
      Array.isArray(response.data.data)
    ) {
      return response.data.data;
    }

    if (Array.isArray(response.bookings)) {
      return response.bookings;
    }

    if (Array.isArray(response.orders)) {
      return response.orders;
    }

    if (Array.isArray(response.contacts)) {
      return response.contacts;
    }

    return [];
  };

  // ==========================================
  // FETCH DASHBOARD DATA
  // ==========================================

  const fetchAllData = async () => {
    try {
      setLoading(true);

      console.log(
        "===================================="
      );

      console.log(
        "SMARTCAFE ADMIN DATA FETCH START"
      );

      console.log(
        "API URL:",
        BASE_URL
      );

      console.log(
        "===================================="
      );

      // --------------------------------------
      // BOOKINGS
      // --------------------------------------

      const bookingData =
        await fetchJSON("/bookings");

      const bookingArray =
        extractArray(bookingData);

      console.log(
        "Bookings received:",
        bookingArray.length,
        bookingArray
      );

      setBookings(
        bookingArray.map(
          (booking: any) => ({
            ...booking,

            seats: Number(
              booking.seats || 0
            ),
          })
        )
      );

      // --------------------------------------
      // ORDERS
      // --------------------------------------

      const orderData =
        await fetchJSON("/orders");

      const orderArray =
        extractArray(orderData);

      console.log(
        "Orders received:",
        orderArray.length,
        orderArray
      );

      setOrders(
        orderArray.map(
          (order: any) => ({
            ...order,

            totalAmount: Number(
              order.totalAmount ||
                order.total ||
                order.amount ||
                0
            ),

            items: Array.isArray(
              order.items
            )
              ? order.items
              : [],
          })
        )
      );

      // --------------------------------------
      // CONTACTS
      // --------------------------------------

      const contactData =
        await fetchJSON("/contacts");

      const contactArray =
        extractArray(contactData);

      console.log(
        "Contacts received:",
        contactArray.length,
        contactArray
      );

      setContacts(contactArray);

      // --------------------------------------
      // AI PREDICTION
      // --------------------------------------

      const predictionData =
        await fetchJSON("/prediction");

      console.log(
        "Prediction response:",
        predictionData
      );

      if (predictionData) {
        const rawPrediction =
          predictionData.data ||
          predictionData;

        setPrediction({
          expectedSeats: Number(
            rawPrediction.expectedSeats ||
              0
          ),

          occupancy: Number(
            rawPrediction.occupancy ||
              0
          ),

          confidence: Number(
            rawPrediction.confidence ||
              0
          ),
        });
      } else {
        console.warn(
          "Prediction API unavailable. Using default values."
        );

        setPrediction({
          expectedSeats: 0,
          occupancy: 0,
          confidence: 0,
        });
      }

      console.log(
        "SMARTCAFE ADMIN DATA FETCH COMPLETE"
      );
    } catch (error) {
      console.error(
        "Dashboard fetch error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // AUTH + INITIAL LOAD
  // ==========================================

  useEffect(() => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    fetchAllData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // ==========================================
  // DELETE BOOKING
  // ==========================================

  const deleteBooking = async (
    id: string
  ) => {
    if (
      !confirm(
        "Delete this booking?"
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/booking/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Delete failed: ${response.status}`
        );
      }

      await fetchAllData();
    } catch (error) {
      console.error(
        "Error deleting booking:",
        error
      );

      alert(
        "Unable to delete booking."
      );
    }
  };

  // ==========================================
  // DELETE ORDER
  // ==========================================

  const deleteOrder = async (
    id: string
  ) => {
    if (
      !confirm(
        "Delete this order?"
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/order/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Delete failed: ${response.status}`
        );
      }

      await fetchAllData();
    } catch (error) {
      console.error(
        "Error deleting order:",
        error
      );

      alert(
        "Unable to delete order."
      );
    }
  };

  // ==========================================
  // DELETE CONTACT
  // ==========================================

  const deleteContact = async (
    id: string
  ) => {
    if (
      !confirm(
        "Delete this message?"
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/contact/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Delete failed: ${response.status}`
        );
      }

      await fetchAllData();
    } catch (error) {
      console.error(
        "Error deleting contact:",
        error
      );

      alert(
        "Unable to delete message."
      );
    }
  };

  // ==========================================
  // EXPORT CSV
  // ==========================================

  const exportCSV = () => {
    const headers = [
      "Name",
      "Mobile",
      "Email",
      "Date",
      "Time",
      "Seats",
    ];

    const rows = bookings.map(
      (booking) => [
        booking.name || "",
        booking.mobile || "",
        booking.email || "",
        booking.date || "",
        booking.time || "",
        booking.seats || 0,
      ]
    );

    const csv =
      headers.join(",") +
      "\n" +
      rows
        .map((row) =>
          row
            .map((value) =>
              `"${String(value).replace(
                /"/g,
                '""'
              )}"`
            )
            .join(",")
        )
        .join("\n");

    const blob = new Blob(
      [csv],
      {
        type:
          "text/csv;charset=utf-8;",
      }
    );

    saveAs(
      blob,
      "smartcafe-bookings.csv"
    );
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  // ==========================================
  // DASHBOARD STATS
  // ==========================================

  const totalBookings =
    bookings.length;

  const bookedSeats =
    bookings.reduce(
      (sum, booking) =>
        sum +
        Number(
          booking.seats || 0
        ),
      0
    );

  const availableSeats =
    Math.max(
      0,
      TOTAL_SEATS -
        bookedSeats
    );

  // Actual order revenue
  const revenue =
    orders.reduce(
      (sum, order) =>
        sum +
        Number(
          order.totalAmount || 0
        ),
      0
    );

  const totalOrders =
    orders.length;

  const messages =
    contacts.length;

  // ==========================================
  // BOOKING SEARCH + DATE FILTER
  // ==========================================

  const filteredBookings =
    bookings.filter(
      (booking) => {
        const searchText =
          search.toLowerCase();

        const matchesSearch =
          booking.name
            ?.toLowerCase()
            .includes(
              searchText
            ) ||
          booking.email
            ?.toLowerCase()
            .includes(
              searchText
            ) ||
          booking.mobile
            ?.includes(search);

        const matchesDate =
          dateFilter === "" ||
          booking.date?.startsWith(
            dateFilter
          );

        return (
          matchesSearch &&
          matchesDate
        );
      }
    );

  // ==========================================
  // TOP SELLING COFFEE
  // ==========================================

  const coffeeSales: Record<
    string,
    number
  > = {};

  orders.forEach(
    (order) => {
      order.items?.forEach(
        (item) => {
          const quantity =
            Number(
              item.quantity || 1
            );

          coffeeSales[
            item.name
          ] =
            (coffeeSales[
              item.name
            ] || 0) +
            quantity;
        }
      );
    }
  );

  const topSellingCoffee =
    Object.entries(
      coffeeSales
    )
      .sort(
        (a, b) =>
          b[1] - a[1]
      )
      .slice(0, 5);

  // ==========================================
  // CUSTOMER ANALYTICS
  // ==========================================

  const customerVisits: Record<
    string,
    number
  > = {};

  bookings.forEach(
    (booking) => {
      const key =
        booking.email ||
        booking.mobile;

      if (key) {
        customerVisits[key] =
          (customerVisits[key] ||
            0) + 1;
      }
    }
  );

  const uniqueCustomers =
    Object.keys(
      customerVisits
    ).length;

  const returningCustomers =
    Object.values(
      customerVisits
    ).filter(
      (count) => count > 1
    ).length;

  const mostActiveCustomer =
    Object.entries(
      customerVisits
    ).sort(
      (a, b) =>
        b[1] - a[1]
    )[0];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-zinc-900 to-black text-white p-8">

      {/* HEADER */}

      <div className="flex flex-col lg:flex-row justify-between items-center gap-5 mb-8">

        <div>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-amber-300 to-orange-500 bg-clip-text text-transparent">
            SmartCafe Dashboard
          </h1>

          <p className="text-zinc-400 mt-2">
            Cafe Analytics & AI Management Panel
          </p>
        </div>

        <div className="flex gap-3">

          <button
            onClick={fetchAllData}
            disabled={loading}
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 transition px-5 py-2 rounded-xl"
          >
            <RefreshCw
              size={18}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            {loading
              ? "Loading..."
              : "Refresh"}
          </button>

          <button
            onClick={exportCSV}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 transition px-5 py-2 rounded-xl"
          >
            <Download size={18} />
            Export
          </button>

          <button
            onClick={logout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 transition px-5 py-2 rounded-xl"
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>
      </div>

      {loading && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6 text-amber-300">
          Loading SmartCafe dashboard data...
        </div>
      )}

      {/* BOOKING CHART */}

      <div className="mb-10">
        <BookingChart />
      </div>

      {/* STATS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-10">

        <Card
          title="Bookings"
          value={totalBookings}
          icon={
            <CalendarDays
              size={28}
            />
          }
        />

        <Card
          title="Booked Seats"
          value={bookedSeats}
          icon={
            <Coffee
              size={28}
            />
          }
        />

        <Card
          title="Available Seats"
          value={availableSeats}
          icon={
            <Users
              size={28}
            />
          }
        />

        <Card
          title="Revenue"
          value={`₹${revenue}`}
          icon={
            <IndianRupee
              size={28}
            />
          }
        />

        <Card
          title="Orders"
          value={totalOrders}
          icon={
            <ShoppingBag
              size={28}
            />
          }
        />

        <Card
          title="Messages"
          value={messages}
          icon={
            <Mail
              size={28}
            />
          }
        />

      </div>

      {/* AI PREDICTION */}

      <div className="bg-zinc-900 rounded-xl p-6 mb-10">

        <h2 className="text-3xl font-bold text-amber-400 mb-6">
          🤖 AI Occupancy Prediction
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          <div>
            <p className="text-zinc-400">
              Expected Seats
            </p>

            <p className="text-4xl font-bold text-green-400">
              {prediction.expectedSeats}/50
            </p>
          </div>

          <div>
            <p className="text-zinc-400">
              Occupancy
            </p>

            <p className="text-4xl font-bold text-blue-400">
              {prediction.occupancy}%
            </p>
          </div>

          <div>
            <p className="text-zinc-400">
              Confidence
            </p>

            <p className="text-4xl font-bold text-purple-400">
              {prediction.confidence}%
            </p>
          </div>

        </div>

      </div>

      {/* TOP SELLING COFFEE */}

      <div className="bg-zinc-900 rounded-xl p-6 mb-10">

        <h2 className="text-3xl font-bold text-amber-400 mb-6">
          ☕ Top Selling Coffee
        </h2>

        {topSellingCoffee.length ===
        0 ? (
          <p className="text-zinc-400">
            No order data available.
          </p>
        ) : (
          topSellingCoffee.map(
            ([coffee, count]) => (
              <div
                key={coffee}
                className="mb-5"
              >

                <div className="flex justify-between mb-2">

                  <span className="font-semibold">
                    {coffee}
                  </span>

                  <span>
                    {count} Orders
                  </span>

                </div>

                <div className="w-full bg-zinc-700 rounded-full h-3">

                  <div
                    className="bg-amber-400 h-3 rounded-full transition-all"
                    style={{
                      width: `${Math.min(
                        Number(
                          count
                        ) * 20,
                        100
                      )}%`,
                    }}
                  />

                </div>

              </div>
            )
          )
        )}

      </div>

      {/* CUSTOMER ANALYTICS */}

      <div className="grid md:grid-cols-3 gap-6 mb-10">

        <div className="bg-zinc-900 rounded-xl p-6">

          <h3 className="text-zinc-400">
            Unique Customers
          </h3>

          <p className="text-4xl font-bold text-cyan-400">
            {uniqueCustomers}
          </p>

        </div>

        <div className="bg-zinc-900 rounded-xl p-6">

          <h3 className="text-zinc-400">
            Returning Customers
          </h3>

          <p className="text-4xl font-bold text-green-400">
            {returningCustomers}
          </p>

        </div>

        <div className="bg-zinc-900 rounded-xl p-6">

          <h3 className="text-zinc-400">
            Most Active Customer
          </h3>

          <p className="text-xl font-bold text-amber-400 break-all">

            {mostActiveCustomer
              ? `${mostActiveCustomer[0]} (${mostActiveCustomer[1]} visits)`
              : "N/A"}

          </p>

        </div>

      </div>

      {/* SEARCH */}

      <div className="flex flex-col md:flex-row gap-4 mb-8">

        <input
          type="text"
          placeholder="🔍 Search by Name, Email or Mobile"
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 outline-none focus:border-amber-400"
        />

        <input
          type="date"
          value={dateFilter}
          onChange={(e) =>
            setDateFilter(
              e.target.value
            )
          }
          className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 outline-none focus:border-amber-400"
        />

      </div>

      {/* BOOKINGS */}

      <Table title="Bookings">

        <thead className="bg-zinc-900 text-amber-400">

          <tr>
            <th className="p-3">
              Name
            </th>

            <th className="p-3">
              Mobile
            </th>

            <th className="p-3">
              Email
            </th>

            <th className="p-3">
              Date
            </th>

            <th className="p-3">
              Time
            </th>

            <th className="p-3">
              Seats
            </th>

            <th className="p-3">
              Action
            </th>
          </tr>

        </thead>

        <tbody>

          {filteredBookings.length ===
          0 ? (
            <tr>
              <td
                colSpan={7}
                className="p-6 text-center text-zinc-500"
              >
                No bookings found.
              </td>
            </tr>
          ) : (
            filteredBookings.map(
              (booking) => (
                <tr
                  key={booking._id}
                  className="border-t border-zinc-700 text-center hover:bg-zinc-800"
                >

                  <td className="p-3">
                    {booking.name}
                  </td>

                  <td className="p-3">
                    {booking.mobile}
                  </td>

                  <td className="p-3">
                    {booking.email}
                  </td>

                  <td className="p-3">
                    {booking.date}
                  </td>

                  <td className="p-3">
                    {booking.time}
                  </td>

                  <td className="p-3">
                    {booking.seats}
                  </td>

                  <td className="p-3">

                    <button
                      onClick={() =>
                        deleteBooking(
                          booking._id
                        )
                      }
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                    >
                      Delete
                    </button>

                  </td>

                </tr>
              )
            )
          )}

        </tbody>

      </Table>

      {/* ORDERS */}

      <Table title="Orders">

        <thead className="bg-zinc-900 text-amber-400">

          <tr>
            <th className="p-3">
              Customer
            </th>

            <th className="p-3">
              Mobile
            </th>

            <th className="p-3">
              Items
            </th>

            <th className="p-3">
              Amount
            </th>

            <th className="p-3">
              Action
            </th>
          </tr>

        </thead>

        <tbody>

          {orders.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="p-6 text-center text-zinc-500"
              >
                No orders found.
              </td>
            </tr>
          ) : (
            orders.map(
              (order) => (
                <tr
                  key={order._id}
                  className="border-t border-zinc-700 text-center hover:bg-zinc-800"
                >

                  <td className="p-3">
                    {order.customerName ||
                      "N/A"}
                  </td>

                  <td className="p-3">
                    {order.mobile ||
                      "N/A"}
                  </td>

                  <td className="p-3">
                    {order.items
                      ?.map(
                        (item) =>
                          `${item.name} x${
                            item.quantity ||
                            1
                          }`
                      )
                      .join(", ") ||
                      "N/A"}
                  </td>

                  <td className="p-3">
                    ₹
                    {Number(
                      order.totalAmount ||
                        0
                    )}
                  </td>

                  <td className="p-3">

                    <button
                      onClick={() =>
                        deleteOrder(
                          order._id
                        )
                      }
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                    >
                      Delete
                    </button>

                  </td>

                </tr>
              )
            )
          )}

        </tbody>

      </Table>

      {/* CONTACTS */}

      <Table title="Contact Messages">

        <thead className="bg-zinc-900 text-amber-400">

          <tr>
            <th className="p-3">
              Name
            </th>

            <th className="p-3">
              Email
            </th>

            <th className="p-3">
              Message
            </th>

            <th className="p-3">
              Action
            </th>
          </tr>

        </thead>

        <tbody>

          {contacts.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="p-6 text-center text-zinc-500"
              >
                No contact messages found.
              </td>
            </tr>
          ) : (
            contacts.map(
              (contact) => (
                <tr
                  key={contact._id}
                  className="border-t border-zinc-700 text-center hover:bg-zinc-800"
                >

                  <td className="p-3">
                    {contact.name}
                  </td>

                  <td className="p-3">
                    {contact.email}
                  </td>

                  <td className="p-3 max-w-sm break-words">
                    {contact.message}
                  </td>

                  <td className="p-3">

                    <button
                      onClick={() =>
                        deleteContact(
                          contact._id
                        )
                      }
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                    >
                      Delete
                    </button>

                  </td>

                </tr>
              )
            )
          )}

        </tbody>

      </Table>

    </main>
  );
}

// ==========================================
// CARD
// ==========================================

function Card({
  title,
  value,
  icon,
}: {
  title: string;
  value: any;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className="
        rounded-2xl
        p-6
        bg-white/10
        backdrop-blur-xl
        border border-white/10
        shadow-xl
        hover:scale-105
        hover:border-amber-400/50
        transition-all
        duration-300
      "
    >

      <div className="flex justify-between items-start">

        <div>

          <h3 className="text-zinc-300 text-sm uppercase tracking-widest">
            {title}
          </h3>

          <p className="text-4xl font-bold text-amber-400 mt-3">
            {value}
          </p>

        </div>

        {icon && (
          <div className="text-amber-400 opacity-90">
            {icon}
          </div>
        )}

      </div>

    </div>
  );
}

// ==========================================
// TABLE
// ==========================================

function Table({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">

      <h2 className="text-3xl font-bold text-amber-400 mb-5">
        {title}
      </h2>

      <div className="overflow-x-auto rounded-xl border border-zinc-700">

        <table className="w-full text-sm">

          {children}

        </table>

      </div>

    </section>
  );
}