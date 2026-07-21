import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, ShoppingBag, User } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  // Handle scroll effect for navbar background color
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Menu", path: "/menu" },
    { name: "Our Story", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  // Dynamic class names based on state (scroll, page location)
  const navbarBgClass = isHomePage
    ? isScrolled
      ? "bg-[#FAF6F0]/95 backdrop-blur-md shadow-md border-b border-brand-accent/20 py-3"
      : "bg-transparent py-5"
    : "bg-[#FAF6F0]/95 backdrop-blur-md shadow-sm border-b border-brand-accent/30 py-3";

  const textColorClass = isHomePage && !isScrolled
    ? "text-brand-dark"
    : "text-brand-dark";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navbarBgClass}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative h-11 w-11 rounded-full overflow-hidden bg-brand-cream border border-brand-accent/40 shadow-sm flex items-center justify-center p-0.5">
              <img
                src="/Mylogo/logo.png"
                alt="Maharaja Ganguram Sweets Logo"
                className="h-full w-full object-contain rounded-full transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-lg md:text-xl tracking-wide text-brand-dark leading-tight">
                Maharaja
              </span>
              <span className="font-serif italic font-normal text-xs md:text-sm text-brand-copper tracking-wider">
                Ganguram Sweets
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `relative py-2 text-sm font-medium tracking-widest transition-colors duration-300 uppercase ${
                    isActive
                      ? "text-brand-copper font-semibold"
                      : "text-brand-dark/80 hover:text-brand-copper"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-copper rounded-full" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Icons & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <button
              aria-label="Shopping Bag"
              className={`p-2 rounded-full hover:bg-brand-accent/20 transition-colors duration-300 ${textColorClass}`}
            >
              <ShoppingBag className="w-[22px] h-[22px] stroke-[1.75]" />
            </button>
            <button
              aria-label="Profile"
              className={`p-2 rounded-full hover:bg-brand-accent/20 transition-colors duration-300 ${textColorClass}`}
            >
              <User className="w-[22px] h-[22px] stroke-[1.75]" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 md:hidden rounded-lg hover:bg-brand-accent/20 transition-colors focus:outline-none ${textColorClass}`}
              aria-expanded={isOpen}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-6 h-6 stroke-[1.75]" />
              ) : (
                <Menu className="w-6 h-6 stroke-[1.75]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 top-[76px] bg-brand-dark/30 backdrop-blur-sm md:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed top-[76px] right-0 bottom-0 w-4/5 max-w-sm bg-brand-cream border-l border-brand-accent/20 shadow-2xl p-6 flex flex-col justify-between md:hidden transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="space-y-6">
          <p className="text-xs uppercase font-semibold text-brand-dark/50 tracking-widest border-b border-brand-accent/25 pb-3">
            Navigation
          </p>
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `block py-3 px-4 rounded-xl text-base font-medium tracking-wider uppercase transition-all duration-200 ${
                    isActive
                      ? "bg-brand-copper/10 text-brand-copper font-semibold pl-6"
                      : "text-brand-dark hover:bg-brand-accent/10 hover:pl-6"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="border-t border-brand-accent/25 pt-6 space-y-4 text-center">
          <p className="text-sm font-serif italic text-brand-copper">
            “The Royal Heritage of Authentic Indian Sweets”
          </p>
          <p className="text-xs text-brand-dark/40">Established Since 2014</p>
        </div>
      </div>
    </header>
  );
};

export default Navbar;