import { motion, AnimatePresence } from "framer-motion";

export default function MobileMenu({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="md:hidden bg-white shadow-lg border-t"
        >
          <div className="px-4 py-5 space-y-4">
            <a onClick={onClose} href="#home" className="block text-gray-700">Home</a>
            <a onClick={onClose} href="#about" className="block text-gray-700">About</a>
            <a onClick={onClose} href="#services" className="block text-gray-700">Services</a>
            <a onClick={onClose} href="#progress" className="block text-gray-700">Progress</a>
            <a onClick={onClose} href="#faqs" className="block text-gray-700">FAQs</a>
            <a onClick={onClose} href="#contact" className="block text-gray-700">Contact</a>

            <div className="pt-3 border-t flex flex-col gap-3">
              <a onClick={onClose} href="#login" className="w-full text-center px-4 py-2 border border-gray-300 rounded-full">Login</a>
              <a onClick={onClose} href="#signup" className="w-full text-center px-4 py-2 bg-black text-white rounded-full">Sign Up</a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}