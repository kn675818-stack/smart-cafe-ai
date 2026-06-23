export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-6 border-b border-zinc-800">
      <h1 className="text-2xl font-bold text-amber-400">
        SmartCafe AI
      </h1>

      <div className="flex gap-8">
        <a href="/">Home</a>
        <a href="/menu">Menu</a>
        <a href="/booking">Booking</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
        
      </div>
    </nav>
  );
}