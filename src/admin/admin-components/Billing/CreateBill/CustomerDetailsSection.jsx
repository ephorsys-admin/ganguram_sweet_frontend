import { Loader2, ShoppingBag } from "lucide-react";

const CustomerDetailsSection = ({
  customerName,
  setCustomerName,
  mobile,
  setMobile,
  email,
  setEmail,
  whatsappNumber,
  setWhatsappNumber,
  dateOfBirth,
  setDateOfBirth,
  address,
  setAddress,
  customerSummary,
  customerSummaryLoading,
  errors = {},
}) => {
  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-[#E6CCB2]/40 shadow-sm space-y-5 sm:space-y-6">
      <div className="flex items-center justify-between border-b border-[#FAF6F0] pb-3.5">
        <h3 className="font-bold text-[#3D271B] uppercase tracking-wider text-sm sm:text-base flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[#FAF6F0] text-[#a65827] flex items-center justify-center text-xs font-black shrink-0">
            1
          </span>
          Customer Details
        </h3>
        <span className="text-xs sm:text-sm text-[#6E5A4F] font-semibold">
          * Required fields
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
        {/* CUSTOMER NAME */}
        <div className="space-y-1.5 sm:space-y-2">
          <label className="block text-xs sm:text-sm md:text-base font-bold text-[#3D271B]">
            Customer Name <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            placeholder="e.g. Rajesh Kumar"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="block w-full px-3.5 sm:px-4 py-3 sm:py-3.5 bg-[#FAF6F0]/40 border border-[#E6CCB2]/40 rounded-2xl text-xs sm:text-sm md:text-base text-[#3D271B] font-semibold focus:outline-none focus:ring-2 focus:ring-[#a65827]/20 focus:border-[#a65827] transition"
          />

          {errors.customerName && (
            <p className="text-xs sm:text-sm font-bold text-red-500 mt-1">
              {errors.customerName}
            </p>
          )}
        </div>

        {/* MOBILE NUMBER */}
        <div className="space-y-1.5 sm:space-y-2">
          <label className="block text-xs sm:text-sm md:text-base font-bold text-[#3D271B]">
            Mobile Number <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            inputMode="numeric"
            maxLength={10}
            placeholder="10-digit mobile number"
            value={mobile}
            onChange={(e) =>
              setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
            }
            className="block w-full px-3.5 sm:px-4 py-3 sm:py-3.5 bg-[#FAF6F0]/40 border border-[#E6CCB2]/40 rounded-2xl text-xs sm:text-sm md:text-base text-[#3D271B] font-semibold tracking-wide focus:outline-none focus:ring-2 focus:ring-[#a65827]/20 focus:border-[#a65827] transition"
          />

          {errors.mobile && (
            <p className="text-xs sm:text-sm font-bold text-red-500 mt-1">
              {errors.mobile}
            </p>
          )}
        </div>
      </div>

      {/* EMAIL / WHATSAPP / DOB */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        {/* EMAIL */}
        <div className="space-y-2">
          <label className="block text-sm sm:text-base font-bold text-[#3D271B]">
            Email Address
          </label>

          <input
            type="email"
            placeholder="e.g. name@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full px-4 py-3.5 bg-[#FAF6F0]/40 border border-[#E6CCB2]/40 rounded-2xl text-sm sm:text-base text-[#3D271B] font-medium focus:outline-none focus:ring-2 focus:ring-[#a65827]/20 focus:border-[#a65827] transition"
          />

          {errors.email && (
            <p className="text-xs sm:text-sm font-bold text-red-500 mt-1">
              {errors.email}
            </p>
          )}
        </div>

        {/* WHATSAPP NUMBER */}
        <div className="space-y-2">
          <label className="block text-sm sm:text-base font-bold text-[#3D271B]">
            WhatsApp Number
          </label>

          <input
            type="text"
            inputMode="numeric"
            maxLength={10}
            placeholder="Optional (10 digits)"
            value={whatsappNumber}
            onChange={(e) =>
              setWhatsappNumber(e.target.value.replace(/\D/g, "").slice(0, 10))
            }
            className="block w-full px-4 py-3.5 bg-[#FAF6F0]/40 border border-[#E6CCB2]/40 rounded-2xl text-sm sm:text-base text-[#3D271B] font-semibold tracking-wide focus:outline-none focus:ring-2 focus:ring-[#a65827]/20 focus:border-[#a65827] transition"
          />

          {errors.whatsappNumber && (
            <p className="text-xs sm:text-sm font-bold text-red-500 mt-1">
              {errors.whatsappNumber}
            </p>
          )}
        </div>

        {/* DATE OF BIRTH */}
        <div className="space-y-2">
          <label className="block text-sm sm:text-base font-bold text-[#3D271B]">
            Date of Birth
          </label>

          <input
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            className="block w-full px-4 py-3.5 bg-[#FAF6F0]/40 border border-[#E6CCB2]/40 rounded-2xl text-sm sm:text-base text-[#3D271B] font-medium focus:outline-none focus:ring-2 focus:ring-[#a65827]/20 focus:border-[#a65827] transition cursor-pointer"
          />
        </div>
      </div>

      {/* ADDRESS */}
      <div className="space-y-2">
        <label className="block text-sm sm:text-base font-bold text-[#3D271B]">
          Address
        </label>

        <input
          type="text"
          placeholder="Residential / delivery address details (optional)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="block w-full px-4 py-3.5 bg-[#FAF6F0]/40 border border-[#E6CCB2]/40 rounded-2xl text-sm sm:text-base text-[#3D271B] font-medium focus:outline-none focus:ring-2 focus:ring-[#a65827]/20 focus:border-[#a65827] transition"
        />
      </div>

      {/* CUSTOMER SUMMARY ALERT */}
      {customerSummaryLoading && (
        <div className="flex items-center gap-3 text-sm text-[#a65827] font-semibold p-4 bg-[#FAF6F0] rounded-2xl animate-pulse">
          <Loader2 className="h-5 w-5 animate-spin text-[#DFA250]" />
          <span>Fetching customer purchase history...</span>
        </div>
      )}

      {customerSummary && customerSummary.totalBills > 0 && (
        <div className="p-5 bg-gradient-to-br from-[#FAF6F0] to-[#FAF0E6] border border-[#DFA250]/30 rounded-2xl space-y-3.5 shadow-xs">
          <div className="flex items-center gap-2 text-[#a65827]">
            <ShoppingBag size={20} className="animate-bounce" />
            <span className="font-extrabold text-sm sm:text-base uppercase tracking-wider">
              Returning Customer Summary
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-1">
            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#E6CCB2]/30 shadow-xs">
              <p className="text-[#6E5A4F] font-bold text-xs uppercase tracking-wider">
                Visits
              </p>
              <p className="text-[#3D271B] font-black text-xl sm:text-2xl mt-0.5">
                {customerSummary.totalBills}
              </p>
            </div>

            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#E6CCB2]/30 shadow-xs">
              <p className="text-[#6E5A4F] font-bold text-xs uppercase tracking-wider">
                Total Spent
              </p>
              <p className="text-emerald-700 font-black font-mono text-xl sm:text-2xl mt-0.5">
                ₹{Number(customerSummary.totalPurchase || 0).toFixed(2)}
              </p>
            </div>

            {customerSummary.lastPurchaseDate && (
              <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#E6CCB2]/30 shadow-xs">
                <p className="text-[#6E5A4F] font-bold text-xs uppercase tracking-wider">
                  Last Order
                </p>
                <p className="text-[#3D271B] font-bold text-sm sm:text-base mt-0.5">
                  {new Date(customerSummary.lastPurchaseDate).toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                    }
                  )}
                </p>
              </div>
            )}

            {customerSummary.lastInvoice && (
              <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#E6CCB2]/30 shadow-xs">
                <p className="text-[#6E5A4F] font-bold text-xs uppercase tracking-wider">
                  Last Bill #
                </p>
                <p className="text-[#a65827] font-extrabold font-mono text-sm sm:text-base mt-0.5 truncate">
                  #{customerSummary.lastInvoice}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDetailsSection;
