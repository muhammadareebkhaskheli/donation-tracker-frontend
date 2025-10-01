import { useState } from "react";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-sm fixed top-0 left-0 z-50">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="text-2xl font-bold text-blue-600">Donation Tracker</div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <a href="#home" className="text-gray-700 hover:text-black transition">Home</a>
          <a href="#about" className="text-gray-700 hover:text-black transition">About</a>
          <a href="#services" className="text-gray-700 hover:text-black transition">Services</a>
          <a href="#progress" className="text-gray-700 hover:text-black transition">Progress</a>
          <a href="#faqs" className="text-gray-700 hover:text-black transition">FAQs</a>
          <a href="#contact" className="text-gray-700 hover:text-black transition">Contact</a>
        </nav>

        {/* Auth buttons (desktop) */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="#login"
            className="px-3 py-1.5 text-sm font-semibold text-black bg-gray-100 border border-gray-300 rounded-full shadow-sm hover:bg-gray-200 transition"
          >
            Login
          </a>
          <a
            href="#signup"
            className="px-3 py-1.5 text-sm font-medium text-white bg-black rounded-full hover:bg-gray-800 transition"
          >
            Sign Up
          </a>
        </div>

        {/* Mobile: hamburger */}
        <div className="md:hidden">
          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            className="p-2 rounded-md bg-white border border-gray-200"
          >
            {!open ? (
              // hamburger
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
              </svg>
            ) : (
              // close
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </header>
  );
}