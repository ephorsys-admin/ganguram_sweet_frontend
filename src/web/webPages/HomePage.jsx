import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const HomePage = () => {
  // Clear, high-resolution Rasgulla and Gulab Jamun sweets background image
  const sweetBgImage = "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=2070&auto=format&fit=crop";

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  return (
    <div 
      className="relative min-h-screen w-full flex items-center bg-cover bg-center"
      style={{ 
        backgroundImage: `url(${sweetBgImage})`,
      }}
    >
      {/* Subtly faded overlay gradient to show the sweets clearly on the right while maintaining text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FAF6F0]/95 via-[#FAF6F0]/80 to-[#FAF6F0]/40 md:bg-gradient-to-r md:from-[#FAF6F0]/95 md:via-[#FAF6F0]/70 md:to-transparent -z-0" />

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24 md:pt-16">
        <div className="max-w-2xl text-left">
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col justify-center"
          >
            {/* Established Badge */}
            <motion.div variants={itemVariants} className="self-start">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-brand-copper/10 border border-brand-copper/20 text-brand-copper text-xs font-semibold tracking-widest uppercase mb-6 shadow-sm">
                Established Since 2014
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 variants={itemVariants} className="leading-tight">
              <span className="block font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-brand-dark tracking-wide">
                The Royal Heritage of
              </span>
              <span className="block font-serif italic text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-brand-copper font-normal mt-2 leading-none">
                Authentic Indian Sweets
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="mt-6 text-brand-dark/85 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl font-medium"
            >
              Experience the decadence of hand-crafted confections made from century-old recipes,
              using only the purest ingredients and a legacy of passion.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={itemVariants}
              className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
            >
              <Link
                to="/menu"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-brand-copper hover:bg-brand-copper/90 text-white font-semibold text-sm tracking-widest rounded-xl shadow-lg hover:shadow-brand-copper/25 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 uppercase"
              >
                Explore Menu
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center px-8 py-3.5 border border-brand-dark/40 hover:border-brand-copper hover:text-brand-copper text-brand-dark hover:bg-brand-copper/5 font-semibold text-sm tracking-widest rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 uppercase"
              >
                Our Story
              </Link>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default HomePage;