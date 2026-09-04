import { useState, useEffect } from "react";
import {
  ArrowLeft,
  ClipboardList,
  Loader2,
  Plus,
  Trash2,
  ShoppingBag,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  createWalkinBill,
  createOrderBill,
  getCustomerSummary,
} from "../../redux/features/bill/billThunk";

import { clearCustomerSummary } from "../../redux/features/bill/billSlice";

import {
  getSingleOrder,
  updateOrderStatus,
} from "../../redux/features/order/orderThunk";

import { getProducts } from "../../redux/features/product/productThunk";

import { useToast } from "../../context/ToastContext";

// ======================================================
// ADMIN CREATE BILL
// ======================================================

const AdminCreateBill = () => {
  const { showToast } = useToast();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const orderId = searchParams.get("orderId");

  // ======================================================
  // LOADING
  // ======================================================

  const [orderLoading, setOrderLoading] = useState(false);

  // ======================================================
  // REDUX STATE
  // ======================================================

  const { products = [] } = useSelector(
    (state) => state.product
  );

  const {
    isLoading: isSaving,
    customerSummary,
    customerSummaryLoading,
  } = useSelector((state) => state.bill);

  // ======================================================
  // CUSTOMER DETAILS
  // ======================================================

  const [customerName, setCustomerName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");

  // ======================================================
  // ITEMS
  // ======================================================

  const [items, setItems] = useState([]);

  // ======================================================
  // PRODUCT SELECTOR
  // ======================================================

  const [selectedProductId, setSelectedProductId] = useState("");
  const [itemPrice, setItemPrice] = useState(0);
  const [itemQuantity, setItemQuantity] = useState(1);

  // ======================================================
  // DISCOUNT
  // ======================================================

  const [discountType, setDiscountType] = useState("FLAT");
  const [discountValue, setDiscountValue] = useState(0);

  // ======================================================
  // FORM ERRORS
  // ======================================================

  const [errors, setErrors] = useState({});

  // ======================================================
  // LOAD PRODUCTS
  // ======================================================

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  // ======================================================
  // LOAD ORDER DETAILS
  // ======================================================

  useEffect(() => {
    if (!orderId) return;

    setOrderLoading(true);

    dispatch(getSingleOrder(orderId))
      .unwrap()
      .then((result) => {
        if (result?.success && result?.data) {
          const order = result.data;

          setCustomerName(order.customerName || "");
          setMobile(order.customerMobile || "");
          setEmail(order.customerEmail || "");
          setAddress(order.deliveryAddress || "");

          // ----------------------------------------------
          // PRE-FILL ORDER ITEM
          // ----------------------------------------------

          if (order.product) {
            setItems([
              {
                productId:
                  order.product._id || order.product,

                productName:
                  order.productName ||
                  order.product?.name ||
                  "Product",

                quantity: Number(order.quantity || 1),

                price: Number(
                  order.productPrice || 0
                ),

                total: Number(
                  order.totalAmount || 0
                ),
              },
            ]);
          }
        }
      })
      .catch((err) => {
        console.error(
          "Failed to load order details:",
          err
        );

        showToast(
          err?.message ||
          "Failed to load order details.",
          "error"
        );
      })
      .finally(() => {
        setOrderLoading(false);
      });
  }, [orderId, dispatch, showToast]);

  // ======================================================
  // CUSTOMER SUMMARY
  // ======================================================

  useEffect(() => {
    const mobileTrimmed = mobile.trim();

    if (/^[6-9]\d{9}$/.test(mobileTrimmed)) {
      dispatch(getCustomerSummary(mobileTrimmed))
        .unwrap()
        .then((result) => {
          if (
            result?.success &&
            result?.data
          ) {
            const summary = result.data;

            if (
              summary.customerName &&
              !customerName.trim()
            ) {
              setCustomerName(
                summary.customerName
              );
            }
          }
        })
        .catch((err) => {
          console.error(
            "Failed to fetch customer summary:",
            err
          );
        });
    } else {
      dispatch(clearCustomerSummary());
    }

    return () => {
      dispatch(clearCustomerSummary());
    };
  }, [mobile, dispatch]);

  // ======================================================
  // PRODUCT CHANGE
  // ======================================================

  const handleProductChange = (e) => {
    const prodId = e.target.value;

    setSelectedProductId(prodId);

    const prod = products.find(
      (p) => p._id === prodId
    );

    if (prod) {
      setItemPrice(
        Number(prod.sellingPrice || 0)
      );
    } else {
      setItemPrice(0);
    }
  };

  // ======================================================
  // ADD ITEM
  // ======================================================

  const handleAddItem = (e) => {
    e.preventDefault();

    if (!selectedProductId) {
      showToast(
        "Please select a sweet product first.",
        "error"
      );
      return;
    }

    if (itemQuantity < 1) {
      showToast(
        "Quantity must be at least 1.",
        "error"
      );
      return;
    }

    const prod = products.find(
      (p) => p._id === selectedProductId
    );

    if (!prod) {
      showToast(
        "Selected product not found.",
        "error"
      );
      return;
    }

    const price = Number(itemPrice || 0);

    const existingIndex = items.findIndex(
      (item) =>
        item.productId === selectedProductId
    );

    // ----------------------------------------------
    // EXISTING ITEM
    // ----------------------------------------------

    if (existingIndex > -1) {
      const updated = [...items];

      updated[existingIndex] = {
        ...updated[existingIndex],

        quantity:
          updated[existingIndex].quantity +
          itemQuantity,

        total:
          (updated[existingIndex].quantity +
            itemQuantity) *
          updated[existingIndex].price,
      };

      setItems(updated);
    }

    // ----------------------------------------------
    // NEW ITEM
    // ----------------------------------------------

    else {
      setItems([
        ...items,
        {
          productId: selectedProductId,

          productName: prod.name,

          quantity: itemQuantity,

          price,

          total: itemQuantity * price,
        },
      ]);
    }

    // Reset selector

    setSelectedProductId("");
    setItemPrice(0);
    setItemQuantity(1);
  };

  // ======================================================
  // REMOVE ITEM
  // ======================================================

  const handleRemoveItem = (index) => {
    setItems(
      items.filter((_, i) => i !== index)
    );
  };

  // ======================================================
  // BILL CALCULATIONS
  // ======================================================

  const subTotal = items.reduce(
    (acc, curr) =>
      acc +
      Number(curr.total || 0),
    0
  );

  let discountAmount = 0;

  if (discountType === "PERCENTAGE") {
    discountAmount =
      (subTotal *
        Number(discountValue || 0)) /
      100;
  } else {
    discountAmount =
      Number(discountValue || 0);
  }

  discountAmount = Math.min(
    Math.max(0, discountAmount),
    subTotal
  );

  const finalAmount = Math.max(
    0,
    subTotal - discountAmount
  );

  // ======================================================
  // VALIDATE FORM
  // ======================================================

  const validateForm = () => {
    const tempErrors = {};

    // Customer name

    if (!customerName.trim()) {
      tempErrors.customerName =
        "Customer name is required.";
    }

    // Mobile

    const mobileTrimmed =
      mobile.trim();

    if (!mobileTrimmed) {
      tempErrors.mobile =
        "Mobile number is required.";
    } else if (
      !/^[6-9]\d{9}$/.test(
        mobileTrimmed
      )
    ) {
      tempErrors.mobile =
        "Enter a valid 10-digit mobile number.";
    }

    // Email

    if (
      email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email.trim()
      )
    ) {
      tempErrors.email =
        "Enter a valid email address.";
    }

    // WhatsApp

    if (
      whatsappNumber.trim() &&
      !/^[6-9]\d{9}$/.test(
        whatsappNumber.trim()
      )
    ) {
      tempErrors.whatsappNumber =
        "Enter a valid WhatsApp number.";
    }

    // Items

    if (items.length === 0) {
      tempErrors.items =
        "Please add at least one sweet item to generate the bill.";
    }

    // Discount

    if (
      discountType === "PERCENTAGE" &&
      (Number(discountValue) < 0 ||
        Number(discountValue) > 100)
    ) {
      tempErrors.discount =
        "Discount percentage must be between 0 and 100.";
    }

    if (
      discountType === "FLAT" &&
      Number(discountValue) < 0
    ) {
      tempErrors.discount =
        "Discount value cannot be negative.";
    }

    if (
      discountType === "FLAT" &&
      Number(discountValue) > subTotal
    ) {
      tempErrors.discount =
        "Flat discount cannot exceed subtotal amount.";
    }

    setErrors(tempErrors);

    return (
      Object.keys(tempErrors).length === 0
    );
  };

  // ======================================================
  // GENERATE BILL
  // ======================================================

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // ==================================================
      // PAYLOAD
      // ==================================================

      const payload = {
        customerName:
          customerName.trim(),

        mobile:
          mobile.trim(),

        email:
          email.trim(),

        whatsappNumber:
          whatsappNumber.trim(),

        dateOfBirth: dateOfBirth
          ? new Date(
            dateOfBirth
          ).toISOString()
          : null,

        address:
          address.trim(),

        items: items.map((it) => ({
          productId: it.productId,

          productName:
            it.productName,

          quantity:
            Number(it.quantity),

          price:
            Number(it.price),
        })),

        discountType,

        discountValue:
          Number(discountValue || 0),
      };

      // ==================================================
      // ORDER BILL
      // ==================================================

      if (orderId) {
        payload.orderId = orderId;

        const result =
          await dispatch(
            createOrderBill(payload)
          ).unwrap();

        if (!result?.success) {
          throw new Error(
            result?.message ||
            "Failed to generate order bill."
          );
        }

        // ----------------------------------------------
        // BILL CREATED
        // ----------------------------------------------

        showToast(
          "Order bill generated successfully!",
          "success"
        );

        // ----------------------------------------------
        // UPDATE ORDER STATUS
        // ----------------------------------------------

        try {
          const statusResult =
            await dispatch(
              updateOrderStatus({
                orderId,
                orderStatus:
                  "Preparing",
              }),
            ).unwrap();

          if (statusResult?.success) {
            showToast(
              "Order status shifted to Preparing!",
              "success"
            );
          }
        } catch (statusError) {
          console.error(
            "Failed to update order status:",
            statusError
          );
        }

        // ----------------------------------------------
        // REDIRECT BACK TO ORDERS
        // ----------------------------------------------

        setTimeout(() => {
          navigate("/admin/orders");
        }, 500);

        return;
      }

      // ==================================================
      // WALK-IN BILL
      // ==================================================

      const result =
        await dispatch(
          createWalkinBill(payload)
        ).unwrap();

      if (!result?.success) {
        throw new Error(
          result?.message ||
          "Failed to create walk-in bill."
        );
      }

      // ----------------------------------------------
      // BILL CREATED
      // ----------------------------------------------

      showToast(
        "Walk-in bill generated successfully!",
        "success"
      );

      // ----------------------------------------------
      // IMPORTANT
      //
      // PDF OPEN NAHI HOGA
      // NEW TAB OPEN NAHI HOGA
      // PRINT DIALOG OPEN NAHI HOGA
      //
      // DIRECT BILL LISTING PAGE
      // ----------------------------------------------

      setTimeout(() => {
        navigate("/admin/billing");
      }, 500);

    } catch (err) {
      console.error(
        "Failed to process bill creation:",
        err
      );

      showToast(
        err?.message ||
        "Failed to process bill creation.",
        "error"
      );
    }
  };

  // ======================================================
  // ORDER LOADING
  // ======================================================

  if (orderLoading) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-[#E6CCB2]/30 shadow-xs flex flex-col items-center justify-center min-h-[50vh] space-y-3">

        <Loader2
          className="h-10 w-10 text-[#DFA250] animate-spin"
        />

        <span className="text-xs text-[#6E5A4F] font-semibold">
          Loading Order details...
        </span>
      </div>
    );
  }

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="space-y-6 text-xs font-sans max-w-4xl mx-auto">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex items-center gap-3 pb-2">

        <button
          type="button"
          onClick={() =>
            navigate(
              orderId
                ? "/admin/orders"
                : "/admin/billing"
            )
          }
          className="p-2 hover:bg-white text-[#6E5A4F] hover:text-[#3D271B] border border-[#E6CCB2]/30 rounded-xl transition cursor-pointer"
          title={
            orderId
              ? "Back to Orders"
              : "Back to Bills"
          }
        >
          <ArrowLeft size={16} />
        </button>

        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-black text-[#3D271B] flex items-center gap-2">

            <ClipboardList className="text-[#a65827] h-8 w-8" />

            {orderId
              ? "Generate Order Bill"
              : "New Walk-in Bill"}
          </h1>

          <p className="text-xs text-[#6E5A4F] mt-1">

            {orderId
              ? "Configure and generate receipt for existing customer order."
              : "Generate POS invoices, register customer details, and calculate discounts."}

          </p>
        </div>
      </div>

      {/* ==================================================
          FORM
      ================================================== */}

      <form
        onSubmit={handleFormSubmit}
        className="space-y-6"
      >

        {/* ==================================================
            CUSTOMER DETAILS
        ================================================== */}

        <div className="bg-white p-5 rounded-3xl border border-[#E6CCB2]/30 shadow-xs space-y-4">

          <h4 className="font-bold text-[#3D271B] uppercase tracking-wider text-[11px] border-b border-[#FAF6F0] pb-2">
            1. Customer Details
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* CUSTOMER NAME */}

            <div className="space-y-1">

              <label className="block text-[#6E5A4F] font-bold">
                Customer Name{" "}
                <span className="text-red-500">
                  *
                </span>
              </label>

              <input
                type="text"
                placeholder="e.g. Rajesh Kumar"
                value={customerName}
                onChange={(e) =>
                  setCustomerName(
                    e.target.value
                  )
                }
                className="block w-full px-3.5 py-2.5 bg-[#FAF6F0]/40 border border-[#E6CCB2]/30 rounded-xl text-xs text-[#3D271B] font-semibold focus:outline-none"
              />

              {errors.customerName && (
                <p className="text-[10px] font-bold text-red-500">
                  {errors.customerName}
                </p>
              )}
            </div>

            {/* MOBILE */}

            <div className="space-y-1">

              <label className="block text-[#6E5A4F] font-bold">
                Mobile Number{" "}
                <span className="text-red-500">
                  *
                </span>
              </label>

              <input
                type="text"
                inputMode="numeric"
                maxLength={10}
                placeholder="10-digit number"
                value={mobile}
                onChange={(e) =>
                  setMobile(
                    e.target.value.replace(
                      /\D/g,
                      ""
                    ).slice(0, 10)
                  )
                }
                className="block w-full px-3.5 py-2.5 bg-[#FAF6F0]/40 border border-[#E6CCB2]/30 rounded-xl text-xs text-[#3D271B] font-mono focus:outline-none"
              />

              {errors.mobile && (
                <p className="text-[10px] font-bold text-red-500">
                  {errors.mobile}
                </p>
              )}
            </div>
          </div>

          {/* EMAIL / WHATSAPP / DOB */}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            {/* EMAIL */}

            <div className="space-y-1">

              <label className="block text-[#6E5A4F] font-bold">
                Email Address
              </label>

              <input
                type="email"
                placeholder="e.g. name@domain.com"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                className="block w-full px-3.5 py-2.5 bg-[#FAF6F0]/40 border border-[#E6CCB2]/30 rounded-xl text-xs text-[#3D271B] focus:outline-none"
              />

              {errors.email && (
                <p className="text-[10px] font-bold text-red-500">
                  {errors.email}
                </p>
              )}
            </div>

            {/* WHATSAPP */}

            <div className="space-y-1">

              <label className="block text-[#6E5A4F] font-bold">
                WhatsApp Number
              </label>

              <input
                type="text"
                inputMode="numeric"
                maxLength={10}
                placeholder="optional"
                value={whatsappNumber}
                onChange={(e) =>
                  setWhatsappNumber(
                    e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10)
                  )
                }
                className="block w-full px-3.5 py-2.5 bg-[#FAF6F0]/40 border border-[#E6CCB2]/30 rounded-xl text-xs text-[#3D271B] font-mono focus:outline-none"
              />

              {errors.whatsappNumber && (
                <p className="text-[10px] font-bold text-red-500">
                  {errors.whatsappNumber}
                </p>
              )}
            </div>

            {/* DOB */}

            <div className="space-y-1">

              <label className="block text-[#6E5A4F] font-bold">
                Date of Birth
              </label>

              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) =>
                  setDateOfBirth(
                    e.target.value
                  )
                }
                className="block w-full px-3.5 py-2.5 bg-[#FAF6F0]/40 border border-[#E6CCB2]/30 rounded-xl text-xs text-[#3D271B] focus:outline-none"
              />
            </div>
          </div>

          {/* ADDRESS */}

          <div className="space-y-1">

            <label className="block text-[#6E5A4F] font-bold">
              Address
            </label>

            <input
              type="text"
              placeholder="Residential address details (optional)"
              value={address}
              onChange={(e) =>
                setAddress(
                  e.target.value
                )
              }
              className="block w-full px-3.5 py-2.5 bg-[#FAF6F0]/40 border border-[#E6CCB2]/30 rounded-xl text-xs text-[#3D271B] font-semibold focus:outline-none"
            />
          </div>

          {/* CUSTOMER SUMMARY */}

          {customerSummaryLoading && (
            <div className="flex items-center gap-2 text-xs text-[#DFA250] font-semibold mt-2 animate-pulse">

              <Loader2 className="h-3 w-3 animate-spin" />

              <span>
                Fetching customer history...
              </span>
            </div>
          )}

          {customerSummary &&
            customerSummary.totalBills > 0 && (
              <div className="mt-4 p-4 bg-[#FAF6F0] border border-[#DFA250]/20 rounded-2xl space-y-2.5">

                <div className="flex items-center gap-2 text-[#a65827]">

                  <ShoppingBag
                    size={14}
                    className="animate-bounce"
                  />

                  <span className="font-extrabold text-[10px] uppercase tracking-wider">
                    Returning Customer Purchase Summary
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1 text-xs">

                  <div className="bg-white p-2.5 rounded-xl border border-[#E6CCB2]/20">
                    <p className="text-[#6E5A4F] font-semibold text-[10px] uppercase tracking-wider">
                      Total Purchase Visits
                    </p>

                    <p className="text-[#3D271B] font-extrabold text-[15px] mt-0.5">
                      {customerSummary.totalBills}
                    </p>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-[#E6CCB2]/20">
                    <p className="text-[#6E5A4F] font-semibold text-[10px] uppercase tracking-wider">
                      Total Amount Spent
                    </p>

                    <p className="text-[#3D271B] font-extrabold text-[15px] mt-0.5 text-green-700">
                      ₹
                      {Number(
                        customerSummary.totalPurchase ||
                        0
                      ).toFixed(2)}
                    </p>
                  </div>

                  {customerSummary.lastPurchaseDate && (
                    <div className="bg-white p-2.5 rounded-xl border border-[#E6CCB2]/20">

                      <p className="text-[#6E5A4F] font-semibold text-[10px] uppercase tracking-wider">
                        Last Purchase Date
                      </p>

                      <p className="text-[#3D271B] font-bold text-[13px] mt-0.5">
                        {new Date(
                          customerSummary.lastPurchaseDate
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  )}

                  {customerSummary.lastInvoice && (
                    <div className="bg-white p-2.5 rounded-xl border border-[#E6CCB2]/20">

                      <p className="text-[#6E5A4F] font-semibold text-[10px] uppercase tracking-wider">
                        Last Invoice
                      </p>

                      <p className="text-[#3D271B] font-bold font-mono text-[13px] mt-0.5 text-[#a65827]">
                        #
                        {
                          customerSummary.lastInvoice
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
        </div>

        {/* ==================================================
            ITEMS
        ================================================== */}

        <div className="bg-white p-5 rounded-3xl border border-[#E6CCB2]/30 shadow-xs space-y-4">

          <h4 className="font-bold text-[#3D271B] uppercase tracking-wider text-[11px] border-b border-[#FAF6F0] pb-2 flex items-center gap-1.5">

            <ShoppingBag
              size={13}
              className="text-[#a65827]"
            />

            2. Items List
          </h4>

          <div className="flex flex-col sm:grid sm:grid-cols-4 gap-4">

            {/* PRODUCT */}

            <div className="sm:col-span-2 space-y-1">

              <label className="block text-[#6E5A4F] font-bold">
                Sweet Product
              </label>

              <select
                value={selectedProductId}
                onChange={handleProductChange}
                className="block w-full px-3.5 py-2.5 bg-[#FAF6F0]/45 border border-[#E6CCB2]/30 rounded-xl text-xs text-[#3D271B] font-semibold focus:outline-none"
              >
                <option value="">
                  -- Choose Sweet --
                </option>

                {products.map((p) => (
                  <option
                    key={p._id}
                    value={p._id}
                  >
                    {p.name} (₹
                    {p.sellingPrice} /{" "}
                    {p.unit})
                  </option>
                ))}
              </select>
            </div>

            {/* PRICE / QTY / ADD */}

            <div className="grid grid-cols-12 gap-2 sm:col-span-2 items-end">

              {/* PRICE */}

              <div className="space-y-1 col-span-5 sm:col-span-6">

                <label className="block text-[#6E5A4F] font-bold">
                  Price
                </label>

                <input
                  type="number"
                  min="0"
                  value={itemPrice}
                  onChange={(e) =>
                    setItemPrice(
                      Number(
                        e.target.value
                      ) || 0
                    )
                  }
                  className="block w-full px-3.5 py-2.5 bg-white border border-[#E6CCB2]/30 rounded-xl text-xs text-[#3D271B] font-mono focus:outline-none"
                />
              </div>

              {/* QTY */}

              <div className="space-y-1 col-span-4 sm:col-span-3">

                <label className="block text-[#6E5A4F] font-bold">
                  Qty
                </label>

                <input
                  type="number"
                  min="1"
                  value={itemQuantity}
                  onChange={(e) =>
                    setItemQuantity(
                      Math.max(
                        1,
                        parseInt(
                          e.target.value
                        ) || 1
                      )
                    )
                  }
                  className="block w-full px-3.5 py-2.5 bg-white border border-[#E6CCB2]/30 rounded-xl text-xs text-[#3D271B] font-mono focus:outline-none"
                />
              </div>

              {/* ADD */}

              <div className="col-span-3 sm:col-span-3">

                <button
                  type="button"
                  onClick={handleAddItem}
                  className="w-full h-9.5 bg-[#a65827] text-white rounded-xl hover:bg-[#3D271B] transition cursor-pointer flex items-center justify-center gap-1 shadow-xs hover:scale-105 active:scale-95 text-[11px] font-bold"
                >
                  <Plus size={14} />
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* ==================================================
              ITEMS TABLE
          ================================================== */}

          {items.length > 0 ? (
            <>
              {/* DESKTOP */}

              <div className="hidden sm:block border border-[#E6CCB2]/20 rounded-2xl overflow-hidden mt-3 bg-white">

                <table className="w-full text-left text-xs">

                  <thead>
                    <tr className="bg-[#FAF6F0]/40 text-[#6E5A4F] font-semibold border-b border-[#E6CCB2]/20">

                      <th className="px-5 py-3">
                        Item Name
                      </th>

                      <th className="px-5 py-3 text-center">
                        Qty
                      </th>

                      <th className="px-5 py-3 text-right">
                        Price
                      </th>

                      <th className="px-5 py-3 text-right">
                        Total
                      </th>

                      <th className="px-5 py-3 text-right">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#FAF6F0] text-[#3D271B]">

                    {items.map(
                      (it, idx) => (
                        <tr
                          key={`${it.productId}-${idx}`}
                          className="hover:bg-[#FAF6F0]/15"
                        >

                          <td className="px-5 py-3 font-bold">
                            {it.productName}
                          </td>

                          <td className="px-5 py-3 text-center font-bold font-mono">
                            {it.quantity}
                          </td>

                          <td className="px-5 py-3 text-right font-mono">
                            ₹
                            {Number(
                              it.price
                            ).toFixed(2)}
                          </td>

                          <td className="px-5 py-3 text-right font-bold font-mono">
                            ₹
                            {Number(
                              it.total
                            ).toFixed(2)}
                          </td>

                          <td className="px-5 py-3 text-right">

                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveItem(
                                  idx
                                )
                              }
                              className="p-1 text-red-500 hover:bg-red-50 rounded transition"
                              title="Remove Item"
                            >
                              <Trash2 size={13} />
                            </button>

                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* MOBILE */}

              <div className="block sm:hidden space-y-2 mt-3">

                {items.map(
                  (it, idx) => (
                    <div
                      key={`${it.productId}-${idx}`}
                      className="bg-white p-3 rounded-xl border border-[#E6CCB2]/20 flex items-center justify-between gap-3"
                    >

                      <div className="space-y-1">

                        <p className="font-bold text-[#3D271B]">
                          {it.productName}
                        </p>

                        <p className="text-[10px] text-[#6E5A4F] font-semibold font-mono">
                          {it.quantity} x ₹
                          {Number(
                            it.price
                          ).toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">

                        <span className="font-bold font-mono text-xs text-[#a65827]">
                          ₹
                          {Number(
                            it.total
                          ).toFixed(2)}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveItem(
                              idx
                            )
                          }
                          className="p-1.5 text-red-500 bg-red-50 rounded-lg transition"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            </>
          ) : (
            <p className="text-[11px] font-semibold text-slate-500 text-center py-5 bg-[#FAF6F0]/20 rounded-2xl border border-dashed border-[#E6CCB2]/30 mt-3">
              No items added yet. Choose a
              product and click "+ Add" to add it
              to the list.
            </p>
          )}

          {errors.items && (
            <p className="text-[10px] font-bold text-red-500 mt-1">
              {errors.items}
            </p>
          )}
        </div>

        {/* ==================================================
            DISCOUNT + BILLING
        ================================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          {/* DISCOUNT */}

          <div className="bg-white p-5 rounded-3xl border border-[#E6CCB2]/30 shadow-xs space-y-4 flex flex-col justify-between">

            <h4 className="font-bold text-[#3D271B] uppercase tracking-wider text-[11px] border-b border-[#FAF6F0] pb-2">
              3. Discount config
            </h4>

            <div className="space-y-3.5">

              {/* TYPE */}

              <div className="space-y-1.5">

                <label className="block text-[#6E5A4F] font-bold">
                  Discount Type
                </label>

                <div className="flex gap-5">

                  <label className="flex items-center gap-1.5 font-bold text-slate-700 cursor-pointer">

                    <input
                      type="radio"
                      name="discType"
                      value="FLAT"
                      checked={
                        discountType ===
                        "FLAT"
                      }
                      onChange={() =>
                        setDiscountType(
                          "FLAT"
                        )
                      }
                    />

                    Flat (₹)
                  </label>

                  <label className="flex items-center gap-1.5 font-bold text-slate-700 cursor-pointer">

                    <input
                      type="radio"
                      name="discType"
                      value="PERCENTAGE"
                      checked={
                        discountType ===
                        "PERCENTAGE"
                      }
                      onChange={() =>
                        setDiscountType(
                          "PERCENTAGE"
                        )
                      }
                    />

                    Percentage (%)
                  </label>
                </div>
              </div>

              {/* VALUE */}

              <div className="space-y-1">

                <label className="block text-[#6E5A4F] font-bold">

                  Discount Value (
                  {discountType ===
                    "PERCENTAGE"
                    ? "%"
                    : "₹"}
                  )
                </label>

                <input
                  type="number"
                  min="0"
                  value={
                    discountValue === 0
                      ? ""
                      : discountValue
                  }
                  placeholder="0"
                  onChange={(e) =>
                    setDiscountValue(
                      Math.max(
                        0,
                        Number(
                          e.target.value
                        ) || 0
                      )
                    )
                  }
                  className="block w-full px-3.5 py-2 bg-[#FAF6F0]/40 border border-[#E6CCB2]/30 rounded-xl text-xs text-[#3D271B] font-mono focus:outline-none"
                />

                {errors.discount && (
                  <p className="text-[10px] font-bold text-red-500 mt-1">
                    {errors.discount}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* BILL SUMMARY */}

          <div className="bg-[#FAF6F0]/40 p-5 rounded-3xl border border-[#E6CCB2]/30 shadow-xs space-y-4 flex flex-col justify-between">

            <h4 className="font-extrabold text-[#3D271B] border-b border-[#E6CCB2]/20 pb-2">
              Billing calculations
            </h4>

            <div className="space-y-2.5">

              <div className="flex justify-between items-center text-[#6E5A4F] font-bold">

                <span>
                  Subtotal:
                </span>

                <span className="font-mono">
                  ₹
                  {subTotal.toFixed(2)}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between items-center text-red-500 font-bold">

                  <span>
                    Discount Amount:
                  </span>

                  <span className="font-mono">
                    -₹
                    {discountAmount.toFixed(
                      2
                    )}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center pt-2.5 border-t border-[#E6CCB2]/25 text-sm font-black text-[#3D271B]">

                <span>
                  Grand Total:
                </span>

                <span className="text-[#a65827] font-mono text-lg font-black">
                  ₹
                  {finalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================
            ACTION BUTTONS
        ================================================== */}

        <div className="flex justify-end gap-3 pt-4 border-t border-[#E6CCB2]/20">

          <button
            type="button"
            onClick={() =>
              navigate(
                orderId
                  ? "/admin/orders"
                  : "/admin/billing"
              )
            }
            disabled={isSaving}
            className="px-6 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-600 transition cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>

          {/* ==================================================
              GENERATE BILL
          ================================================== */}

          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-2.5 bg-gradient-to-r from-[#3D271B] to-[#a65827] hover:from-[#a65827] hover:to-[#DFA250] text-[#FAF6F0] rounded-xl font-bold shadow-lg transition-all duration-300 flex items-center gap-1.5 disabled:opacity-50 hover:-translate-y-0.5 active:translate-y-0"
          >

            {isSaving ? (
              <>
                <Loader2
                  size={13}
                  className="animate-spin"
                />

                Generating Bill...
              </>
            ) : (
              <>
                <span>
                  Generate Bill
                </span>
              </>
            )}

          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCreateBill;