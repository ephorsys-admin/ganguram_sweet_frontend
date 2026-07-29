import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const FAQS = [
  {
    question: "How long do the sweets stay fresh?",
    answer: "Our confections are prepared fresh daily without artificial additives. Traditional cashew sweets like Kaju Katli stay fresh for up to 10 days, while fresh chhena (cottage cheese) delicacies are best consumed within 2-3 days under refrigeration."
  },
  {
    question: "Do you accept bulk inquiries for marriages or corporate gifting?",
    answer: "Absolutely! We specialize in custom-curated bulk orders, customized sweet assortments, and premium packaging for marriages, corporate gatherings, and festivals. Please use our Inquiry Form or Contact page to submit a direct request."
  },
  {
    question: "Do you offer same-day home delivery?",
    answer: "Yes! We provide same-day home delivery across the city. All delivery orders are packed in secure, temperature-controlled, and vacuum-sealed food containers to keep sweets completely fresh and pristine."
  },
  {
    question: "Are all your confections vegetarian and eggless?",
    answer: "Yes, 100% of Maharaja Ganguram confections, savouries, and bakery items are completely vegetarian and prepared in a strict, dedicated egg-free facility."
  }
];

const FaqSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleIndex = (idx) => {
    setActiveIndex(activeIndex === idx ? null : idx);
  };

  return (
    <section className="w-full py-16" style={{ backgroundColor: "#FFFDF8" }}>
      <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Title */}
        <div className="text-center mb-12 space-y-3">
          <span className="text-[10px] sm:text-xs font-bold text-[#a65827] uppercase tracking-[0.25em] bg-[#FAF6F0] px-3.5 py-1.5 rounded-full border border-[#E6CCB2]/30">
            Support & Queries
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#3D271B] leading-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-[#6E5A4F] max-w-lg mx-auto">
            Need help? Here are the most common questions about our sweet shipping, shelf-life, and royal catering services.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {FAQS.map((faq, i) => {
            const isOpen = activeIndex === i;
            return (
              <div 
                key={i} 
                className="bg-white rounded-3xl border border-[#E6CCB2]/20 overflow-hidden transition-all duration-300 hover:shadow-xs"
              >
                {/* Question Header */}
                <button
                  onClick={() => toggleIndex(i)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle size={18} className="text-[#a65827]/60 group-hover:text-[#a65827] transition-colors shrink-0" />
                    <span className="text-sm sm:text-base font-bold text-[#3D271B] group-hover:text-[#a65827] transition-colors duration-250 font-serif">
                      {faq.question}
                    </span>
                  </div>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-[#a65827] shrink-0 ml-4"
                  >
                    <ChevronDown size={20} />
                  </motion.span>
                </button>

                {/* Answer Body */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-0 border-t border-[#FAF6F0] mt-1 text-[#6E5A4F] text-xs sm:text-sm leading-relaxed font-sans">
                        <p className="pt-4">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
