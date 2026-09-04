import { Calendar, Eye, Download, ReceiptText, X, FileText } from "lucide-react";
import { useState } from "react";

export default function BillingTable({
  bills = [],
  pagination,
  setPage,
  onViewDetails,
  search,
  statusFilter,
}) {
  const [downloadingId, setDownloadingId] = useState(null);
  const [previewBill, setPreviewBill] = useState(null);

  const displayPrice = (val) => {
    return typeof val === "number" ? val.toFixed(2) : Number(val || 0).toFixed(2);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Paid":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Generated":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Cancelled":
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  const sanitizeFileName = (name) => {
    return name
      .trim()
      .replace(/[^a-zA-Z0-9\s-]/g, "")
      .replace(/\s+/g, "_");
  };

  const handleDownloadPdf = async (bill) => {
    const url = bill?.invoiceUrl;

    if (!url) {
      alert("Invoice PDF is not available for this bill yet.");
      return;
    }

    try {
      setDownloadingId(bill._id);
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
      window.open(url, "_blank", "noopener,noreferrer");
    } finally {
      setDownloadingId(null);
    }
  };

  const handlePreview = (bill) => {
    if (!bill?.invoiceUrl) {
      alert("Invoice PDF is not available for this bill yet.");
      return;
    }
    setPreviewBill(bill);
  };

  const closePreview = () => setPreviewBill(null);

  return (
    <div className="w-full space-y-6">
      {bills.length === 0 ? (
        <div className="bg-white border border-[#E6CCB2]/30 rounded-3xl p-12 text-center flex flex-col items-center justify-center shadow-xs space-y-3">
          <div className="w-16 h-16 bg-[#FAF6F0] rounded-2xl flex items-center justify-center text-[#DFA250] mb-2 border border-[#E6CCB2]/20">
            <ReceiptText className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-[#3D271B] text-lg sm:text-xl">No Bills Found</h3>
          <p className="text-sm text-[#6E5A4F] max-w-md">
            {search || statusFilter !== "All"
              ? "We couldn't find any bills matching your search or filters. Try modifying your inputs."
              : "Generate a new bill request for sweet orders or walk-in purchases."}
          </p>
        </div>
      ) : (
        <>
          {/* Mobile Card Grid View */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:hidden">
            {bills.map((bill) => {
              const dateStr = bill.generatedAt || bill.createdAt
                ? new Date(bill.generatedAt || bill.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric"
                })
                : "—";

              return (
                <div
                  key={bill._id}
                  className="bg-white p-6 rounded-3xl border border-[#E6CCB2]/30 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between gap-5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold font-mono text-[#a65827] bg-[#FAF6F0] px-3 py-1.5 rounded-xl text-xs sm:text-sm tracking-wider uppercase border border-[#E6CCB2]/30">
                      {bill.invoiceNumber || `ID: ${bill._id.substring(18)}`}
                    </span>
                    <span className="inline-flex px-3 py-1 bg-[#FAF6F0] border border-[#E6CCB2]/30 rounded-xl text-xs text-[#6E5A4F] font-bold uppercase tracking-wide">
                      {bill.billType}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-base sm:text-lg text-[#3D271B] leading-tight">
                        {bill.customerName}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#6E5A4F] font-semibold font-mono">
                        Phone: {bill.mobile || "N/A"}
                      </p>
                    </div>

                    <div className="flex justify-between items-center text-xs sm:text-sm font-semibold border-t border-[#FAF6F0] pt-2.5">
                      <span className="text-[#6E5A4F]">Date:</span>
                      <span className="text-[#3D271B] font-mono font-bold">{dateStr}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs sm:text-sm font-semibold">
                      <span className="text-[#6E5A4F]">Final Amount:</span>
                      <span className="text-[#a65827] font-mono text-base sm:text-lg font-black">₹{displayPrice(bill.finalAmount)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#FAF6F0] pt-3.5 gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusStyle(bill.status)}`}>
                      {bill.status}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewDetails(bill)}
                        className="p-2.5 text-[#a65827] hover:text-[#3D271B] bg-[#FAF6F0] hover:bg-[#FAF0E6] rounded-xl transition cursor-pointer"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handlePreview(bill)}
                        className="p-2.5 text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition cursor-pointer"
                        title="Preview Invoice PDF"
                      >
                        <FileText size={16} />
                      </button>
                      <button
                        onClick={() => handleDownloadPdf(bill)}
                        disabled={downloadingId === bill._id}
                        className="p-2.5 text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition cursor-pointer disabled:opacity-50"
                        title="Download PDF Invoice"
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table View */}
          <div className="bg-white rounded-3xl border border-[#E6CCB2]/30 shadow-xs overflow-hidden hidden lg:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAF6F0]/60 border-b border-[#E6CCB2]/30 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#6E5A4F]">
                    <th className="px-6 py-4.5">Invoice Info</th>
                    <th className="px-6 py-4.5">Customer Details</th>
                    <th className="px-6 py-4.5">Bill Type</th>
                    <th className="px-6 py-4.5 font-mono text-right">Amount Details</th>
                    <th className="px-6 py-4.5 text-center">Status</th>
                    <th className="px-6 py-4.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#FAF6F0] text-sm sm:text-base font-semibold text-[#3D271B]">
                  {bills.map((bill) => (
                    <tr key={bill._id} className="hover:bg-[#FAF6F0]/20 transition-colors">
                      <td className="px-6 py-4.5">
                        <div className="font-black text-[#a65827] select-all font-mono text-sm sm:text-base">
                          {bill.invoiceNumber || bill._id.substring(18)}
                        </div>
                        <div className="text-xs text-[#6E5A4F] font-medium mt-1 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#a65827]" />
                          {bill.generatedAt
                            ? new Date(bill.generatedAt).toLocaleDateString()
                            : new Date(bill.createdAt).toLocaleDateString()}
                        </div>
                      </td>

                      <td className="px-6 py-4.5">
                        <div className="font-bold text-base text-[#3D271B]">{bill.customerName}</div>
                        <div className="text-xs sm:text-sm text-[#6E5A4F] font-mono mt-0.5">
                          {bill.mobile || "No Mobile"}
                        </div>
                      </td>

                      <td className="px-6 py-4.5">
                        <span className="inline-flex px-3 py-1 bg-[#FAF6F0] border border-[#E6CCB2]/30 rounded-xl text-xs text-[#6E5A4F] font-bold uppercase">
                          {bill.billType}
                        </span>
                      </td>

                      <td className="px-6 py-4.5 text-right">
                        <div className="font-black text-[#3D271B] font-mono text-base sm:text-lg">
                          ₹{displayPrice(bill.finalAmount)}
                        </div>
                        <div className="text-xs text-[#6E5A4F] mt-0.5 font-mono">
                          Subtotal: ₹{displayPrice(bill.subTotal)} | Disc: ₹{displayPrice(bill.discountAmount)}
                        </div>
                      </td>

                      <td className="px-6 py-4.5">
                        <div className="flex justify-center">
                          <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusStyle(bill.status)}`}>
                            {bill.status}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onViewDetails(bill)}
                            className="p-2.5 text-[#a65827] hover:text-[#3D271B] hover:bg-[#FAF6F0] rounded-xl transition cursor-pointer"
                            title="View Receipt Details"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handlePreview(bill)}
                            className="p-2.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition cursor-pointer"
                            title="Preview Invoice PDF"
                          >
                            <FileText className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDownloadPdf(bill)}
                            disabled={downloadingId === bill._id}
                            className="p-2.5 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl transition cursor-pointer disabled:opacity-50"
                            title="Download PDF Invoice"
                          >
                            <Download className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="px-6 py-4.5 bg-white border border-[#E6CCB2]/30 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
          <span className="text-sm text-[#6E5A4F] font-bold">
            Showing Page {pagination.page} of {pagination.totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={pagination.page <= 1}
              className="px-4 py-2 text-sm font-bold border border-[#E6CCB2]/40 rounded-xl bg-white text-[#3D271B] hover:bg-[#FAF6F0] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
              disabled={pagination.page >= pagination.totalPages}
              className="px-4 py-2 text-sm font-bold border border-[#E6CCB2]/40 rounded-xl bg-white text-[#3D271B] hover:bg-[#FAF6F0] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Invoice PDF Preview Modal */}
      {previewBill && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#E6CCB2]/40">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E6CCB2]/30 bg-[#FAF6F0]/60">
              <div>
                <h3 className="font-extrabold text-[#3D271B] text-base sm:text-lg">Invoice Preview</h3>
                <p className="text-xs sm:text-sm text-[#6E5A4F] font-mono mt-0.5">
                  {previewBill.invoiceNumber || `Invoice_${previewBill._id}`}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDownloadPdf(previewBill)}
                  disabled={downloadingId === previewBill._id}
                  className="px-4 py-2 text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5 font-bold text-sm"
                  title="Download PDF"
                >
                  <Download size={16} />
                  <span>Download</span>
                </button>
                <button
                  onClick={closePreview}
                  className="p-2 text-[#3D271B] hover:bg-[#FAF6F0] rounded-xl transition cursor-pointer"
                  title="Close"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* PDF Viewer Body */}
            <div className="flex-1 bg-[#525659]">
              <iframe
                src={previewBill.invoiceUrl}
                title="Invoice Preview"
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}