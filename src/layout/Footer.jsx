import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-brand-dark text-brand-cream/80 py-10 px-4 mt-auto border-t border-brand-accent/15">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div>
          <h2 className="font-serif font-bold text-xl text-white mb-3">Maharaja Ganguram Sweets</h2>
          <p className="text-sm text-brand-cream/60 max-w-sm">
            Preserving the artisanal legacy of traditional Indian confectionery since 2014. Crafted with love, delivered with honor.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-white uppercase tracking-wider text-sm mb-3">Navigation</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-brand-gold transition-colors">Home</Link></li>
            <li><Link to="/menu" className="hover:text-brand-gold transition-colors">Menu</Link></li>
            <li><Link to="/about" className="hover:text-brand-gold transition-colors">Our Story</Link></li>
            <li><Link to="/contact" className="hover:text-brand-gold transition-colors">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-white uppercase tracking-wider text-sm mb-3">Connect</h3>
          <p className="text-sm text-brand-cream/60 mb-2">123 Royal Confectionery Way, Kolkata, WB 700001</p>
          <p className="text-sm text-brand-cream/60">Phone: +91 801 555 0199</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto border-t border-brand-cream/10 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-brand-cream/40">
        <p>&copy; {new Date().getFullYear()} Maharaja Ganguram Sweets. All rights reserved.</p>
        <div className="flex space-x-4 mt-4 sm:mt-0">
          <a href="#" className="hover:text-brand-gold">Privacy Policy</a>
          <a href="#" className="hover:text-brand-gold">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;