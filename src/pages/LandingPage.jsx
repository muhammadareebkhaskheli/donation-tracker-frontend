import { motion } from "framer-motion";
import Header from "../components/Header";
import Accordion from "../components/Accordion";
import Hero from "../components/Hero";

export default function LandingPage() {
  return (
    <div className="font-sans text-gray-900">
      <Header />

      {/* ensure content starts below header */}
      <main className="pt-16">
        {/* HERO */}
        <Hero />  {/* ✅ Use Hero component */}

        {/* ABOUT SECTION */}
        <section id="about" className="min-h-[90vh] flex items-center py-16 scroll-mt-16">
          <div className="container grid gap-8 md:grid-cols-2">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.45 }}
              className="bg-white rounded-xl shadow-lg p-10 min-h-[400px] text-left"
            >
              <h3 className="text-3xl font-bold mb-4">
                Why We Built This Platform
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our mission is to create a transparent and reliable platform
                where donors can directly support those in need. Every rupee is
                tracked and every story is verified.
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="bg-gray-100 rounded-xl shadow-lg p-10 min-h-[400px] flex items-center justify-center"
            >
              <div className="text-gray-500 text-xl">📷 Placeholder for image</div>
            </motion.div>
          </div>
        </section>

        {/* SERVICES SECTION */}
        <section id="services" className="py-16 bg-gray-50">
          <div className="container grid gap-8 md:grid-cols-2">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="bg-white rounded-lg shadow p-6 text-center"
            >
              <h4 className="text-lg font-semibold mb-2">For Donors ❤️</h4>
              <p className="text-gray-600">
                View recipient needs, donate securely, and track your impact.
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.3 }}
              className="bg-white rounded-lg shadow p-6 text-center"
            >
              <h4 className="text-lg font-semibold mb-2">For Recipients 👤</h4>
              <p className="text-gray-600">
                Register, verify your documents, and receive donations.
              </p>
            </motion.div>
          </div>
        </section>

        {/* IMPACT */}
        <section id="progress" className="bg-gray-50 py-16">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-8">Our Impact</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="font-semibold mb-3">Donations by Category</h4>
                <div className="h-52 flex items-center justify-center text-gray-400">
                  [Pie Chart Placeholder]
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="font-semibold mb-3">Monthly Donation Trend</h4>
                <div className="h-52 flex items-center justify-center text-gray-400">
                  [Line Chart Placeholder]
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faqs" className="py-16">
          <div className="container max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-6">FAQs</h2>

            <div className="space-y-4">
              <Accordion title="How do I become a recipient?">
                Register on our platform and submit required documents for
                verification.
              </Accordion>

              <Accordion title="Can I donate anonymously?">
                Yes, we allow donors to choose anonymous donations.
              </Accordion>

              <Accordion title="Is my data safe?">
                We use secure encryption to protect all your data.
              </Accordion>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="bg-blue-50 py-16">
          <div className="container grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p className="text-gray-700 mb-4">
                We would love to hear from you. Fill out the form and we will
                get back to you soon.
              </p>

              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <input className="w-full p-3 rounded border" placeholder="Name" />
                <input className="w-full p-3 rounded border" placeholder="Email" />
                <input className="w-full p-3 rounded border" placeholder="Phone" />
                <textarea
                  className="w-full p-3 rounded border h-36"
                  placeholder="Message"
                />
                <button className="rounded-full px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 transition">
                  Send Message
                </button>
              </form>
            </div>

            <div className="rounded-lg overflow-hidden bg-white shadow p-6 flex items-center justify-center">
              🗺️ Map placeholder
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-gray-900 text-white py-8">
          <div className="container grid gap-8 md:grid-cols-4">
            <div>
              <div className="text-xl font-bold">Donation Tracker</div>
              <p className="text-gray-400 mt-2">
                Making donation tracking transparent and easy.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Links</h4>
              <ul className="text-gray-400 space-y-2">
                <li>
                  <a href="#home">Home</a>
                </li>
                <li>
                  <a href="#services">Services</a>
                </li>
                <li>
                  <a href="#faqs">FAQs</a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Contact</h4>
              <p className="text-gray-400 text-sm">
                support@donationtracker.example
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Follow</h4>
              <p className="text-gray-400 text-sm">Social links</p>
            </div>
          </div>

          <div className="mt-8 text-center text-gray-500 text-sm">
            © 2025 Donation Tracker. All rights reserved.
          </div>
        </footer>
      </main>
    </div>
  );
}