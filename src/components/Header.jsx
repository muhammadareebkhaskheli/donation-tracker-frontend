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
          {[
            { href: "#home", label: "Home" },
            { href: "#about", label: "About" },
            { href: "#services", label: "Services" },
            { href: "#progress", label: "Progress" },
            { href: "#faqs", label: "FAQs" },
            { href: "#contact", label: "Contact" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative text-gray-700 hover:text-blue-700 transition-colors duration-200
                 after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-0 
                 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full
                 hover:scale-105 active:scale-95"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Auth buttons (desktop) */}
        <div className="hidden md:flex items-center gap-3">
          {/* Login */}
          <a
            href="/login"
            className="px-5 py-2 text-sm font-semibold text-gray-800 bg-white border border-gray-300 rounded-full shadow-sm 
               hover:bg-gray-100 hover:scale-105 hover:shadow-md active:scale-95 transition-transform duration-200"
          >
            Login
          </a>

          {/* Sign Up */}
          <a
            href="/signup"
            className="px-5 py-2 text-sm font-semibold text-white rounded-full 
               bg-gradient-to-r from-blue-600 to-blue-800 shadow-md 
               hover:from-blue-700 hover:to-blue-900 hover:scale-105 hover:shadow-lg active:scale-95 transition-transform duration-200"
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