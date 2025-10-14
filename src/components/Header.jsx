// components/Header.jsx
export default function Header() {
  return (
    <header className=" fixed w-full bg-[#111418] shadow-lg py-4 border-b border-gray-700 z-50">
      <div className="container mx-auto flex justify-between items-center px-6">
        <a href="/" className="text-2xl font-bold bg-gradient-to-r from-[#2563EB] to-[#10B981] bg-clip-text text-transparent"> SpendFlow</a>
        <nav className="space-x-6 hidden md:flex">
          <a href="/" className="text-gray-300 hover:text-[#2563EB] transition">Home</a>
          <a href="/dashboard" className="text-gray-300 hover:text-[#2563EB] transition">Dashboard</a>
          <a href="/login" className="text-gray-300 hover:text-[#2563EB] transition">Login</a>
          <a href="/signup" className="text-gray-300 hover:text-[#2563EB] transition">Sign Up</a>
        </nav>
        <a
          href="/signup"
          className="b text-white px-4 py-2 rounded-lg hover:bg-[#1D4ED8] transition"
        >
          <div></div>
        </a>
      </div>
    </header>
  );
}
