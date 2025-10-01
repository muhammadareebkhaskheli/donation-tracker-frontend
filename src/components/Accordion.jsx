import { useState } from "react";
import { motion } from "framer-motion";

export default function Accordion({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-4 py-3 flex justify-between items-center bg-white"
      >
        <span className="font-medium">{title}</span>
        <span className="text-gray-500">{open ? "-" : "+"}</span>
      </button>

      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={open ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="px-4 overflow-hidden bg-gray-50"
      >
        <div className="py-3 text-gray-600">{children}</div>
      </motion.div>
    </div>
  );
}