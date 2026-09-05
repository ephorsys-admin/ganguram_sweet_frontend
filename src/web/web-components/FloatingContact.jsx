import { Phone, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const PHONE_NUMBER = "000000000000"; 

const FloatingContact = () => {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-4">
      {/* WhatsApp */}
      <motion.a
        href={`https://wa.me/${PHONE_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-xl"
      >
        <MessageCircle size={28} />
      </motion.a>

      {/* Call */}
      <motion.a
        href={`tel:+${PHONE_NUMBER}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-xl"
      >
        <Phone size={28} />
      </motion.a>
    </div>
  );
};

export default FloatingContact;