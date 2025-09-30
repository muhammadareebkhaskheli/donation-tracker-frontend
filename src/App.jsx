export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow p-4">
        <h1 className="text-2xl font-bold text-blue-600">Donation Tracker</h1>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center p-8">
        <h2 className="text-4xl font-extrabold mb-4">Make an Impact Today</h2>
        <p className="text-lg text-gray-600 mb-6">
          Track your donations and help communities in need.
        </p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
          Get Started
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-gray-200 text-center p-4">
        <p className="text-gray-700">© 2025 Donation Tracker. All rights reserved.</p>
      </footer>
    </div>
  )
}