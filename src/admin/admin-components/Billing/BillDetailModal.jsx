import React, { useEffect, useRef, useState } from "react";
import { Download, Printer, X, Receipt, Calendar, User, PhoneCall, MapPin, ShoppingBag, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function BillDetailModal({ isOpen, bill, onClose, onDelete, isSuperAdmin }) {
  const [downloading, setDownloading] = useState(false);
  const topRef = useRef(null);

  useEffect(() => {
    if (isOpen && bill) {
      // Snap scroll to top of the modal content
      const scrollParent = topRef.current?.closest(".overflow-y-auto");
      if (scrollParent) {
        scrollParent.scrollTop = 0;
      }
    }
  }, [isOpen, bill]);

  if (!isOpen || !bill) return null;

  const displayPrice = (val) => {
    return typeof val === "number" ? val.toFixed(2) : Number(val || 0).toFixed(2);
  };

  const sanitizeFileName = (name) => {
    return name
      .trim()
      .replace(/[^a-zA-Z0-9\s-]/g, "")
      .replace(/\s+/g, "_");
  };

  const handleDownloadPdf = async () => {
    const url = bill?.invoiceUrl;
    if (!url) {
      alert("Invoice PDF is not available for this bill yet.");
      return;
    }

    try {
      setDownloading(true);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch PDF: ${response.status}`);
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const cleanName = bill.customerName
        ? sanitizeFileName(bill.customerName)
        : bill.invoiceNumber;

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `Invoice_${cleanName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("PDF download failed", err);
      // Fallback
      window.open(url, "_blank", "noopener,noreferrer");
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Generate QR verification code content
  const qrData = JSON.stringify({
    invoice: bill.invoiceNumber,
    amount: bill.finalAmount,
    date: bill.generatedAt || bill.createdAt,
    store: "Ganguram Sweets"
  });
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;

  const dateStr = bill.generatedAt || bill.createdAt 
    ? new Date(bill.generatedAt || bill.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    : "—";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs no-print"
          onClick={onClose}
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative bg-white w-[95vw] sm:w-full sm:max-w-2xl rounded-3xl border border-[#E6CCB2]/40 shadow-2xl p-6 md:p-8 z-10 text-xs text-slate-800 font-sans max-h-[92vh] overflow-y-auto"
        >
          {/* Header toolbar */}
          <div className="flex justify-between items-center border-b border-[#FAF6F0] pb-4 mb-4 no-print" ref={topRef}>
            <span className="font-serif font-black text-lg text-[#3D271B]">Receipt Preview</span>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-[#FAF6F0] text-[#6E5A4F] hover:text-[#3D271B] rounded-lg transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Printable Invoice Page */}
          <div id="print-area" className="bg-white p-2 sm:p-5 border border-slate-100 rounded-2xl text-left space-y-6">
            {/* Store Branding */}
            <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-[#a65827] pb-4 gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="w-10 h-10 rounded-full bg-[#FAF6F0] border border-[#E6CCB2]/40 flex items-center justify-center text-lg font-serif font-black text-[#a65827]">
                    G
                  </span>
                  <div>
                    <h2 className="text-lg font-serif font-black text-[#3D271B] leading-none">GANGURAM SWEETS</h2>
                    <span className="text-[9px] text-[#6E5A4F]/60 font-bold uppercase tracking-wider block mt-1">
                      Traditional Bengali Sweet Shop
                    </span>
                  </div>
                </div>
                <p className="text-[10px] text-[#6E5A4F] font-semibold mt-3 leading-relaxed max-w-sm">
                  Bowbazar, Kolkata, West Bengal - 700012 <br />
                  Phone: +91 33 2241 1234 | Email: info@ganguramsweets.com <br />
                  GSTIN: 19AAACG0123D1Z5
                </p>
              </div>
              <div className="text-right sm:text-right">
                <span className="text-[9px] font-extrabold text-[#a65827] bg-[#FAF6F0] border border-[#E6CCB2]/20 rounded-md px-2 py-1 inline-block uppercase tracking-wider">
                  Tax Invoice / Receipt
                </span>
                <h3 className="text-base font-black text-[#3D271B] mt-2 select-all font-mono">
                  {bill.invoiceNumber || bill._id.substring(18)}
                </h3>
                <div className="text-[10px] text-[#6E5A4F]/75 font-semibold mt-1">
                  Date: {new Date(bill.generatedAt || bill.createdAt).toLocaleDateString("en-IN")}
                </div>
                <div className="text-[10px] text-[#6E5A4F]/75 font-semibold font-mono">
                  Time: {new Date(bill.generatedAt || bill.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div>
              <div className="border-b border-[#E6CCB2]/20 pb-1 mb-2.5">
                <span className="text-[10px] font-extrabold text-[#a65827] uppercase tracking-wider">
                  Customer Information
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-[#3D271B] px-1">
                <div className="flex justify-between border-b border-dashed border-[#FAF6F0] py-1">
                  <span className="text-[#6E5A4F]/70 font-semibold">Customer Name:</span>
                  <span className="font-bold">{bill.customerName}</span>
                </div>
                <div className="flex justify-between border-b border-dashed border-[#FAF6F0] py-1">
                  <span className="text-[#6E5A4F]/70 font-semibold">Mobile Number:</span>
                  <span className="font-mono font-bold">{bill.mobile}</span>
                </div>
                {bill.email && (
                  <div className="flex justify-between border-b border-dashed border-[#FAF6F0] py-1">
                    <span className="text-[#6E5A4F]/70 font-semibold">Email Address:</span>
                    <span>{bill.email}</span>
                  </div>
                )}
                {bill.whatsappNumber && (
                  <div className="flex justify-between border-b border-dashed border-[#FAF6F0] py-1">
                    <span className="text-[#6E5A4F]/70 font-semibold">WhatsApp Number:</span>
                    <span className="font-mono">{bill.whatsappNumber}</span>
                  </div>
                )}
                <div className="flex justify-between border-b border-dashed border-[#FAF6F0] py-1 sm:col-span-2">
                  <span className="text-[#6E5A4F]/70 font-semibold">Billing Channel:</span>
                  <span className="font-bold uppercase text-[10px]">{bill.billType} RECEIPT</span>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div>
              <div className="border-b border-[#E6CCB2]/20 pb-1 mb-2.5">
                <span className="text-[10px] font-extrabold text-[#a65827] uppercase tracking-wider">
                  Billed Sweet Items
                </span>
              </div>
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAF6F0] text-[#6E5A4F] text-[9px] font-bold uppercase tracking-wider border-b border-[#E6CCB2]/25">
                    <th className="px-4 py-2 text-left rounded-l-lg">Sweet Item</th>
                    <th className="px-4 py-2 text-center w-16">Qty</th>
                    <th className="px-4 py-2 text-center w-20">Price</th>
                    <th className="px-4 py-2 text-right w-24 rounded-r-lg">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#FAF6F0] font-semibold text-[#3D271B]">
                  {bill.items?.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2.5 font-bold">{item.productName}</td>
                      <td className="px-4 py-2.5 text-center font-mono">{item.quantity}</td>
                      <td className="px-4 py-2.5 text-center font-mono">₹{displayPrice(item.price)}</td>
                      <td className="px-4 py-2.5 text-right font-extrabold font-mono text-[#a65827]">
                        ₹{displayPrice(item.total || item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals & QR Validation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-[#FAF6F0] pt-4">
              <div className="space-y-4">
                <div>
                  <span className="font-bold text-[#6E5A4F]/60 text-[9px] uppercase tracking-wider block mb-1">
                    Invoice Details
                  </span>
                  <span className="font-bold text-[#3D271B]">
                    Status: {bill.status?.toUpperCase()}
                  </span>
                </div>
                {bill.address && (
                  <div className="bg-[#FAF6F0]/25 p-2 rounded-xl text-[10px] text-[#6E5A4F] border border-[#E6CCB2]/10">
                    <strong>Address:</strong> {bill.address}
                  </div>
                )}
                
                {/* QR Code Validation */}
                <div className="border border-[#E6CCB2]/20 rounded-xl p-3 flex items-center gap-3 bg-white shadow-xs max-w-[245px]">
                  <img
                    src={qrCodeUrl}
                    alt="Verification QR"
                    className="w-16 h-16 object-contain border border-[#FAF6F0] rounded-lg shrink-0"
                  />
                  <div>
                    <div className="text-[9px] font-black text-[#6E5A4F]/60 uppercase tracking-wider">
                      Verify Invoice
                    </div>
                    <div className="text-[9px] text-[#6E5A4F]/70 mt-0.5">
                      Scan QR to verify
                    </div>
                    <div className="text-[9px] font-extrabold text-[#3D271B] mt-1 select-all font-mono">
                      {bill.invoiceNumber || bill._id.substring(18)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="bg-[#FAF6F0]/40 p-4 rounded-xl text-left border border-[#E6CCB2]/20 h-fit self-start space-y-2">
                <div className="flex justify-between font-semibold text-[#6E5A4F]">
                  <span>Subtotal:</span>
                  <span className="text-[#3D271B] font-mono">₹{displayPrice(bill.subTotal)}</span>
                </div>
                {bill.discountAmount > 0 && (
                  <div className="flex justify-between font-semibold text-red-655">
                    <span>Discount ({bill.discountType === "PERCENTAGE" ? `${bill.discountValue}%` : "Flat"}):</span>
                    <span className="font-mono">-₹{displayPrice(bill.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm font-black text-[#3D271B] border-t border-[#E6CCB2]/25 pt-2 mt-2">
                  <span>Grand Total:</span>
                  <span className="text-[#a65827] text-base font-black font-mono">₹{displayPrice(bill.finalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Footer message */}
            <div className="text-[9px] text-[#6E5A4F]/50 font-bold text-center border-t border-dashed border-[#FAF6F0] pt-4 mt-4 uppercase tracking-wider">
              Thank you for choosing Ganguram Sweets • Enjoy the sweetness of Bengal!
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center justify-end gap-3 no-print pt-4 border-t border-[#FAF6F0] mt-4">
            {isSuperAdmin && (
              <button
                onClick={() => onDelete(bill._id)}
                className="mr-auto px-4 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-650 font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1.5 active:scale-95 transition"
              >
                <Trash2 className="w-4 h-4" /> Delete Bill
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-650 font-bold text-xs rounded-xl hover:bg-slate-50 cursor-pointer active:scale-95 transition"
            >
              Close
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1.5 active:scale-95 transition"
            >
              <Printer className="w-4 h-4 text-slate-600" /> Print Receipt
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="px-5 py-2 bg-gradient-to-r from-[#3D271B] to-[#a65827] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5 active:scale-95 transition disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-white" /> {downloading ? "Downloading..." : "Download PDF"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
