"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "../components/Navbar";

const menuItems = [
  {
    category: "Coffee",
    name: "Cappuccino",
    image: "/menu/cappuccino.jpg",
    description: "Rich espresso with milk foam",
    price: 180,
  },
  {
    category: "Coffee",
    name: "Latte",
    image: "/menu/latte.jpg",
    description: "Smooth espresso with steamed milk",
    price: 220,
  },
  {
    category: "Coffee",
    name: "Mocha",
    image: "/menu/mocha.jpg",
    description: "Chocolate flavored coffee",
    price: 250,
  },
  {
    category: "Coffee",
    name: "Espresso",
    image: "/menu/espresso.jpg",
    description: "Strong and bold coffee shot",
    price: 150,
  },

  {
    category: "Cold Coffee",
    name: "Cold Coffee",
    image: "/menu/cold-coffee.jpg",
    description: "Chilled creamy coffee",
    price: 220,
  },
  {
    category: "Cold Coffee",
    name: "Belgian Chocolate Frappe",
    image: "/menu/coffee.jpg",
    description: "Cold and sweet frappe",
    price: 290,
  },
  {
    category: "Cold Coffee",
    name: "Hazelnut Cold Coffee",
    image: "/menu/coffee.jpg",
    description: "Cold coffee with hazelnut flavor",
    price: 260,
  },

  {
    category: "Shakes",
    name: "Oreo Shake",
    image: "/menu/oreo-shake.jpg",
    description: "Creamy Oreo delight",
    price: 260,
  },
  {
    category: "Shakes",
    name: "Chocolate Shake",
    image: "/menu/milk-shakes.jpg",
    description: "Rich chocolate goodness",
    price: 240,
  },
  {
    category: "Shakes",
    name: "Mango Smoothie",
    image: "/menu/milk-shakes.jpg",
    description: "Fresh mango blended drink",
    price: 230,
  },

  {
    category: "Mocktails",
    name: "Virgin Mojito",
    image: "/menu/mocktails.jpg",
    description: "Refreshing mint cooler",
    price: 190,
  },
  {
    category: "Mocktails",
    name: "Blue Lagoon",
    image: "/menu/mocktails.jpg",
    description: "Cool citrus mocktail",
    price: 210,
  },

  {
    category: "Desserts",
    name: "Brownie",
    image: "/menu/brownie.jpg",
    description: "Soft chocolate brownie",
    price: 120,
  },
  {
    category: "Desserts",
    name: "Cheesecake",
    image: "/menu/desserts.jpg",
    description: "Creamy baked cheesecake",
    price: 180,
  },
  {
    category: "Desserts",
    name: "Chocolate Muffin",
    image: "/menu/desserts.jpg",
    description: "Fresh baked muffin",
    price: 100,
  },

  {
    category: "Snacks",
    name: "French Fries",
    image: "/menu/french-fries.jpg",
    description: "Crispy golden fries",
    price: 140,
  },
  {
    category: "Snacks",
    name: "Veg Sandwich",
    image: "/menu/snacks.jpg",
    description: "Fresh grilled sandwich",
    price: 160,
  },
  {
    category: "Snacks",
    name: "Garlic Bread",
    image: "/menu/snacks.jpg",
    description: "Toasted garlic bread",
    price: 150,
  },
];

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [cart, setCart] = useState<any[]>([]);

  const categories = [
    "All",
    "Coffee",
    "Cold Coffee",
    "Shakes",
    "Mocktails",
    "Desserts",
    "Snacks",
  ];

  const addToCart = (item: any) => {
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
    customerName: "Test User",
    mobile: "9999999999",
    items: cart.map((item) => ({
      name: item.name,
      price: item.price,
      quantity: 1,
    })),
    totalAmount: cart.reduce(
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
    
  

  const filteredItems =
    selectedCategory === "All"
      ? menuItems
      : menuItems.filter(
          (item) => item.category === selectedCategory
        );

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="py-16 px-6">
        <h1 className="text-5xl font-bold text-center text-amber-400 mb-8">
          Our Menu
        </h1>
<div className="text-center mb-8">
  <span className="bg-amber-400 text-black px-4 py-2 rounded-full font-bold">
    Cart: {cart.length}
  </span>

  <div className="mt-4">
    <button
      onClick={placeOrder}
      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold"
    >
      Place Order
    </button>
  </div>
</div>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-full transition ${
                selectedCategory === category
                  ? "bg-amber-400 text-black font-semibold"
                  : "bg-zinc-800 hover:bg-zinc-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={index}
              className="border border-zinc-700 rounded-xl overflow-hidden hover:border-amber-400 hover:scale-105 transition duration-300"
            >
              <Image
                src={item.image}
                alt={item.name}
                width={400}
                height={250}
                className="w-full h-48 object-cover"
              />

              <div className="p-6">
                <p className="text-sm text-amber-400 mb-2">
                  {item.category}
                </p>

                <h2 className="text-2xl font-bold">
                  {item.name}
                </h2>

                <p className="text-zinc-400 mt-2">
                  {item.description}
                </p>

                <p className="text-amber-400 mt-4 text-xl font-semibold">
                  ₹{item.price}
                </p>

                <button
                  onClick={() => addToCart(item)}
                  className="w-full mt-4 bg-amber-400 text-black py-2 rounded-lg font-semibold hover:bg-amber-300"
                >
                  Add To Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}