export default function Hero() {
    return (
        <section id="home" className="relative w-full h-[80vh] md:h-[90vh] scroll-mt-16">
            {/* Background Image */}
            <img
                src="/Hero.png"  // ✅ no /public, just /Hero.png
                alt="Donation hero"
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/40"></div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
                <h1 className="text-3xl md:text-6xl font-bold text-white drop-shadow-lg">
                    Every Donation Counts
                </h1>
                <p className="mt-4 text-lg md:text-xl text-white/90 max-w-2xl">
                    Support by donating money or becoming a recipient. Together, we save lives.
                </p>

                {/* Buttons */}
                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                    <a
                        href="#donate"
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg 
  transition-transform duration-200 hover:scale-105 active:scale-95 text-center"
                    >
                        Donate Now
                    </a>
                    <a
                        href="#recipient"
                        className="bg-white hover:bg-gray-100 text-red-600 px-6 py-3 rounded-xl font-semibold shadow-lg 
  transition-transform duration-200 hover:scale-105 active:scale-95 text-center"
                    >
                        Become a Recipient
                    </a>
                </div>
            </div>
        </section>
    );
}
