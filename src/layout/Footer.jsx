import { motion } from "framer-motion";
import { MapPin, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M13.5 21v-8.2h2.75l.41-3.2h-3.16V7.5c0-.93.26-1.56 1.59-1.56h1.7V3.1C15.99 3.07 15 3 13.85 3c-2.31 0-3.89 1.41-3.89 4v2.6H7.2v3.2h2.76V21h3.54Z" />
  </svg>
);

const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const TwitterIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M20 5.9c-.66.3-1.36.5-2.1.6a3.6 3.6 0 0 0 1.6-2 7.3 7.3 0 0 1-2.3.9 3.6 3.6 0 0 0-6.2 3.3A10.3 10.3 0 0 1 3.7 4.9a3.6 3.6 0 0 0 1.1 4.8c-.58-.02-1.13-.18-1.6-.44v.05a3.6 3.6 0 0 0 2.9 3.55 3.6 3.6 0 0 1-1.6.06 3.6 3.6 0 0 0 3.4 2.5A7.3 7.3 0 0 1 2 16.9a10.3 10.3 0 0 0 5.6 1.6c6.7 0 10.4-5.6 10.4-10.4v-.47c.7-.5 1.3-1.15 1.8-1.9-.65.3-1.35.5-2.08.6.75-.45 1.3-1.15 1.58-2Z" />
  </svg>
);

const QUICK_LINKS = ["Home", "About", "Our Items", "Gallery", "Contact"];
const LINK_MAP = {
  "Home": "/",
  "About": "/about",
  "Our Items": "/products",
  "Gallery": "/gallery",
  "Contact": "/contact",
};
const SWEET_LINKS = ["Ladoo", "Barfi", "Gulab Jamun", "Kaju Katli", "Rasgulla"];

const SOCIALS = [
  { icon: FacebookIcon, label: "Facebook", href: "#" },
  { icon: InstagramIcon, label: "Instagram", href: "#" },
  { icon: TwitterIcon, label: "Twitter", href: "#" },
];

const Footer = () => {
  return (
    <footer
      className="w-full"
      style={{ backgroundColor: "#FFF8EC", borderColor: "#E8C68A" }}
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2.5">
              <img src="/Mylogo/logo.png" alt="Ganguram Logo" className="h-12 object-contain" />
              <span className="text-2xl font-serif font-black tracking-wider bg-gradient-to-r from-[#a65827] via-[#DFA250] to-[#5C2A1A] bg-clip-text text-transparent">
                Maharaja
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "#7A5C4A" }}>
              Traditional Indian sweets made with pure ghee, love, and
              generations-old recipes. Fresh mithai, every single day.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {SOCIALS.map(({ icon: Icon, label, href }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: "#8A2E2E" }}
                >
                  <Icon width={16} height={16} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: "#5C2A1A" }}>
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2">
              {QUICK_LINKS.map((link) => (
                <li key={link}>
                  <Link
                    to={LINK_MAP[link] || "/"}
                    className="text-sm font-medium transition-colors hover:opacity-70"
                    style={{ color: "#7A5C4A" }}
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Our Items */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: "#5C2A1A" }}>
              Our Items
            </h3>
            <ul className="mt-4 space-y-2">
              {SWEET_LINKS.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm font-medium transition-colors hover:opacity-70"
                    style={{ color: "#7A5C4A" }}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: "#5C2A1A" }}>
              Visit Us
            </h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-2 text-sm font-medium" style={{ color: "#7A5C4A" }}>
                <MapPin size={16} className="mt-0.5 shrink-0" style={{ color: "#8A2E2E" }} />
                <span>MG Road, Bhubaneswar, Odisha, India</span>
              </li>
              <li className="flex items-center gap-2 text-sm font-medium" style={{ color: "#7A5C4A" }}>
                <Phone size={16} className="shrink-0" style={{ color: "#8A2E2E" }} />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2 text-sm font-medium" style={{ color: "#7A5C4A" }}>
                <Mail size={16} className="shrink-0" style={{ color: "#8A2E2E" }} />
                <span>hello@mithaighar.com</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-10 flex flex-col items-center justify-between gap-3 border-t pt-6 text-sm sm:flex-row"
          style={{ borderColor: "#E8C68A", color: "#7A5C4A" }}
        >
          <p>&copy; {new Date().getFullYear()} Mithai Ghar. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="hover:opacity-70">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:opacity-70">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;