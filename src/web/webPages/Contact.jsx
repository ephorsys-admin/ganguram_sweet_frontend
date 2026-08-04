import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { createContact } from "../../redux/features/contact/contactThunk";
import Sweets from "../../../public/Mylogo/sweets-1.png"

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

const Contact = () => {
  const dispatch = useDispatch();
  const { isLoading: isSubmitting, error } = useSelector((state) => state.contact);

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
        reason: formData.message,
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
    <div className="w-full bg-white">

      {/* Hero Banner — clean e-commerce style: single image, dark overlay, text on top */}
      <section className="relative w-full h-[220px] sm:h-[280px] md:h-[320px] overflow-hidden">
        {/* TODO: apni shop/product ki actual image yahan daalo */}
        <img
          src={Sweets}
          alt="Contact us"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-start justify-center px-4 sm:px-6 lg:px-8">
          <nav className="mb-2 text-xs font-medium text-white/70">
            <span>Home</span> <span className="mx-1.5">/</span> <span className="text-white">Contact Us</span>
          </nav>
          <h1 className="text-2xl font-bold text-white sm:text-4xl">
            Contact Us
          </h1>
          <p className="mt-2 max-w-lg text-sm text-white/85 sm:text-base">
            Questions about orders, bulk catering, or gifting? Our team is here to help.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Branch Info */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-lg font-bold text-slate-800">
              Store Details
            </h2>

            <div className="space-y-4">
              {BRANCHES.map((branch) => (
                <div
                  key={branch.city}
                  className="rounded-lg border border-slate-200 bg-white p-5"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">
                        {branch.city} Branch
                      </h3>
                      <p className="text-xs text-slate-500">
                        {branch.role}
                      </p>
                    </div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-50">
                      <MapPin size={16} className="text-slate-500" />
                    </div>
                  </div>

                  <ul className="space-y-2.5 text-sm text-slate-600">
                    <li className="flex items-start gap-2.5">
                      <MapPin size={14} className="mt-0.5 shrink-0 text-slate-400" />
                      <a
                        href={branch.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline hover:text-slate-800 transition-colors"
                      >
                        {branch.address}
                      </a>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Phone size={14} className="shrink-0 text-slate-400" />
                      <a href={`tel:${branch.phone}`} className="hover:text-slate-800 transition-colors">
                        {branch.phone}
                      </a>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Mail size={14} className="shrink-0 text-slate-400" />
                      <a href={`mailto:${branch.email}`} className="hover:text-slate-800 transition-colors">
                        {branch.email}
                      </a>
                    </li>
                    <li className="flex items-center gap-2.5 border-t border-slate-100 pt-2.5 mt-2.5 justify-between">
                      <div className="flex items-center gap-2.5">
                        <Clock size={14} className="shrink-0 text-slate-400" />
                        <span>{branch.hours}</span>
                      </div>
                      <a
                        href={branch.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-[#a65827] hover:underline"
                      >
                        Directions
                      </a>
                    </li>
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Form Area */}
          <div className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-white p-5 sm:p-7">
              {/* Form Success Overlay */}
              <AnimatePresence>
                {isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white p-6 text-center"
                  >
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600">
                      <CheckCircle2 size={30} />
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-slate-800">
                      Message Sent!
                    </h3>
                    <p className="mb-6 max-w-md text-sm leading-relaxed text-slate-500">
                      Thank you for reaching out. Our team will follow up with you shortly.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="inline-flex items-center justify-center rounded-md bg-[#8A2E2E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6b2020] cursor-pointer"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <h2 className="text-lg font-bold text-slate-800">
                Send Us a Message
              </h2>
              <p className="mt-1 mb-5 text-sm text-slate-500">
                Fill out the form below. Required fields are marked *
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Name field */}
                  <div>
                    <label htmlFor="name" className="mb-1.5 block text-xs font-semibold text-slate-700">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Rajan Dev"
                      className={`w-full rounded-md border px-3.5 py-2.5 text-sm outline-none transition-colors focus:ring-1 ${errors.name
                        ? "border-red-400 focus:ring-red-400"
                        : "border-slate-300 focus:border-[#a65827] focus:ring-[#a65827]"
                        }`}
                    />
                    {errors.name && <p className="mt-1 text-xs font-medium text-red-500">{errors.name}</p>}
                  </div>

                  {/* Phone field */}
                  <div>
                    <label htmlFor="phone" className="mb-1.5 block text-xs font-semibold text-slate-700">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. +91 98765 43210"
                      className={`w-full rounded-md border px-3.5 py-2.5 text-sm outline-none transition-colors focus:ring-1 ${errors.phone
                        ? "border-red-400 focus:ring-red-400"
                        : "border-slate-300 focus:border-[#a65827] focus:ring-[#a65827]"
                        }`}
                    />
                    {errors.phone && <p className="mt-1 text-xs font-medium text-red-500">{errors.phone}</p>}
                  </div>
                </div>

                {/* Email field */}
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. rajan@domain.com"
                    className={`w-full rounded-md border px-3.5 py-2.5 text-sm outline-none transition-colors focus:ring-1 ${errors.email
                      ? "border-red-400 focus:ring-red-400"
                      : "border-slate-300 focus:border-[#a65827] focus:ring-[#a65827]"
                      }`}
                  />
                  {errors.email && <p className="mt-1 text-xs font-medium text-red-500">{errors.email}</p>}
                </div>

                {/* Message field */}
                <div>
                  <label htmlFor="message" className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Message Details *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us what you are planning or how we can help..."
                    className={`w-full resize-none rounded-md border px-3.5 py-2.5 text-sm outline-none transition-colors focus:ring-1 ${errors.message
                      ? "border-red-400 focus:ring-red-400"
                      : "border-slate-300 focus:border-[#a65827] focus:ring-[#a65827]"
                      }`}
                  />
                  {errors.message && <p className="mt-1 text-xs font-medium text-red-500">{errors.message}</p>}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-[#8A2E2E] py-3 px-6 text-sm font-semibold text-white transition-colors hover:bg-[#6b2020] disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <>
                      <Send size={15} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="mt-10">
          <div className="rounded-lg border border-slate-200 bg-white p-5 sm:p-7">
            <div className="mb-5 flex flex-col gap-2 border-b border-slate-100 pb-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  Store Locator
                </h3>
                <p className="text-sm text-slate-500">
                  Find us on Google Maps and get directions.
                </p>
              </div>
            </div>

            <div className="relative h-[280px] w-full overflow-hidden rounded-md border border-slate-200 md:h-[380px]">
              <iframe
                title="Maharaja Ganguram Sweets Location Map"
                src="https://maps.google.com/maps?q=Maharaja+Ganguram+Sweets+MIG+30+near+Fire+Station+Square+Housing+Board+Colony+Baramunda+Bhubaneswar+Odisha+751003&t=&z=16&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full"
              ></iframe>

              {/* Overlay directions card */}
              <div className="absolute bottom-3 left-3 right-3 space-y-1.5 rounded-md border border-slate-200 bg-white p-3.5 shadow-sm sm:left-auto sm:right-3 sm:max-w-xs">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-slate-500" />
                  <span className="text-xs font-bold text-slate-800">Maharaja Ganguram Sweets</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-500">
                  MIG 30, near Fire Station Square, Housing Board Colony, Baramunda, Bhubaneswar, Odisha 751003
                </p>
                <a
                  href="https://www.google.com/maps/dir//Maharaja+Ganguram+Sweets,+MIG+30,+near+Fire+Station+Square,+Housing+Board+Colony,+Baramunda,+Bhubaneswar,+Odisha+751003/@20.2682918,85.7769154,3268m/data=!3m1!1e3!4m8!4m7!1m0!1m5!1m1!1s0x3a19a787f69051f5:0x18ac1c1810f5f93d!2m2!1d85.7983873!2d20.2804548"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-md bg-[#8A2E2E] px-3.5 py-1.5 text-[11px] font-semibold text-white transition hover:bg-[#6b2020] cursor-pointer"
                >
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
};

export default Contact;