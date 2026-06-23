"use client";

import { useState } from "react";

const menuItems = [
  {
    name: "Cold Coffee",
    price: 120,
  },
  {
    name: "Chocolate Shake",
    price: 150,
  },
  {
    name: "Cappuccino",
    price: 140,
  },
  {
    name: "Latte",
    price: 130,
  },
  {
    name: "Brownie",
    price: 90,
  },
];

export default function Menu() {
  const [cart, setCart] = useState([]);
    const addToCart = (item) => {
    setCart([...cart, item]);
  };
  const placeOrder = async () => {
  if (cart.length === 0) {
    alert("Cart is empty");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: cart,
        total: cart.reduce(
          (sum, item) => sum + item.price,
          0
        ),
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Order Placed Successfully ✅");
      setCart([]);
    }
  } catch (error) {
    console.error(error);
  }
};

  const addToCart = (item) => {
    setCart([...cart, item]);
   <div className="text-center mb-8 mt-4">
  <button
    onClick={placeOrder}
    className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-bold"
  >
    Place Order
  </button>
</div> 
  };

  return (
  <>
    <div className="text-center mb-8 mt-4">
      <button
        onClick={placeOrder}
        className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-bold"
      >
        Place Order
      </button>
    </div>

    <div className="grid md:grid-cols-3 gap-6">
      {menuItems.map((item, index) => (
        <div
          key={index}
          className="bg-zinc-900 p-6 rounded-xl"
        >
          <h2 className="text-xl font-bold">
            {item.name}
          </h2>

          <p className="text-green-400">
            ₹{item.price}
          </p>

          <button
            onClick={() => addToCart(item)}
            className="mt-4 bg-amber-500 px-4 py-2 rounded"
          >
            Add To Cart
          </button>
        </div>
      ))}
    </div>
  </>
);
}