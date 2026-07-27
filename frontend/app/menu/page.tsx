"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "../components/Navbar";

type MenuItem = {
  category: string;
  name: string;
  image: string;
  description: string;
  price: number;
};

type CartItem = MenuItem & {
  quantity: number;
};

const menuItems: MenuItem[] = [
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

  const [cart, setCart] = useState<CartItem[]>([]);

  const [isCartOpen, setIsCartOpen] =
    useState(false);

  const categories = [
    "All",
    "Coffee",
    "Cold Coffee",
    "Shakes",
    "Mocktails",
    "Desserts",
    "Snacks",
  ];

  // Add item to cart
  const addToCart = (item: MenuItem) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (cartItem) => cartItem.name === item.name
      );

      if (existingItem) {
        return currentCart.map((cartItem) =>
          cartItem.name === item.name
            ? {
                ...cartItem,
                quantity:
                  cartItem.quantity + 1,
              }
            : cartItem
        );
      }

      return [
        ...currentCart,
        {
          ...item,
          quantity: 1,
        },
      ];
    });

    setIsCartOpen(true);
  };

  // Increase quantity
  const increaseQuantity = (name: string) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.name === name
          ? {
              ...item,
              quantity:
                item.quantity + 1,
            }
          : item
      )
    );
  };

  // Decrease quantity
  const decreaseQuantity = (name: string) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.name === name
            ? {
                ...item,
                quantity:
                  item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) => item.quantity > 0
        )
    );
  };

  // Remove item
  const removeFromCart = (name: string) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) => item.name !== name
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Total number of products
  const cartCount = cart.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  // Total price
  const cartTotal = cart.reduce(
    (total, item) =>
      total +
      item.price * item.quantity,
    0
  );

  // Proceed to checkout
  const proceedToCheckout = () => {
    if (cart.length === 0) {
      alert(
        "Your cart is empty 🛒"
      );
      return;
    }

    localStorage.setItem(
      "smartCafeCart",
      JSON.stringify(cart)
    );

    setIsCartOpen(false);

    window.location.href =
      "/checkout";
  };

  const filteredItems =
    selectedCategory === "All"
      ? menuItems
      : menuItems.filter(
          (item) =>
            item.category ===
            selectedCategory
        );

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Cart Button */}
      <button
        onClick={() =>
          setIsCartOpen(true)
        }
        className="fixed top-24 right-6 z-40 bg-amber-400 text-black px-5 py-3 rounded-full font-bold shadow-lg hover:bg-amber-300 transition"
      >
        🛒 Cart ({cartCount})
      </button>

      {/* Menu Section */}
      <section className="py-16 px-6">
        <h1 className="text-5xl font-bold text-center text-amber-400 mb-8">
          Our Menu
        </h1>

        {/* Category Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map(
            (category) => (
              <button
                key={category}
                onClick={() =>
                  setSelectedCategory(
                    category
                  )
                }
                className={`px-5 py-2 rounded-full transition ${
                  selectedCategory ===
                  category
                    ? "bg-amber-400 text-black font-semibold"
                    : "bg-zinc-800 hover:bg-zinc-700"
                }`}
              >
                {category}
              </button>
            )
          )}
        </div>

        {/* Menu Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(
            (item) => (
              <div
                key={item.name}
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
                    onClick={() =>
                      addToCart(item)
                    }
                    className="w-full mt-4 bg-amber-400 text-black py-2 rounded-lg font-semibold hover:bg-amber-300 transition"
                  >
                    Add To Cart
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70"
          onClick={() =>
            setIsCartOpen(false)
          }
        >
          <div
            className="absolute right-0 top-0 h-full w-full max-w-md bg-zinc-950 border-l border-zinc-700 shadow-2xl flex flex-col"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            {/* Cart Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <div>
                <h2 className="text-2xl font-bold text-amber-400">
                  Your Cart 🛒
                </h2>

                <p className="text-sm text-zinc-400 mt-1">
                  {cartCount} item
                  {cartCount !== 1
                    ? "s"
                    : ""}
                </p>
              </div>

              <button
                onClick={() =>
                  setIsCartOpen(false)
                }
                className="text-2xl text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">
                    🛒
                  </div>

                  <h3 className="text-xl font-bold">
                    Your cart is empty
                  </h3>

                  <p className="text-zinc-400 mt-2">
                    Add some delicious
                    items from our menu.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {cart.map(
                    (item) => (
                      <div
                        key={item.name}
                        className="flex gap-4 border-b border-zinc-800 pb-5"
                      >
                        <Image
                          src={
                            item.image
                          }
                          alt={
                            item.name
                          }
                          width={80}
                          height={80}
                          className="w-20 h-20 object-cover rounded-lg"
                        />

                        <div className="flex-1">
                          <div className="flex justify-between gap-3">
                            <h3 className="font-bold">
                              {
                                item.name
                              }
                            </h3>

                            <button
                              onClick={() =>
                                removeFromCart(
                                  item.name
                                )
                              }
                              className="text-red-400 hover:text-red-300"
                            >
                              🗑️
                            </button>
                          </div>

                          <p className="text-amber-400 font-semibold mt-1">
                            ₹
                            {
                              item.price
                            }
                          </p>

                          {/* Quantity */}
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center border border-zinc-700 rounded-lg overflow-hidden">
                              <button
                                onClick={() =>
                                  decreaseQuantity(
                                    item.name
                                  )
                                }
                                className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700"
                              >
                                −
                              </button>

                              <span className="px-4 py-1 font-bold">
                                {
                                  item.quantity
                                }
                              </span>

                              <button
                                onClick={() =>
                                  increaseQuantity(
                                    item.name
                                  )
                                }
                                className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700"
                              >
                                +
                              </button>
                            </div>

                            <span className="font-bold">
                              ₹
                              {item.price *
                                item.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="border-t border-zinc-800 p-6">
                <div className="flex justify-between text-lg mb-2">
                  <span className="text-zinc-400">
                    Subtotal
                  </span>

                  <span className="font-bold">
                    ₹{cartTotal}
                  </span>
                </div>

                <div className="flex justify-between text-xl font-bold mb-5">
                  <span>Total</span>

                  <span className="text-amber-400">
                    ₹{cartTotal}
                  </span>
                </div>

                <button
                  onClick={
                    clearCart
                  }
                  className="w-full mb-3 border border-red-500 text-red-400 py-2 rounded-lg hover:bg-red-500/10"
                >
                  Clear Cart
                </button>

                <button
                  onClick={
                    proceedToCheckout
                  }
                  className="w-full bg-amber-400 text-black py-3 rounded-lg font-bold hover:bg-amber-300"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}