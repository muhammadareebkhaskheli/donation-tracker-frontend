import React from "react";
import clsx from "clsx";

export default function Button({ children, variant = "primary", href = "#" }) {
    const baseClasses =
        "px-6 py-2 text-sm font-semibold rounded-full transition-transform duration-200 active:scale-95";

    const variants = {
        recipient:
            "flex items-center justify-center px-10 py-3 text-lg font-bold tracking-wide text-blue-600 rounded-full " +
            "bg-white shadow-md " +
            "hover:bg-blue-50 hover:text-blue-700 " +
            "hover:shadow-lg hover:scale-105 active:scale-95 " +
            "transition-all duration-300 ease-out",

        donate:
            "flex items-center justify-center px-10 py-3 text-lg font-extrabold tracking-wide text-white rounded-full " +
            "bg-gradient-to-r from-sky-400 via-blue-600 to-indigo-700 " +
            "shadow-lg hover:shadow-2xl hover:scale-110 active:scale-95 " +
            "hover:from-sky-500 hover:via-blue-700 hover:to-indigo-800 " +
            "transition-all duration-300 ease-out",
    };

    return (
        <a href={href} className={clsx(baseClasses, variants[variant])}>
            {children}
        </a>
    );
}