import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Phone, Mail, Clock, MapPin, ChevronRight, Send, Gift } from "lucide-react";

// ─── Inline SVGs for Socials with Custom Micro-animations ───────────────────

const FacebookIcon = () => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className="w-4 h-4"
    aria-hidden="true"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = () => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className="w-4 h-4"
    aria-hidden="true"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className="w-4.5 h-4.5"
    aria-hidden="true"
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

// ─── Medallion SVG Pattern ────────────────────────────────────────────────────

const Medallion = () => (
  <svg className="w-14 h-14 text-brand-copper" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="1.2">
    <circle cx="60" cy="60" r="54" strokeDasharray="3 3" opacity="0.6" />
    <circle cx="60" cy="60" r="48" opacity="0.8" />
    <circle cx="60" cy="60" r="42" strokeDasharray="6 2" opacity="0.4" />
    {/* Concentric octagram pattern */}
    <path d="M60 25 L65 42 L82 42 L68 53 L73 70 L60 60 L47 70 L52 53 L38 42 L55 42 Z" fill="currentColor" fillOpacity="0.08" />
    <path d="M60 30 L63 45 L78 45 L66 54 L70 69 L60 60 L50 69 L54 54 L42 45 L57 45 Z" fill="currentColor" strokeWidth="1.5" />
    <circle cx="60" cy="60" r="4" fill="currentColor" />
  </svg>
);

// ─── Data ────────────────────────────────────────────────────────────────────

const quickLinks = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "Our Sweets", path: "/menu" },
  { name: "Bulk Orders", path: "/contact" },
  { name: "Contact Us", path: "/contact" },
];

const menuSections = [
  {
    title: "Sweets Section",
    items: [
      { name: "Rasgulla", path: "/menu" },
      { name: "Gulab Jamun", path: "/menu" },
      { name: "Kaju Katli", path: "/menu" },
      { name: "Sandesh", path: "/menu" },
      { name: "Ladoo", path: "/menu" },
    ],
  },
  {
    title: "Snacks Section",
    items: [
      { name: "Namkeen Mix", path: "/menu" },
      { name: "Mathri", path: "/menu" },
      { name: "Chivda", path: "/menu" },
      { name: "Khakhra", path: "/menu" },
      { name: "Chakli", path: "/menu" },
    ],
  },
  {
    title: "Artisanal Sweets",
    items: [
      { name: "Saffron Barfi", path: "/menu" },
      { name: "Rose Petal Halwa", path: "/menu" },
      { name: "Cardamom Peda", path: "/menu" },
      { name: "Pistachio Roll", path: "/menu" },
      { name: "Dry Fruit Mithai", path: "/menu" },
    ],
  },
];

// ─── Animation Variants ──────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 15 },
  },
};

const Footer = () => {
  return (
    <motion.footer 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={containerVariants}
      className="w-full flex flex-col font-sans mt-auto overflow-hidden"
    >
      {/* ─── Top Banner Section (Image 2 Textured BG, Glassmorphism Cards) ─────────── */}
      <div 
        className="w-full bg-[url('/footer-bg.jpg')] bg-[position:center_top] bg-cover bg-no-repeat relative border-t border-brand-accent/20 py-12 md:py-16"
      >
        <div className="absolute inset-0 bg-[#FAF6F0]/20 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Tagline Glassmorphic Panel (7 cols) */}
          <motion.div 
            variants={childVariants}
            className="lg:col-span-7 bg-[#FAF6F0]/80 backdrop-blur-md border border-brand-accent/35 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row items-center gap-6 text-center md:text-left hover:border-brand-gold/30 hover:bg-[#FAF6F0]/90 transition-all duration-500 group"
          >
            {/* Rotating Medallion */}
            <div className="shrink-0 flex items-center justify-center transition-transform duration-700 group-hover:rotate-180">
              <Medallion />
            </div>

            <div>
              <h2 className="font-serif font-bold text-2xl md:text-3xl text-brand-dark tracking-wide leading-tight">
                A Taste of Tradition,<br />
                <span className="text-brand-copper italic font-normal">A Heritage of Purity.</span>
              </h2>
              <div className="w-16 h-0.5 bg-brand-gold/70 my-3 group-hover:w-28 transition-all duration-500 ease-out" />
              <p className="text-xs md:text-sm text-brand-dark/80 leading-relaxed font-sans font-medium">
                Preserving the artisanal legacy of traditional Indian confectionery since 2014. Crafted with love, delivered with honor.
              </p>
            </div>
          </motion.div>

          {/* modern Newsletter Subscription Panel (5 cols) */}
          <motion.div 
            variants={childVariants}
            className="lg:col-span-5 bg-brand-dark/95 backdrop-blur-md border border-brand-accent/15 rounded-3xl p-6 md:p-8 shadow-xl text-brand-cream hover:border-brand-gold/30 transition-all duration-500"
          >
            <div className="flex items-center gap-3 mb-2.5">
              <span className="text-brand-gold text-lg">✦</span>
              <h3 className="font-serif font-bold text-lg text-white tracking-wide">
                Join the Royal Circle
              </h3>
            </div>
            
            <p className="text-xs text-brand-cream/75 leading-relaxed mb-5 font-sans">
              Subscribe to receive exclusive offers, direct delivery notifications, and premium sweets insights.
            </p>

            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter your email address"
                className="flex-1 bg-brand-cream/5 border border-brand-accent/25 rounded-xl px-4 py-2.5 text-xs text-white placeholder-brand-cream/40 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all duration-300 font-medium"
              />
              <button 
                type="submit" 
                aria-label="Subscribe"
                className="bg-brand-copper hover:bg-brand-gold text-white hover:text-brand-dark rounded-xl px-4 py-2.5 font-semibold text-xs tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-brand-gold/10 hover:-translate-y-0.5 cursor-pointer"
              >
                <span>SEND</span>
                <Send className="w-3 h-3 stroke-[2]" />
              </button>
            </form>
          </motion.div>

        </div>
      </div>

      {/* ─── Bottom Info Section (Rich Terracotta BG with Gold Highlights) ─── */}
      <div 
        className="w-full text-brand-cream border-t border-brand-cream/10 relative"
        style={{ 
          background: "linear-gradient(180deg, #A85A28 0%, #904c1f 100%)" // Beautifully graded terracotta
        }}
      >
        {/* Subtle gold divider line with glow */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent shadow-sm" />

        <div className="max-w-7xl mx-auto px-6 py-14">
          {/* Main Footer Links Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 items-start">
            
            {/* Column 1: Brand Info & Socials (3 cols) */}
            <motion.div 
              variants={childVariants}
              className="lg:col-span-3 flex flex-col items-start gap-4"
            >
              <Link to="/" className="flex items-center gap-3.5 group">
                <div className="h-14 w-14 rounded-full overflow-hidden border border-brand-cream/30 bg-brand-cream p-0.5 shadow-md flex items-center justify-center transition-all duration-500 group-hover:scale-105 group-hover:border-brand-gold">
                  <img
                    src="/Mylogo/logo.png"
                    alt="Maharaja Ganguram Sweets Logo"
                    className="h-full w-full object-contain rounded-full transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-serif font-bold text-xl tracking-wide text-white leading-tight">
                    Maharaja
                  </span>
                  <span className="font-serif italic font-normal text-xs text-brand-cream/80 tracking-wider">
                    Ganguram Sweets
                  </span>
                </div>
              </Link>
              
              <p className="text-[13px] text-brand-cream/80 leading-relaxed font-serif italic mt-1">
                Authentic Indian sweets made with timeless recipes and the finest ingredients.
              </p>

              {/* Social Circles with float / hover transitions */}
              <div className="flex gap-3.5 mt-3">
                {[
                  { Icon: FacebookIcon, href: "https://facebook.com/ganguram", label: "Facebook" },
                  { Icon: InstagramIcon, href: "https://instagram.com/ganguram", label: "Instagram" },
                  { Icon: WhatsAppIcon, href: "https://wa.me/918015550199", label: "WhatsApp" }
                ].map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-10 h-10 rounded-xl flex items-center justify-center border border-brand-cream/25 text-brand-cream/90 hover:text-brand-dark hover:border-brand-gold hover:bg-brand-gold hover:-translate-y-1 hover:rotate-6 transition-all duration-300 shadow-md hover:shadow-brand-gold/20"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Column 2: Quick Links (2 cols) */}
            <motion.div 
              variants={childVariants}
              className="lg:col-span-2"
            >
              <h3 className="font-serif font-bold text-white text-sm uppercase tracking-widest mb-5 border-b border-brand-cream/15 pb-2 relative flex items-center gap-1.5 before:absolute before:bottom-0 before:left-0 before:w-8 before:h-[1px] before:bg-brand-gold">
                Quick Links
              </h3>
              <ul className="space-y-2.5">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="group flex items-center gap-2 text-xs text-brand-cream/85 hover:text-brand-gold transition-all duration-300 transform hover:translate-x-1.5 font-medium"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-brand-cream/40 group-hover:text-brand-gold transition-colors shrink-0" />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Column 3: Divided Product Menu Columns (5 cols) */}
            <motion.div 
              variants={childVariants}
              className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 gap-6"
            >
              {menuSections.map((section) => (
                <div key={section.title}>
                  <h3 className="font-serif font-semibold text-white text-xs uppercase tracking-widest mb-5 border-b border-brand-cream/15 pb-2 relative flex items-center gap-1.5 before:absolute before:bottom-0 before:left-0 before:w-8 before:h-[1px] before:bg-brand-gold">
                    {section.title}
                  </h3>
                  <ul className="space-y-2.5">
                    {section.items.map((item) => (
                      <li key={item.name}>
                        <Link
                          to={item.path}
                          className="group flex items-center gap-2 text-xs text-brand-cream/80 hover:text-brand-gold transition-all duration-300 transform hover:translate-x-1.5 font-medium"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-gold/30 group-hover:bg-brand-gold scale-75 group-hover:scale-100 transition-all duration-300 shrink-0" />
                          <span>{item.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </motion.div>

            {/* Column 4: Contact Cards (2 cols) */}
            <motion.div 
              variants={childVariants}
              className="lg:col-span-2 space-y-4"
            >
              {/* Customer Care Box Card */}
              <div className="p-4 rounded-2xl bg-brand-cream/5 border border-brand-cream/10 hover:border-brand-gold/35 hover:bg-brand-cream/10 transition-all duration-300 group hover:-translate-y-0.5">
                <h3 className="font-serif font-bold text-white text-xs uppercase tracking-widest mb-3 border-b border-brand-cream/15 pb-1 relative before:absolute before:bottom-0 before:left-0 before:w-5 before:h-[1px] before:bg-brand-gold">
                  Customer Care
                </h3>
                <ul className="space-y-2.5 text-xs text-brand-cream/90">
                  <li className="flex items-center gap-2 hover:text-brand-gold transition-colors duration-200">
                    <Phone className="w-3.5 h-3.5 text-brand-gold/80 shrink-0" />
                    <span>+91 801 555 0199</span>
                  </li>
                  <li className="flex items-center gap-2 hover:text-brand-gold transition-colors duration-200">
                    <Mail className="w-3.5 h-3.5 text-brand-gold/80 shrink-0" />
                    <span className="break-all">hello@ganguram.in</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Clock className="w-3.5 h-3.5 text-brand-gold/70 shrink-0 mt-0.5" />
                    <span className="leading-tight">Mon - Sat:<br/>9 AM - 8 PM</span>
                  </li>
                </ul>
              </div>

              {/* Location Card */}
              <div className="p-4 rounded-2xl bg-brand-cream/5 border border-brand-cream/10 hover:border-brand-gold/35 hover:bg-brand-cream/10 transition-all duration-300 group hover:-translate-y-0.5">
                <h3 className="font-serif font-bold text-white text-xs uppercase tracking-widest mb-3 border-b border-brand-cream/15 pb-1 relative before:absolute before:bottom-0 before:left-0 before:w-5 before:h-[1px] before:bg-brand-gold">
                  Store Location
                </h3>
                <p className="flex items-start gap-2 text-xs text-brand-cream/90 leading-relaxed hover:text-brand-gold transition-colors duration-200">
                  <MapPin className="w-3.5 h-3.5 text-brand-gold/80 shrink-0 mt-0.5" />
                  <span>123 Royal Lane, Kolkata, WB 700001, India</span>
                </p>
              </div>
            </motion.div>

          </div>

          {/* Delivery happiness / Bottom bar */}
          <motion.div 
            variants={childVariants}
            className="mt-12 pt-6 border-t border-brand-cream/15 flex flex-col md:flex-row justify-between items-center gap-6"
          >
            {/* Interactive Happiness Widget */}
            <div className="flex items-center gap-4 group cursor-default">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-brand-cream/15 bg-brand-cream/5 group-hover:bg-brand-gold group-hover:border-brand-gold group-hover:text-brand-dark transition-all duration-500 shadow-md group-hover:shadow-brand-gold/25 group-hover:-translate-y-0.5"
              >
                <Gift className="w-5 h-5 text-brand-cream group-hover:text-brand-dark transition-colors" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xs font-semibold text-white tracking-widest uppercase transition-colors duration-300 group-hover:text-brand-gold">
                  We Deliver Happiness
                </span>
                <span className="text-[11px] text-brand-cream/70 leading-tight">
                  Across India with royal care and freshness
                </span>
              </div>
            </div>

            {/* Copyright & Legal Links */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-[11px] text-brand-cream/60">
              <p>&copy; {new Date().getFullYear()} <span className="text-white hover:text-brand-gold transition-colors">Maharaja Ganguram Sweets</span>.</p>
              <div className="flex gap-4">
                <a href="#" className="hover:text-brand-gold transition-colors duration-200 underline decoration-transparent hover:decoration-brand-gold underline-offset-4">
                  Privacy Policy
                </a>
                <span className="opacity-30">|</span>
                <a href="#" className="hover:text-brand-gold transition-colors duration-200 underline decoration-transparent hover:decoration-brand-gold underline-offset-4">
                  Terms of Service
                </a>
                <span className="opacity-30">|</span>
                <a href="#" className="hover:text-brand-gold transition-colors duration-200 underline decoration-transparent hover:decoration-brand-gold underline-offset-4">
                  Sitemap
                </a>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;