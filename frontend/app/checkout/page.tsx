"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type CartItem = {
  name: string;
  image: string;
  price: number;
  quantity: number;
};

export default function CheckoutPage() {
  const router = useRouter();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("smartCafeCart");

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Total
  const totalAmount = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  // Place Order
  const placeOrder = async () => {
    if (!customerName.trim()) {
      alert("Please enter your name");
      return;
    }

    if (!mobile.trim()) {
      alert("Please enter your mobile number");
      return;
    }

    if (!email.trim()) {
      alert("Please enter your email");
      return;
    }

    if (!address.trim()) {
      alert("Please enter your address");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
  "https://smart-cafe-backend-ypf8.onrender.com/order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerName,
            mobile,
            email,
            address,

            items: cart.map((item) => ({
              name: item.name,
              price: item.price,
              quantity: item.quantity,
            })),

            totalAmount,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        // Clear cart
        localStorage.removeItem(
          "smartCafeCart"
        );

        alert(
          "Order Placed Successfully ✅"
        );

        router.push("/menu");
      } else {
        alert(
          data.message ||
            "Failed to place order"
        );
      }
    } catch (error) {
      console.error(
        "Order Error:",
        error
      );

      alert(
        "Unable to place order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white py-16 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-amber-400 mb-10">
          Checkout
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Customer Details */}
          <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

            <h2 className="text-2xl font-bold mb-6">
              Customer Details
            </h2>

            {/* Name */}
            <div className="mb-5">
              <label className="block mb-2 text-zinc-300">
                Full Name
              </label>

              <input
                type="text"
                value={customerName}
                onChange={(e) =>
                  setCustomerName(
                    e.target.value
                  )
                }
                placeholder="Enter your name"
                className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-amber-400"
              />
            </div>

            {/* Mobile */}
            <div className="mb-5">
              <label className="block mb-2 text-zinc-300">
                Mobile Number
              </label>

              <input
                type="tel"
                value={mobile}
                onChange={(e) =>
                  setMobile(
                    e.target.value
                  )
                }
                placeholder="Enter mobile number"
                className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-amber-400"
              />
            </div>

            {/* Email */}
            <div className="mb-5">
              <label className="block mb-2 text-zinc-300">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                placeholder="Enter email address"
                className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-amber-400"
              />
            </div>

            {/* Address */}
            <div className="mb-5">
              <label className="block mb-2 text-zinc-300">
                Address
              </label>

              <textarea
                value={address}
                onChange={(e) =>
                  setAddress(
                    e.target.value
                  )
                }
                placeholder="Enter your address"
                rows={4}
                className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-amber-400 resize-none"
              />
            </div>

          </div>

          {/* Order Summary */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 h-fit">

            <h2 className="text-2xl font-bold mb-6">
              Order Summary
            </h2>

            {cart.length === 0 ? (
              <p className="text-zinc-400">
                Your cart is empty.
              </p>
            ) : (
              <div className="space-y-5">

                {cart.map((item) => (
                  <div
                    key={item.name}
                    className="flex justify-between gap-4 border-b border-zinc-800 pb-4"
                  >
                    <div>
                      <h3 className="font-semibold">
                        {item.name}
                      </h3>

                      <p className="text-sm text-zinc-400">
                        ₹{item.price} ×{" "}
                        {item.quantity}
                      </p>
                    </div>

                    <p className="font-bold text-amber-400">
                      ₹
                      {item.price *
                        item.quantity}
                    </p>
                  </div>
                ))}

                {/* Total */}
                <div className="flex justify-between text-xl font-bold pt-3">
                  <span>
                    Total
                  </span>

                  <span className="text-amber-400">
                    ₹{totalAmount}
                  </span>
                </div>

                {/* Place Order */}
                <button
                  onClick={placeOrder}
                  disabled={loading}
                  className="w-full mt-5 bg-amber-400 text-black py-3 rounded-lg font-bold hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading
                    ? "Placing Order..."
                    : "Place Order"}
                </button>

                {/* Back */}
                <button
                  onClick={() =>
                    router.push("/menu")
                  }
                  className="w-full border border-zinc-700 py-3 rounded-lg hover:bg-zinc-800"
                >
                  Back to Menu
                </button>

              </div>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}