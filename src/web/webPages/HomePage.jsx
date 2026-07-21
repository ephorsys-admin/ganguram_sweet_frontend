import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingCart, Award, ArrowRight } from "lucide-react";

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

  // Sweets data for Maharaja Collection
  const sweetCollection = [
    {
      id: 1,
      name: "Classic Rajbhog",
      description: "Saffron-infused cottage cheese balls in light syrup.",
      price: "$12.00",
      badge: "BEST SELLER",
      image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=500&auto=format&fit=crop",
      isCart: true,
    },
    {
      id: 2,
      name: "Premium Kaju Katli",
      description: "Finest cashews ground to perfection with silver leaf.",
      price: "$15.00",
      badge: "SIGNATURE",
      image: "https://images.unsplash.com/photo-1601356616077-695728ecf769?q=80&w=500&auto=format&fit=crop",
      isCart: false,
    },
    {
      id: 3,
      name: "Motichoor Laddu",
      description: "Fine gram flour pearls fried in desi ghee & cardamom.",
      price: "$10.00",
      badge: "SEASONAL",
      image: "https://images.unsplash.com/photo-1605197397734-e431ea624b5a?q=80&w=500&auto=format&fit=crop",
      isCart: true,
    },
  ];

  return (
    <div className="w-full bg-[#FAF6F0]">
      {/* 1. Hero Section */}
      <div 
        className="relative min-h-[90vh] md:min-h-screen w-full flex items-center bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${sweetBgImage})`,
        }}
      >
        {/* Subtly faded overlay gradient to show the sweets clearly on the right while maintaining text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF6F0]/95 via-[#FAF6F0]/80 to-[#FAF6F0]/40 md:bg-gradient-to-r md:from-[#FAF6F0]/95 md:via-[#FAF6F0]/70 md:to-transparent -z-0" />

        {/* Main Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-28 md:pt-16">
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

      {/* 2. Our Legacy of Purity Section */}
      <section className="py-20 md:py-28 bg-[#FAF6F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Column: Image */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/5] max-w-md mx-auto lg:max-w-none w-full"
            >
              <img 
                src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop" 
                alt="Our Legacy of Purity chef" 
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Right Column: Title and Details */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col justify-center text-left"
            >
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-dark">
                Our Legacy of Purity
              </h2>
              <div className="w-12 h-1 bg-brand-copper mt-4"></div>
              
              <p className="mt-8 text-brand-dark/80 text-sm sm:text-base leading-relaxed">
                Since 2014, Maharaja Ganguram Sweets has been the custodian of Kolkata's rich confectionery tradition. Our journey began with a simple promise: to bring the authentic taste of royal kitchens to your table.
              </p>

              {/* Stats Box Container */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="p-6 rounded-xl bg-white/50 border border-brand-copper/10 backdrop-blur-sm">
                  <div className="font-serif text-3xl sm:text-4xl font-bold text-brand-copper">10+</div>
                  <div className="text-xs sm:text-sm text-brand-dark/70 font-semibold tracking-wider uppercase mt-1">Years of Craft</div>
                </div>
                <div className="p-6 rounded-xl bg-white/50 border border-brand-copper/10 backdrop-blur-sm">
                  <div className="font-serif text-3xl sm:text-4xl font-bold text-brand-copper">50+</div>
                  <div className="text-xs sm:text-sm text-brand-dark/70 font-semibold tracking-wider uppercase mt-1">Original Recipes</div>
                </div>
              </div>

              {/* Quote */}
              <blockquote className="mt-8 text-brand-dark/75 italic text-sm sm:text-base font-normal">
                "Every sweet tells a story of heritage, every bite a celebration of culture."
              </blockquote>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. The Maharaja Collection Section */}
      <section className="py-20 md:py-24 bg-white/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 sm:mb-16">
            <div className="text-left">
              <span className="text-xs font-bold text-brand-copper tracking-widest uppercase block mb-2">HANDCRAFTED EXCELLENCE</span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-dark">The Maharaja Collection</h2>
            </div>
            <div>
              <Link 
                to="/menu" 
                className="inline-flex items-center gap-2 text-brand-copper hover:text-brand-copper/85 font-semibold text-sm tracking-wider uppercase transition-colors group"
              >
                View All Sweets
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sweetCollection.map((sweet, index) => (
              <motion.div 
                key={sweet.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="bg-[#FAF6F0]/65 hover:bg-[#FAF6F0]/90 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-brand-copper/5 group"
              >
                {/* Image Container with Badge */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <span className="absolute top-4 left-4 z-10 px-3 py-1 rounded bg-[#FAF6F0]/90 backdrop-blur-xs text-[10px] sm:text-xs font-bold uppercase tracking-wider text-brand-copper border border-brand-copper/10">
                    {sweet.badge}
                  </span>
                  <img 
                    src={sweet.image} 
                    alt={sweet.name} 
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="p-6 text-left flex flex-col justify-between min-h-[160px]">
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-dark mb-2">{sweet.name}</h3>
                    <p className="text-brand-dark/75 text-xs sm:text-sm leading-relaxed mb-4">{sweet.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-serif text-lg font-bold text-brand-copper">{sweet.price}</span>
                    <button 
                      className="w-10 h-10 rounded-full flex items-center justify-center bg-[#F1ECE4] hover:bg-brand-copper hover:text-white text-brand-dark transition-all duration-300 cursor-pointer"
                      aria-label={sweet.isCart ? "Add to cart" : "Featured Item"}
                    >
                      {sweet.isCart ? (
                        <ShoppingCart className="w-5 h-5" />
                      ) : (
                        <Award className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
};

export default HomePage;