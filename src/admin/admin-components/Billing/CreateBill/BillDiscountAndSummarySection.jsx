import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BillDiscountAndSummarySection = ({
  discountType,
  setDiscountType,
  discountValue,
  setDiscountValue,
  subTotal = 0,
  discountAmount = 0,
  finalAmount = 0,
  errors = {},
  isSaving = false,
  orderId = null,
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ==================================================
          3. DISCOUNT & BILLING CALCULATIONS
      ================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* DISCOUNT CONFIG */}
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-[#E6CCB2]/40 shadow-sm space-y-4 sm:space-y-5 flex flex-col justify-between">
          <div className="border-b border-[#FAF6F0] pb-3.5">
            <h3 className="font-bold text-[#3D271B] uppercase tracking-wider text-sm sm:text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#FAF6F0] text-[#a65827] flex items-center justify-center text-xs font-black shrink-0">
                3
              </span>
              Discount Configuration
            </h3>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {/* DISCOUNT TYPE */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="block text-xs sm:text-sm md:text-base font-bold text-[#3D271B]">
                Discount Type
              </label>

              <div className="flex gap-4 sm:gap-6 pt-1">
                <label className="flex items-center gap-2 font-bold text-xs sm:text-sm md:text-base text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="discType"
                    value="FLAT"
                    checked={discountType === "FLAT"}
                    onChange={() => setDiscountType("FLAT")}
                    className="w-4 h-4 accent-[#a65827]"
                  />
                  Flat (₹)
                </label>

                <label className="flex items-center gap-2 font-bold text-xs sm:text-sm md:text-base text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="discType"
                    value="PERCENTAGE"
                    checked={discountType === "PERCENTAGE"}
                    onChange={() => setDiscountType("PERCENTAGE")}
                    className="w-4 h-4 accent-[#a65827]"
                  />
                  Percentage (%)
                </label>
              </div>
            </div>

            {/* DISCOUNT VALUE */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="block text-xs sm:text-sm md:text-base font-bold text-[#3D271B]">
                Discount Value ({discountType === "PERCENTAGE" ? "%" : "₹"})
              </label>

              <input
                type="number"
                min="0"
                value={discountValue === 0 ? "" : discountValue}
                placeholder="0"
                onChange={(e) =>
                  setDiscountValue(
                    Math.max(0, Number(e.target.value) || 0)
                  )
                }
                className="block w-full px-3.5 sm:px-4 py-3 sm:py-3.5 bg-[#FAF6F0]/40 border border-[#E6CCB2]/40 rounded-2xl text-xs sm:text-sm md:text-base text-[#3D271B] font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#a65827]/20 focus:border-[#a65827] transition"
              />

              {errors.discount && (
                <p className="text-xs sm:text-sm font-bold text-red-500 mt-1">
                  {errors.discount}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* BILL SUMMARY */}
        <div className="bg-gradient-to-br from-[#FAF6F0] to-[#FAF0E6] p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-[#E6CCB2]/50 shadow-sm space-y-4 sm:space-y-5 flex flex-col justify-between">
          <div className="border-b border-[#E6CCB2]/30 pb-3.5">
            <h3 className="font-extrabold text-[#3D271B] uppercase tracking-wider text-sm sm:text-base">
              Billing Calculations
            </h3>
          </div>

          <div className="space-y-2.5 sm:space-y-3.5">
            <div className="flex justify-between items-center text-xs sm:text-sm md:text-base text-[#6E5A4F] font-bold">
              <span>Subtotal:</span>
              <span className="font-mono text-sm sm:text-base md:text-lg text-[#3D271B]">
                ₹{subTotal.toFixed(2)}
              </span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between items-center text-xs sm:text-sm md:text-base text-red-600 font-bold">
                <span>Discount Amount:</span>
                <span className="font-mono text-sm sm:text-base md:text-lg">
                  -₹{discountAmount.toFixed(2)}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center pt-3 sm:pt-4 border-t-2 border-[#E6CCB2]/40 text-sm sm:text-base md:text-lg font-black text-[#3D271B]">
              <span>Grand Total:</span>
              <span className="text-[#a65827] font-mono text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black">
                ₹{finalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================
          ACTION BUTTONS
      ================================================== */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-[#E6CCB2]/30">
        <button
          type="button"
          onClick={() =>
            navigate(orderId ? "/admin/orders" : "/admin/billing")
          }
          disabled={isSaving}
          className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-2xl font-bold text-xs sm:text-sm md:text-base text-slate-700 transition cursor-pointer disabled:opacity-50 text-center"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-3.5 bg-gradient-to-r from-[#3D271B] via-[#a65827] to-[#DFA250] hover:opacity-95 text-[#FAF6F0] rounded-2xl font-black text-xs sm:text-sm md:text-base shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          {isSaving ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Generating Bill...</span>
            </>
          ) : (
            <span>Generate Bill</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default BillDiscountAndSummarySection;
