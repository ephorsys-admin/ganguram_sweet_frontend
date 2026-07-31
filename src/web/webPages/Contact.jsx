import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Sparkles,
  ChevronDown
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { createContact } from "../../redux/features/contact/contactThunk";

const BRANCHES = [
  {
    city: "Bhubaneswar",
    role: "100% Pure Vegetarian & Onion-Garlic Free",
    address: "MIG 30, near Fire Station Square, Housing Board Colony, Baramunda, Bhubaneswar, Odisha 751003",
    phone: "+91 94371 66822",
    email: "maharaja.ganguram@gmail.com",
    hours: "7:00 AM - 10:00 PM (Everyday)",
    mapUrl: "https://www.google.com/maps/dir//Maharaja+Ganguram+Sweets,+MIG+30,+near+Fire+Station+Square,+Housing+Board+Colony,+Baramunda,+Bhubaneswar,+Odisha+751003/@20.2682918,85.7769154,3268m/data=!3m1!1e3!4m8!4m7!1m0!1m5!1m1!1s0x3a19a787f69051f5:0x18ac1c1810f5f93d!2m2!1d85.7983873!2d20.2804548"
  },
];

const INQUIRY_TYPES = [
  "General Inquiry",
  "Bulk & Party Catering",
  "Corporate Gifting",
  "Franchise Queries",
  "Feedback & Review",
];

// Helper Abstract contact envelope graphics to match the visual style of AboutUs.jsx
const ContactAbstractBlob = () => (
  <svg viewBox="0 0 220 220" className="w-full h-full drop-shadow-xl">
    <defs>
      <radialGradient id="contactAbstractGrad" cx="35%" cy="30%" r="85%">
        <stop offset="0%" stopColor="#FFF3D6" />
        <stop offset="60%" stopColor="#F4D383" />
        <stop offset="100%" stopColor="#D9962E" />
      </radialGradient>
    </defs>
    
    {/* Main circular base */}
    <circle cx="110" cy="115" r="85" fill="url(#contactAbstractGrad)" />
    
    {/* Vintage Detailed envelope shape inside: fill white, outline red */}
    <rect
      x="75"
      y="90"
      width="70"
      height="48"
      rx="4"
      fill="#FFFDF8"
      stroke="#8A2E2E"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <path
      d="M75,90 L110,118 L145,90"
      stroke="#8A2E2E"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M75,138 L103,115 M145,138 L117,115"
      stroke="#8A2E2E"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.8"
    />

    {/* Floating tiny circles */}
    {Array.from({ length: 12 }).map((_, i) => {
      const a = (i / 12) * Math.PI * 2;
      const r = 45 + (i % 3) * 10;
      return (
        <circle
          key={i}
          cx={110 + Math.cos(a) * r}
          cy={115 + Math.sin(a) * r}
          r={3 + (i % 3)}
          fill="#FFEFC2"
          opacity="0.85"
        />
      );
    })}
  </svg>
);

const HERO_GRADIENTS = [
  "linear-gradient(160deg, #FFF3D6, #F6D989)", // Saffron / Sweet Yellow
  "linear-gradient(160deg, #FFF9EF, #F0E2C4)", // Rasgulla / Creamy Gold
  "linear-gradient(160deg, #F3D9C4, #C98B5E)", // Gulab Jamun / Warm Caramel
  "linear-gradient(160deg, #FBF3DD, #E9CE8F)", // Kaju Katli / Silver Honey
];

const Contact = () => {
  const [gradientIndex, setGradientIndex] = useState(0);
  const dispatch = useDispatch();
  const { isLoading: isSubmitting, error } = useSelector((state) => state.contact);

  useEffect(() => {
    const timer = setInterval(() => {
      setGradientIndex((prev) => (prev + 1) % HERO_GRADIENTS.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    type: "General Inquiry",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = "Name is required";
    if (!formData.email.trim()) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim()) {
      tempErrors.phone = "Phone number is required";
    } else if (!/^\+?[0-9\s-]{10,14}$/.test(formData.phone.replace(/\s+/g, ""))) {
      tempErrors.phone = "Please enter a valid phone number";
    }
    if (!formData.message.trim()) tempErrors.message = "Message details required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        reason: `[${formData.type}] ${formData.message}`,
      };

      const resultAction = await dispatch(createContact(payload)).unwrap();
      
      if (resultAction.success) {
        setIsSubmitted(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          type: "General Inquiry",
          message: "",
        });
      }
    } catch (err) {
      console.error("Failed to submit inquiry:", err);
      // Optional: Add a toast notification for error here
    }
  };

  return (
    <div className="w-full" style={{ backgroundColor: "#FFFDF8" }}>
      
      {/* Hero Section - Matching AboutUs.jsx exactly with animated bg gradient cross-fading */}
      <section className="w-full relative overflow-hidden">
        {/* Background Gradients cross-fading */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={gradientIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ background: HERO_GRADIENTS[gradientIndex] }}
          />
        </AnimatePresence>

        {/* Content Overlay */}
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col-reverse items-center gap-8 px-4 py-14 sm:px-6 md:flex-row md:justify-between md:py-20 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-xl text-center md:text-left"
          >
            <span
              className="text-sm font-bold uppercase tracking-widest"
              style={{ color: "#8A2E2E" }}
            >
              Get In Touch
            </span>
            <h1
              className="mt-3 text-3xl font-bold leading-tight sm:text-5xl"
              style={{ color: "#3D1F12" }}
            >
              Let's Start a Sweet Conversation
            </h1>
            <p className="mt-4 text-base sm:text-lg" style={{ color: "#5C3A24" }}>
              Have questions about our heritage recipes, custom catering for weddings, or bulk gifting? Reach out to our hospitality team.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: -6 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="shrink-0 drop-shadow-2xl w-40 h-40 md:w-56 md:h-56"
          >
            <ContactAbstractBlob />
          </motion.div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Branch Lounges - styled matching AboutUs layout */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-2xl font-bold sm:text-3xl" style={{ color: "#3D1F12" }}>
              Our Heritage Lounges
            </h2>
            
            <div className="space-y-6">
              {BRANCHES.map((branch, index) => (
                <motion.div
                  key={branch.city}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="rounded-2xl border bg-white p-6 shadow-sm"
                  style={{ borderColor: "#F0E4CC" }}
                >
                  <div className="flex items-center justify-between border-b pb-3 mb-4" style={{ borderColor: "#F0E4CC" }}>
                    <div>
                      <h3 className="text-lg font-bold" style={{ color: "#3D1F12" }}>
                        {branch.city} Branch
                      </h3>
                      <p className="text-xs font-semibold" style={{ color: "#8A2E2E" }}>
                        {branch.role}
                      </p>
                    </div>
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-full"
                      style={{ backgroundColor: "#FBF3E4" }}
                    >
                      <MapPin size={18} style={{ color: "#8A2E2E" }} />
                    </div>
                  </div>

                  <ul className="space-y-2.5 text-sm" style={{ color: "#7A5C4A" }}>
                    <li className="flex items-start gap-2.5">
                      <MapPin size={15} className="mt-0.5 shrink-0 text-[#8A2E2E]" />
                      <a
                        href={branch.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline hover:text-[#8A2E2E] transition-colors"
                      >
                        {branch.address}
                      </a>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Phone size={15} className="shrink-0 text-[#8A2E2E]" />
                      <a href={`tel:${branch.phone}`} className="hover:opacity-85 transition-opacity">
                        {branch.phone}
                      </a>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Mail size={15} className="shrink-0 text-[#8A2E2E]" />
                      <a href={`mailto:${branch.email}`} className="hover:opacity-85 transition-opacity">
                        {branch.email}
                      </a>
                    </li>
                    <li className="flex items-center gap-2.5 border-t pt-2 mt-2 justify-between" style={{ borderColor: "#FBF3E4" }}>
                      <div className="flex items-center gap-2.5">
                        <Clock size={15} className="shrink-0 text-[#7A5C4A]" />
                        <span>{branch.hours}</span>
                      </div>
                      <a
                        href={branch.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-[#8A2E2E] hover:underline"
                      >
                        Get Directions
                      </a>
                    </li>
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Form Area */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-2xl p-6 sm:p-8 border shadow-sm relative overflow-hidden"
              style={{ borderColor: "#F0E4CC" }}
            >
              {/* Form Success Overlay */}
              <AnimatePresence>
                {isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-white z-10 flex flex-col items-center justify-center p-6 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 10 }}
                      className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                      style={{ backgroundColor: "#FBF3E4", color: "#8A2E2E" }}
                    >
                      <CheckCircle2 size={36} />
                    </motion.div>
                    <h3 className="text-xl font-bold mb-2" style={{ color: "#3D1F12" }}>
                      Message Sent!
                    </h3>
                    <p className="max-w-md text-sm leading-relaxed mb-6" style={{ color: "#7A5C4A" }}>
                      Thank you for contacting Mithai Ghar. We have received your inquiry and our sweet hospitality manager will follow up with you shortly.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-bold text-white shadow-md hover:opacity-95 transition"
                      style={{ backgroundColor: "#8A2E2E" }}
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <h2 className="text-2xl font-bold" style={{ color: "#3D1F12" }}>
                Send Us a Message
              </h2>
              <p className="text-sm mt-1 mb-6" style={{ color: "#7A5C4A" }}>
                Fill out the form details below. Required fields are marked *
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Name field */}
                  <div>
                    <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#3D1F12" }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Rajan Dev"
                      className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-hidden focus:ring-1 ${
                        errors.name
                          ? "border-red-500 ring-1 ring-red-500"
                          : "border-[#F0E4CC] focus:ring-[#8A2E2E] focus:border-[#8A2E2E]"
                      }`}
                      style={{ backgroundColor: "#FFFDF8", color: "#3D1F12" }}
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-500 font-semibold">{errors.name}</p>}
                  </div>

                  {/* Phone field */}
                  <div>
                    <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#3D1F12" }}>
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. +91 98765 43210"
                      className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-hidden focus:ring-1 ${
                        errors.phone
                          ? "border-red-500 ring-1 ring-red-500"
                          : "border-[#F0E4CC] focus:ring-[#8A2E2E] focus:border-[#8A2E2E]"
                      }`}
                      style={{ backgroundColor: "#FFFDF8", color: "#3D1F12" }}
                    />
                    {errors.phone && <p className="mt-1 text-xs text-red-500 font-semibold">{errors.phone}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Email field */}
                  <div>
                    <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#3D1F12" }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. rajan@domain.com"
                      className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-hidden focus:ring-1 ${
                        errors.email
                          ? "border-red-500 ring-1 ring-red-500"
                          : "border-[#F0E4CC] focus:ring-[#8A2E2E] focus:border-[#8A2E2E]"
                      }`}
                      style={{ backgroundColor: "#FFFDF8", color: "#3D1F12" }}
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-500 font-semibold">{errors.email}</p>}
                  </div>

                  {/* Inquiry Type field */}
                  <div>
                    <label htmlFor="type" className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#3D1F12" }}>
                      Nature of Inquiry *
                    </label>
                    <div className="relative">
                      <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-[#F0E4CC] text-sm appearance-none focus:outline-hidden focus:ring-1 focus:ring-[#8A2E2E] focus:border-[#8A2E2E] transition-all cursor-pointer"
                        style={{ backgroundColor: "#FFFDF8", color: "#3D1F12" }}
                      >
                        {INQUIRY_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={16}
                        className="absolute right-4 top-3.5 pointer-events-none"
                        style={{ color: "#7A5C4A" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Message field */}
                <div>
                  <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#3D1F12" }}>
                    Message Details *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us what you are planning or how we can help..."
                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-hidden focus:ring-1 ${
                      errors.message
                        ? "border-red-500 ring-1 ring-red-500"
                        : "border-[#F0E4CC] focus:ring-[#8A2E2E] focus:border-[#8A2E2E]"
                    }`}
                    style={{ backgroundColor: "#FFFDF8", color: "#3D1F12" }}
                  />
                  {errors.message && <p className="mt-1 text-xs text-red-500 font-semibold">{errors.message}</p>}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 rounded-full py-3 px-6 text-sm font-bold text-white shadow-lg cursor-pointer transition-all hover:opacity-95 disabled:opacity-50"
                  style={{ backgroundColor: "#8A2E2E" }}
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={15} />
                      Send Sweet Message
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>

        {/* Vintage Interactive Map */}
        <div className="mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border bg-white p-6 sm:p-8 shadow-sm"
            style={{ borderColor: "#F0E4CC" }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 mb-8" style={{ borderColor: "#F0E4CC" }}>
              <div>
                <h3 className="text-xl font-bold font-serif" style={{ color: "#3D1F12" }}>
                  Maharaja Ganguram Store Locator
                </h3>
                <p className="text-sm" style={{ color: "#7A5C4A" }}>
                  Find us on Google Maps and get royal directions to our sweet store.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold" style={{ color: "#7A5C4A" }}>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#8A2E2E] inline-block animate-pulse" />
                  <span>Flagship Store</span>
                </div>
              </div>
            </div>

            {/* Google Map iframe container */}
            <div
              className="h-[300px] md:h-[400px] w-full rounded-xl relative overflow-hidden border flex items-center justify-center shadow-inner"
              style={{ borderColor: "#F0E4CC" }}
            >
              <iframe
                title="Maharaja Ganguram Sweets Location Map"
                src="https://maps.google.com/maps?q=Maharaja+Ganguram+Sweets+MIG+30+near+Fire+Station+Square+Housing+Board+Colony+Baramunda+Bhubaneswar+Odisha+751003&t=&z=16&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              ></iframe>
              
              {/* Overlay directions link card */}
              <div className="absolute bottom-4 right-4 left-4 sm:left-auto bg-white/95 p-4 rounded-xl border border-[#F0E4CC] shadow-md max-w-sm space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-[#8A2E2E]" />
                  <span className="text-xs font-bold text-[#3D1F12]">Maharaja Ganguram Sweets</span>
                </div>
                <p className="text-[10px] text-[#7A5C4A] leading-relaxed">
                  MIG 30, near Fire Station Square, Housing Board Colony, Baramunda, Bhubaneswar, Odisha 751003
                </p>
                <a
                  href="https://www.google.com/maps/dir//Maharaja+Ganguram+Sweets,+MIG+30,+near+Fire+Station+Square,+Housing+Board+Colony,+Baramunda,+Bhubaneswar,+Odisha+751003/@20.2682918,85.7769154,3268m/data=!3m1!1e3!4m8!4m7!1m0!1m5!1m1!1s0x3a19a787f69051f5:0x18ac1c1810f5f93d!2m2!1d85.7983873!2d20.2804548"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 text-[11px] font-bold text-white bg-[#8A2E2E] hover:bg-[#6b2020] px-4 py-2 rounded-full shadow-sm hover:shadow-md transition cursor-pointer"
                >
                  <Sparkles size={11} className="text-[#FFEFC2]" />
                  Get Directions in Google Maps
                </a>
              </div>
            </div>
          </motion.div>
        </div>

      </section>
    </div>
  );
};

export default Contact;
