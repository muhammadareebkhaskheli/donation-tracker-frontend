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
                                onClick={onClose}
                                href={link.href}
                                className="block text-gray-700 font-medium py-2
               hover:text-blue-700 hover:scale-105 active:scale-95 transition-transform duration-200"
                            >
                                {link.label}
                            </a>
                        ))}
                        
                        <div className="pt-3 border-t flex flex-col gap-3">
                            <a
                                onClick={onClose}
                                href="/login"
                                className="w-full text-center px-4 py-2 border border-gray-300 rounded-full 
               bg-white text-gray-800 font-medium 
               hover:bg-gray-100 hover:scale-105 active:scale-95 transition-transform duration-200"
                            >
                                Login
                            </a>
                            <a
                                onClick={onClose}
                                href="/signup"
                                className="w-full text-center px-4 py-2 text-white rounded-full 
               bg-gradient-to-r from-blue-600 to-blue-800 shadow-md font-medium 
               hover:from-blue-700 hover:to-blue-900 hover:scale-105 active:scale-95 transition-transform duration-200"
                            >
                                Sign Up
                            </a>
                        </div>

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}