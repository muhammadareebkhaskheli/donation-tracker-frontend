export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ====== HEADER ====== */}
      <header className="flex justify-between items-center px-8 py-4 bg-white shadow sticky top-0 z-50">
        {/* Logo */}
        <h1 className="text-xl font-bold text-blue-600">Donation Tracker</h1>

        {/* Navigation */}
        <nav className="hidden md:flex gap-6">
          <a href="#home" className="text-gray-700 hover:text-blue-600">Home</a>
          <a href="#about" className="text-gray-700 hover:text-blue-600">About</a>
          <a href="#services" className="text-gray-700 hover:text-blue-600">Services</a>
          <a href="#progress" className="text-gray-700 hover:text-blue-600">Progress</a>
          <a href="#faqs" className="text-gray-700 hover:text-blue-600">FAQs</a>
          <a href="#contact" className="text-gray-700 hover:text-blue-600">Contact</a>
        </nav>

        {/* Auth Buttons */}
        {/* In your Header component (React + Tailwind)*/}
        <div className="flex items-center space-x-3">
          {/* Login Button */}
          <a
            href="#login"
            className="px-3 py-1.5 text-sm font-semibold text-black bg-gray-100 border border-gray-300 rounded-lg shadow-md hover:bg-gray-200 active:bg-gray-200 disabled:opacity-40"
          >
            Login
          </a>

          {/* Sign Up Button */}
          <a
            href="#signup"
            className="px-3 py-1.5 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 active:bg-gray-700 disabled:opacity-40"
          >
            Sign Up
          </a>
        </div>
      </header>

      {/* ====== HERO ====== */}
      <section
        id="home"
        className="flex flex-col items-center justify-center text-center py-20 px-6 bg-blue-600 text-white"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Make Every Donation Count
        </h2>
        <p className="max-w-2xl mb-8">
          Track donations in real time, support verified recipients, and keep
          everything transparent and secure.
        </p>
        <div className="flex gap-4">
          <a
            href="#donate"
            className="bg-white text-blue-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-200"
          >
            Donate Now
          </a>
          <a
            href="#recipient"
            className="border border-white px-6 py-3 rounded-md font-semibold hover:bg-blue-500"
          >
            Become a recipient
          </a>
        </div>
      </section>

      {/* ====== INFO SECTION ====== */}
      <section id="about" className="w-full grid gap-12 md:grid-cols-2 px-8 py-20">
        <div className="bg-white shadow p-6 rounded">
          <h3 className="text-xl font-bold mb-4">Why We Built This Platform</h3>
          <p>
            Our mission is to create a transparent and reliable platform where
            donors can directly support those in need. Every rupee is tracked
            and every story is verified.
          </p>
        </div>
        <div className="bg-gray-200 shadow flex items-center justify-center p-6 rounded">
          <p>📷 Placeholder for image</p>
        </div>
        <div className="bg-white shadow p-6 rounded text-center">
          <h3 className="text-xl font-bold mb-4">For Donors ❤️</h3>
          <p>View recipient needs, donate securely, and track your impact.</p>
        </div>
        <div className="bg-white shadow p-6 rounded text-center">
          <h3 className="text-xl font-bold mb-4">For Recipients 👤</h3>
          <p>Register, verify your documents, and receive donations.</p>
        </div>
      </section>

      {/* ====== IMPACT SECTION ====== */}
      <section id="progress" className="bg-gray-100 px-8 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Our Impact</h2>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="bg-white shadow rounded p-6">
            <h3 className="font-bold mb-4">Donations by Category</h3>
            <div className="h-48 flex items-center justify-center text-gray-500">
              [Pie Chart Placeholder]
            </div>
          </div>
          <div className="bg-white shadow rounded p-6">
            <h3 className="font-bold mb-4">Monthly Donation Trend</h3>
            <div className="h-48 flex items-center justify-center text-gray-500">
              [Line Chart Placeholder]
            </div>
          </div>
        </div>
      </section>

      {/* ====== FAQ SECTION ====== */}
      <section id="faqs" className="px-8 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">FAQs</h2>
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h4 className="font-semibold">How do I become a recipient?</h4>
            <p className="text-gray-600">
              Register on our platform and submit required documents for
              verification.
            </p>
          </div>
          <div>
            <h4 className="font-semibold">Can I donate anonymously?</h4>
            <p className="text-gray-600">
              Yes, we allow donors to choose anonymous donations.
            </p>
          </div>
          <div>
            <h4 className="font-semibold">Is my data safe?</h4>
            <p className="text-gray-600">
              We use secure encryption to protect all your data.
            </p>
          </div>
        </div>
      </section>

      {/* ====== CONTACT SECTION ====== */}
      <section
        id="contact"
        className="bg-blue-50 px-8 py-20 grid md:grid-cols-2 gap-12"
      >
        <div>
          <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
          <p className="mb-6">
            We would love to hear from you. Fill out the form and we will get
            back to you soon.
          </p>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              className="w-full p-3 border rounded"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border rounded"
            />
            <input
              type="tel"
              placeholder="Phone"
              className="w-full p-3 border rounded"
            />
            <textarea
              placeholder="Message"
              className="w-full p-3 border rounded h-32"
            ></textarea>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Send Message
            </button>
          </form>
        </div>
        <div className="bg-gray-200 flex items-center justify-center rounded">
          <p>🗺️ Map location placeholder</p>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer className="bg-gray-800 text-white py-6 text-center">
        <p>© 2025 Donation Tracker. All rights reserved.</p>
        <p className="text-gray-400 text-sm mt-2">Made with Vercel / Visily</p>
      </footer>
    </div>
  );
}