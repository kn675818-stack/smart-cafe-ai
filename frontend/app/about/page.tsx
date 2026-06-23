import Navbar from "../components/Navbar";
export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white">

      
     <Navbar />

      <section className="max-w-6xl mx-auto px-6 py-20">
  <h1 className="text-5xl font-bold text-center text-amber-400 mb-8">
    About SmartCafe AI
  </h1>

  <p className="text-zinc-400 text-lg text-center max-w-3xl mx-auto leading-8">
    SmartCafe AI is an intelligent cafe management platform that combines
    technology and hospitality. Customers can explore menus, book tables,
    place orders, and enjoy a seamless digital cafe experience.
  </p>

  <div className="grid md:grid-cols-3 gap-8 mt-16">
    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
      <h2 className="text-2xl font-bold text-amber-400 mb-4">
        Smart Ordering
      </h2>

      <p className="text-zinc-400">
        Browse menu items, add products to cart, and place orders quickly
        through our smart ordering system.
      </p>
    </div>

    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
      <h2 className="text-2xl font-bold text-amber-400 mb-4">
        Table Booking
      </h2>

      <p className="text-zinc-400">
        Reserve your seat in advance and avoid waiting during busy hours
        using our booking system.
      </p>
    </div>

    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
      <h2 className="text-2xl font-bold text-amber-400 mb-4">
        AI Powered
      </h2>

      <p className="text-zinc-400">
        AI analyzes customer preferences and helps recommend drinks based
        on taste and choice.
      </p>
    </div>
  </div>

  <div className="mt-20 text-center">
    <h2 className="text-3xl font-bold text-amber-400 mb-4">
      Our Mission
    </h2>

    <p className="text-zinc-400 max-w-3xl mx-auto leading-8">
      Our mission is to modernize cafe operations using AI and data-driven
      solutions while providing customers with a smarter and faster cafe
      experience.
    </p>
  </div>
</section>
</main> 
); 
}