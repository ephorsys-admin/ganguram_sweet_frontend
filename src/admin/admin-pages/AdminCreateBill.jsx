import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
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

import CreateBillHeader from "../admin-components/Billing/CreateBill/CreateBillHeader";
import CustomerDetailsSection from "../admin-components/Billing/CreateBill/CustomerDetailsSection";
import BillItemsSection from "../admin-components/Billing/CreateBill/BillItemsSection";
import BillDiscountAndSummarySection from "../admin-components/Billing/CreateBill/BillDiscountAndSummarySection";

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
  // LOADING STATE
  // ======================================================
  const [orderLoading, setOrderLoading] = useState(false);

  // ======================================================
  // REDUX STATE
  // ======================================================
  const { products = [] } = useSelector((state) => state.product);
  const {
    isLoading: isSaving,
    customerSummary,
    customerSummaryLoading,
  } = useSelector((state) => state.bill);

  // ======================================================
  // CUSTOMER DETAILS STATE
  // ======================================================
  const [customerName, setCustomerName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");

  // ======================================================
  // ITEMS STATE
  // ======================================================
  const [items, setItems] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [customProductName, setCustomProductName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemQuantity, setItemQuantity] = useState("1");

  // ======================================================
  // DISCOUNT STATE
  // ======================================================
  const [discountType, setDiscountType] = useState("FLAT");
  const [discountValue, setDiscountValue] = useState(0);

  // ======================================================
  // FORM ERRORS STATE
  // ======================================================
  const [errors, setErrors] = useState({});

  // ======================================================
  // LOAD PRODUCTS
  // ======================================================
  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  // ======================================================
  // LOAD ORDER DETAILS (IF ORDER BILL)
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

          if (order.product) {
            setItems([
              {
                productId: order.product._id || order.product,
                productName:
                  order.productName || order.product?.name || "Product",
                quantity: Number(order.quantity || 1),
                price: Number(order.productPrice || 0),
                total: Number(order.totalAmount || 0),
                isCustom: false,
              },
            ]);
          }
        }
      })
      .catch((err) => {
        console.error("Failed to load order details:", err);
        showToast(
          err?.message || "Failed to load order details.",
          "error"
        );
      })
      .finally(() => {
        setOrderLoading(false);
      });
  }, [orderId, dispatch, showToast]);

  // ======================================================
  // CUSTOMER SUMMARY LOOKUP
  // ======================================================
  useEffect(() => {
    const mobileTrimmed = mobile.trim();

    if (/^[6-9]\d{9}$/.test(mobileTrimmed)) {
      dispatch(getCustomerSummary(mobileTrimmed))
        .unwrap()
        .then((result) => {
          if (result?.success && result?.data) {
            const summary = result.data;
            if (summary.customerName && !customerName.trim()) {
              setCustomerName(summary.customerName);
            }
          }
        })
        .catch((err) => {
          console.error("Failed to fetch customer summary:", err);
        });
    } else {
      dispatch(clearCustomerSummary());
    }

    return () => {
      dispatch(clearCustomerSummary());
    };
  }, [mobile, dispatch]);

  // ======================================================
  // PRODUCT SELECTION HANDLER
  // ======================================================
  const handleProductChange = (e) => {
    const prodId = e.target.value;
    setSelectedProductId(prodId);

    if (prodId) {
      const prod = products.find((p) => p._id === prodId);
      if (prod) {
        setItemPrice(prod.sellingPrice ?? "");
        setCustomProductName("");
      }
    } else {
      setItemPrice("");
    }
  };

  // ======================================================
  // ADD ITEM HANDLER (Supports Catalog or Custom/Manual)
  // ======================================================
  const handleAddItem = (e) => {
    if (e) e.preventDefault();

    let finalName = "";
    let finalProductId = null;

    if (selectedProductId) {
      const prod = products.find((p) => p._id === selectedProductId);
      if (prod) {
        finalName = prod.name;
        finalProductId = prod._id;
      }
    } else if (customProductName.trim()) {
      finalName = customProductName.trim();
      finalProductId = null;
    }

    if (!finalName) {
      showToast("Please select a sweet product or enter a custom item name.", "error");
      return;
    }

    const qty = Number(itemQuantity);
    if (!qty || isNaN(qty) || qty <= 0) {
      showToast("Quantity must be greater than 0.", "error");
      return;
    }

    const price = Number(itemPrice);
    if (isNaN(price) || price < 0 || itemPrice === "") {
      showToast("Please enter a valid price.", "error");
      return;
    }

    // Check if item already exists in items list
    const existingIndex = items.findIndex((item) => {
      if (finalProductId && item.productId) {
        return item.productId === finalProductId;
      }
      return (
        !item.productId &&
        item.productName?.toLowerCase().trim() === finalName.toLowerCase().trim()
      );
    });

    if (existingIndex > -1) {
      const updated = [...items];
      const newQty = Number(updated[existingIndex].quantity) + qty;
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: newQty,
        price: price,
        total: Math.round(newQty * price * 100) / 100,
      };
      setItems(updated);
    } else {
      setItems([
        ...items,
        {
          productId: finalProductId,
          productName: finalName,
          quantity: qty,
          price: price,
          total: Math.round(qty * price * 100) / 100,
          isCustom: !finalProductId,
        },
      ]);
    }

    // Reset inputs
    setSelectedProductId("");
    setCustomProductName("");
    setItemPrice("");
    setItemQuantity("1");
  };

  // ======================================================
  // INLINE ITEM EDIT HANDLERS (Qty & Price in Table/Cards)
  // ======================================================
  const handleUpdateItemQuantity = (index, newQty) => {
    const qty = Number(newQty);
    if (isNaN(qty) || qty <= 0) return;
    const updated = [...items];
    const currentPrice = Number(updated[index].price || 0);
    updated[index] = {
      ...updated[index],
      quantity: qty,
      total: Math.round(qty * currentPrice * 100) / 100,
    };
    setItems(updated);
  };

  const handleUpdateItemPrice = (index, newPrice) => {
    const price = Number(newPrice);
    if (isNaN(price) || price < 0) return;
    const updated = [...items];
    const currentQty = Number(updated[index].quantity || 0);
    updated[index] = {
      ...updated[index],
      price: price,
      total: Math.round(currentQty * price * 100) / 100,
    };
    setItems(updated);
  };

  // ======================================================
  // REMOVE ITEM HANDLER
  // ======================================================
  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // ======================================================
  // BILL CALCULATIONS
  // ======================================================
  const subTotal = items.reduce(
    (acc, curr) => acc + Number(curr.total || 0),
    0
  );

  let discountAmount = 0;
  if (discountType === "PERCENTAGE") {
    discountAmount = (subTotal * Number(discountValue || 0)) / 100;
  } else {
    discountAmount = Number(discountValue || 0);
  }

  discountAmount = Math.min(Math.max(0, discountAmount), subTotal);
  const finalAmount = Math.max(0, subTotal - discountAmount);

  // ======================================================
  // FORM VALIDATION
  // ======================================================
  const validateForm = () => {
    const tempErrors = {};

    if (!customerName.trim()) {
      tempErrors.customerName = "Customer name is required.";
    }

    const mobileTrimmed = mobile.trim();
    if (!mobileTrimmed) {
      tempErrors.mobile = "Mobile number is required.";
    } else if (!/^[6-9]\d{9}$/.test(mobileTrimmed)) {
      tempErrors.mobile = "Enter a valid 10-digit mobile number.";
    }

    if (
      email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      tempErrors.email = "Enter a valid email address.";
    }

    if (
      whatsappNumber.trim() &&
      !/^[6-9]\d{9}$/.test(whatsappNumber.trim())
    ) {
      tempErrors.whatsappNumber = "Enter a valid WhatsApp number.";
    }

    if (items.length === 0) {
      tempErrors.items =
        "Please add at least one sweet item to generate the bill.";
    }

    if (
      discountType === "PERCENTAGE" &&
      (Number(discountValue) < 0 || Number(discountValue) > 100)
    ) {
      tempErrors.discount =
        "Discount percentage must be between 0 and 100.";
    }

    if (discountType === "FLAT" && Number(discountValue) < 0) {
      tempErrors.discount = "Discount value cannot be negative.";
    }

    if (discountType === "FLAT" && Number(discountValue) > subTotal) {
      tempErrors.discount = "Flat discount cannot exceed subtotal amount.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // ======================================================
  // GENERATE BILL SUBMISSION
  // ======================================================
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const payload = {
        customerName: customerName.trim(),
        mobile: mobile.trim(),
        email: email.trim(),
        whatsappNumber: whatsappNumber.trim(),
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth).toISOString() : null,
        address: address.trim(),
        items: items.map((it) => ({
          productId: it.productId || null,
          productName: it.productName,
          quantity: Number(it.quantity),
          price: Number(it.price),
        })),
        discountType,
        discountValue: Number(discountValue || 0),
      };

      if (orderId) {
        payload.orderId = orderId;

        const result = await dispatch(createOrderBill(payload)).unwrap();
        if (!result?.success) {
          throw new Error(
            result?.message || "Failed to generate order bill."
          );
        }

        showToast("Order bill generated successfully!", "success");

        try {
          const statusResult = await dispatch(
            updateOrderStatus({
              orderId,
              orderStatus: "Preparing",
            })
          ).unwrap();

          if (statusResult?.success) {
            showToast("Order status shifted to Preparing!", "success");
          }
        } catch (statusError) {
          console.error("Failed to update order status:", statusError);
        }

        setTimeout(() => {
          navigate("/admin/orders");
        }, 500);

        return;
      }

      const result = await dispatch(createWalkinBill(payload)).unwrap();
      if (!result?.success) {
        throw new Error(
          result?.message || "Failed to create walk-in bill."
        );
      }

      showToast("Walk-in bill generated successfully!", "success");

      setTimeout(() => {
        navigate("/admin/billing");
      }, 500);
    } catch (err) {
      console.error("Failed to process bill creation:", err);
      showToast(
        err?.message || "Failed to process bill creation.",
        "error"
      );
    }
  };

  // ======================================================
  // LOADING STATE
  // ======================================================
  if (orderLoading) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-[#E6CCB2]/30 shadow-xs flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Loader2 className="h-12 w-12 text-[#DFA250] animate-spin" />
        <span className="text-sm md:text-base text-[#6E5A4F] font-semibold">
          Loading Order details...
        </span>
      </div>
    );
  }

  // ======================================================
  // RENDER
  // ======================================================
  return (
    <div className="space-y-4 sm:space-y-7 md:space-y-8 font-sans max-w-5xl mx-auto px-0 sm:px-4 md:px-6 lg:px-8 pb-10 sm:pb-14">
      {/* 1. HEADER */}
      <CreateBillHeader orderId={orderId} />

      {/* 2. FORM */}
      <form onSubmit={handleFormSubmit} className="space-y-4 sm:space-y-7 md:space-y-8">
        {/* CUSTOMER DETAILS SECTION */}
        <CustomerDetailsSection
          customerName={customerName}
          setCustomerName={setCustomerName}
          mobile={mobile}
          setMobile={setMobile}
          email={email}
          setEmail={setEmail}
          whatsappNumber={whatsappNumber}
          setWhatsappNumber={setWhatsappNumber}
          dateOfBirth={dateOfBirth}
          setDateOfBirth={setDateOfBirth}
          address={address}
          setAddress={setAddress}
          customerSummary={customerSummary}
          customerSummaryLoading={customerSummaryLoading}
          errors={errors}
        />

        {/* ITEMS LIST SECTION */}
        <BillItemsSection
          products={products}
          selectedProductId={selectedProductId}
          handleProductChange={handleProductChange}
          customProductName={customProductName}
          setCustomProductName={setCustomProductName}
          itemPrice={itemPrice}
          setItemPrice={setItemPrice}
          itemQuantity={itemQuantity}
          setItemQuantity={setItemQuantity}
          handleAddItem={handleAddItem}
          items={items}
          handleRemoveItem={handleRemoveItem}
          handleUpdateItemQuantity={handleUpdateItemQuantity}
          handleUpdateItemPrice={handleUpdateItemPrice}
          errors={errors}
        />

        {/* DISCOUNT & BILLING CALCULATIONS SECTION */}
        <BillDiscountAndSummarySection
          discountType={discountType}
          setDiscountType={setDiscountType}
          discountValue={discountValue}
          setDiscountValue={setDiscountValue}
          subTotal={subTotal}
          discountAmount={discountAmount}
          finalAmount={finalAmount}
          errors={errors}
          isSaving={isSaving}
          orderId={orderId}
        />
      </form>
    </div>
  );
};

export default AdminCreateBill;