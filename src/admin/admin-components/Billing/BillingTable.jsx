import {
  Calendar,
  Eye,
  Download,
  ReceiptText,
  Printer,
  RefreshCw,
  Wifi,
  WifiOff,
  X,
  Usb,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";
import qz from "qz-tray";

// ============================================================
// SHOP CONFIG
// ============================================================

const SHOP = {
  name: "MAHARAJA",
  subName: "GANGURAM SWEETS",
  tagline: "QUALITY SWEETS, HAPPY MOMENTS",
  address:
    "MIG 30, Near Fire Station Square, Housing Board Colony, Baramunda, Bhubaneswar, Odisha 751003",
  phone: "+91 9114029555",
  // Set this to your logo image path/URL (e.g. "/logo.png" or a hosted
  // https URL) to print an actual logo on the RawBT thermal bill.
  // Leave it "" to keep the bold text header (no logo image).
  logoUrl: "",
  // Width of the printable area in dots. 384 = 58mm printer, 576 = 80mm printer.
  printerWidthDots: 384,
};

// ============================================================
// DEVICE CHECK
// ============================================================

const isAndroidDevice = () => {
  if (typeof navigator === "undefined") {
    return false;
  }

  const userAgent = navigator.userAgent || "";
  const platform = navigator.platform || "";

  // ----------------------------------------------------------
  // Normal Android Mobile / Tablet
  // ----------------------------------------------------------

  if (/Android/i.test(userAgent)) {
    return true;
  }

  // ----------------------------------------------------------
  // Android Tablet with Chrome "Desktop Site"
  //
  // When Desktop Site is enabled, Android may hide
  // "Android" from the User-Agent.
  // ----------------------------------------------------------

  const maxTouchPoints = navigator.maxTouchPoints || 0;
  const isTouchDevice = maxTouchPoints >= 2;

  const isLinuxDevice =
    /Linux/i.test(platform) || /Linux/i.test(userAgent);

  const screenWidth = window.screen?.width || window.innerWidth || 0;
  const screenHeight = window.screen?.height || window.innerHeight || 0;

  const largerScreen = Math.max(screenWidth, screenHeight) <= 1800;

  if (isTouchDevice && isLinuxDevice && largerScreen) {
    return true;
  }

  return false;
};

// ============================================================
// ESC/POS
// ============================================================

const ESC = "\x1B";
const GS = "\x1D";

const ESC_POS = {
  INIT: `${ESC}@`,

  ALIGN_LEFT: `${ESC}a\x00`,
  ALIGN_CENTER: `${ESC}a\x01`,
  ALIGN_RIGHT: `${ESC}a\x02`,

  BOLD_ON: `${ESC}E\x01`,
  BOLD_OFF: `${ESC}E\x00`,

  DOUBLE_ON: `${ESC}!\x30`,
  NORMAL: `${ESC}!\x00`,

  CUT: `${GS}V\x00`,
};

// ============================================================
// TEXT HELPERS
// ============================================================

const cleanText = (value = "") => {
  return String(value)
    .replace(/[₹]/g, "Rs.")
    .replace(/[^\x00-\x7F]/g, "");
};

const padRight = (text = "", length = 32) => {
  text = cleanText(text);

  if (text.length > length) {
    return text.substring(0, length);
  }

  return text + " ".repeat(length - text.length);
};

const padLeft = (text = "", length = 32) => {
  text = cleanText(text);

  if (text.length > length) {
    return text.substring(text.length - length);
  }

  return " ".repeat(length - text.length) + text;
};

const twoColumn = (left, right, width = 32) => {
  left = cleanText(left);
  right = cleanText(right);

  const available = width - right.length;

  if (available <= 1) {
    return right.substring(0, width);
  }

  if (left.length > available - 1) {
    left = left.substring(0, Math.max(0, available - 1)) + ".";
  }

  return left + " ".repeat(Math.max(1, available - left.length)) + right;
};

// Wraps a long line of text (e.g. the shop address) into multiple
// receipt-width lines instead of getting cut off.
const wrapText = (value = "", width = 32) => {
  const words = cleanText(value).split(" ").filter(Boolean);
  const lines = [];
  let current = "";

  words.forEach((word) => {
    const candidate = current ? `${current} ${word}` : word;

    if (candidate.length > width) {
      if (current) {
        lines.push(current);
      }
      current = word;
    } else {
      current = candidate;
    }
  });

  if (current) {
    lines.push(current);
  }

  return lines;
};

// ============================================================
// PRICE FORMAT
// ============================================================

const formatAmount = (amount) => {
  const number = Number(amount || 0);

  return number.toFixed(2);
};

// ============================================================
// LOGO (IMAGE -> ESC/POS RASTER BITMAP)
// ============================================================

const loadImageElement = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Logo image load failed."));
    img.src = url;
  });
};

// Converts an image into an ESC/POS "GS v 0" raster bit image command.
// Returns null (instead of throwing) if the logo can't be loaded/converted,
// so the caller can gracefully fall back to the text header.
const imageToESCPOSRaster = async (imageUrl, targetWidthDots = 384) => {
  try {
    const img = await loadImageElement(imageUrl);

    const width = targetWidthDots;
    const scale = width / img.width;
    const height = Math.min(200, Math.round(img.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);

    const imageData = ctx.getImageData(0, 0, width, height).data;

    const bytesPerRow = Math.ceil(width / 8);
    const bitmap = new Uint8Array(bytesPerRow * height);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const r = imageData[idx];
        const g = imageData[idx + 1];
        const b = imageData[idx + 2];
        const alpha = imageData[idx + 3];

        const gray = r * 0.299 + g * 0.587 + b * 0.114;
        const isDark = alpha > 20 && gray < 180;

        if (isDark) {
          const byteIndex = y * bytesPerRow + Math.floor(x / 8);
          const bitIndex = 7 - (x % 8);
          bitmap[byteIndex] |= 1 << bitIndex;
        }
      }
    }

    const xL = bytesPerRow & 0xff;
    const xH = (bytesPerRow >> 8) & 0xff;
    const yL = height & 0xff;
    const yH = (height >> 8) & 0xff;

    let command =
      `${GS}v0` +
      String.fromCharCode(0) + // mode: normal
      String.fromCharCode(xL) +
      String.fromCharCode(xH) +
      String.fromCharCode(yL) +
      String.fromCharCode(yH);

    for (let i = 0; i < bitmap.length; i++) {
      command += String.fromCharCode(bitmap[i]);
    }

    return command;
  } catch (error) {
    console.error("Logo raster conversion failed:", error);
    return null;
  }
};

// ============================================================
// QR CODE (NATIVE ESC/POS "GS ( k" COMMANDS)
// ============================================================
// The QR code is rendered by the printer itself from the data we send,
// so no image conversion is needed and it stays crisp at any size.

const buildGSk = (cn, fn, payload = "") => {
  const payloadLength = payload.length + 2; // + cn byte + fn byte
  const pL = payloadLength & 0xff;
  const pH = (payloadLength >> 8) & 0xff;

  return (
    `${GS}(k` +
    String.fromCharCode(pL) +
    String.fromCharCode(pH) +
    String.fromCharCode(cn) +
    String.fromCharCode(fn) +
    payload
  );
};

// moduleSize: 1-16 (dot size of each QR square). errorCorrection:
// 48=L, 49=M, 50=Q, 51=H.
const buildQRCommand = (data, moduleSize = 6, errorCorrection = 49) => {
  let command = "";

  // Select QR Model 2
  command += buildGSk(0x31, 0x41, String.fromCharCode(50) + String.fromCharCode(0));

  // Set module size
  command += buildGSk(0x31, 0x43, String.fromCharCode(moduleSize));

  // Set error correction level
  command += buildGSk(0x31, 0x45, String.fromCharCode(errorCorrection));

  // Store the data to encode
  command += buildGSk(0x31, 0x50, String.fromCharCode(0x30) + data);

  // Print the stored QR code
  command += buildGSk(0x31, 0x51, String.fromCharCode(0x30));

  return command;
};

// Plain-text summary encoded into the QR — scanning it shows these
// details directly in any QR scanner / camera app.
const buildBillSummaryText = (bill) => {
  const grandTotal = Number(
    bill.finalAmount ??
      bill.grandTotal ??
      bill.subTotal ??
      bill.subtotal ??
      bill.totalAmount ??
      0
  );

  const lines = [
    `${SHOP.name} ${SHOP.subName}`,
    `Invoice: ${bill.invoiceNumber || bill._id || "-"}`,
    `Date: ${
      bill.createdAt
        ? new Date(bill.createdAt).toLocaleDateString("en-IN")
        : new Date().toLocaleDateString("en-IN")
    }`,
    `Customer: ${bill.customerName || "-"}`,
  ];

  if (bill.mobile) {
    lines.push(`Mobile: ${bill.mobile}`);
  }

  lines.push(`Amount: Rs.${formatAmount(grandTotal)}`);
  lines.push(`Payment: ${bill.paymentMode || bill.paymentMethod || "Cash"}`);
  lines.push(SHOP.phone);

  return cleanText(lines.join("\n"));
};

// ============================================================
// RAWBT RECEIPT GENERATOR
// ============================================================

const buildRawBTReceiptAsync = async (bill) => {
  const WIDTH = 32;

  let receipt = "";

  // ----------------------------------------------------------
  // INIT
  // ----------------------------------------------------------

  receipt += ESC_POS.INIT;
  receipt += ESC_POS.ALIGN_CENTER;

  // ----------------------------------------------------------
  // SHOP HEADER (logo if configured, else bold text header)
  // ----------------------------------------------------------

  let logoCommand = null;

  if (SHOP.logoUrl) {
    logoCommand = await imageToESCPOSRaster(
      SHOP.logoUrl,
      SHOP.printerWidthDots
    );
  }

  if (logoCommand) {
    receipt += logoCommand;
    receipt += "\n";
  } else {
    receipt += ESC_POS.BOLD_ON;
    receipt += ESC_POS.DOUBLE_ON;
    receipt += `${cleanText(SHOP.name)}\n`;
    receipt += ESC_POS.NORMAL;
  }

  receipt += ESC_POS.BOLD_ON;
  receipt += `${cleanText(SHOP.subName)}\n`;
  receipt += ESC_POS.BOLD_OFF;
  receipt += `${cleanText(SHOP.tagline)}\n`;

  // Address (wrapped to receipt width)
  wrapText(SHOP.address, WIDTH).forEach((line) => {
    receipt += `${line}\n`;
  });

  // Phone
  receipt += `No - ${cleanText(SHOP.phone).replace(/\s+/g, "")}\n`;

  receipt += "\n";

  // ----------------------------------------------------------
  // TITLE
  // ----------------------------------------------------------

  receipt += ESC_POS.ALIGN_CENTER;
  receipt += ESC_POS.BOLD_ON;
  receipt += "TAX INVOICE\n";
  receipt += ESC_POS.BOLD_OFF;
  receipt += "-".repeat(WIDTH) + "\n";

  // ----------------------------------------------------------
  // BILL INFORMATION
  // ----------------------------------------------------------

  receipt += ESC_POS.ALIGN_LEFT;

  receipt += twoColumn(
    "Invoice",
    bill.invoiceNumber || bill._id || "-",
    WIDTH
  );
  receipt += "\n";

  receipt += twoColumn(
    "Date",
    bill.createdAt
      ? new Date(bill.createdAt).toLocaleDateString("en-IN")
      : new Date().toLocaleDateString("en-IN"),
    WIDTH
  );
  receipt += "\n";

  receipt += twoColumn(
    "Time",
    bill.createdAt
      ? new Date(bill.createdAt).toLocaleTimeString("en-IN")
      : new Date().toLocaleTimeString("en-IN"),
    WIDTH
  );
  receipt += "\n";

  receipt += "-".repeat(WIDTH) + "\n";

  // ----------------------------------------------------------
  // CUSTOMER
  // ----------------------------------------------------------

  receipt += ESC_POS.BOLD_ON;
  receipt += "CUSTOMER\n";
  receipt += ESC_POS.BOLD_OFF;

  receipt += `Name : ${cleanText(bill.customerName || "-")}\n`;

  if (bill.mobile) {
    receipt += `Mobile: ${cleanText(bill.mobile)}\n`;
  }

  receipt += "-".repeat(WIDTH) + "\n";

  // ----------------------------------------------------------
  // ITEMS HEADER
  // ----------------------------------------------------------

  receipt += ESC_POS.BOLD_ON;
  receipt += "ITEM\n";
  receipt += ESC_POS.BOLD_OFF;
  receipt += "-".repeat(WIDTH) + "\n";

  // ----------------------------------------------------------
  // ITEMS
  // ----------------------------------------------------------

  const items = Array.isArray(bill.items) ? bill.items : [];

  items.forEach((item) => {
    const productName = cleanText(item.productName || item.name || "Item");
    const quantity = Number(item.quantity || item.qty || 1);
    const price = Number(item.price || item.unitPrice || 0);
    const total = Number(item.total ?? quantity * price);

    receipt += `${productName}\n`;

    receipt += twoColumn(
      `${quantity} x ${formatAmount(price)}`,
      formatAmount(total),
      WIDTH
    );
    receipt += "\n";
  });

  receipt += "-".repeat(WIDTH) + "\n";

  // ----------------------------------------------------------
  // TOTALS
  // ----------------------------------------------------------

  const subtotal = Number(
    bill.subTotal ?? bill.subtotal ?? bill.totalAmount ?? 0
  );

  const discount = Number(bill.discountAmount || 0);

  const grandTotal = Number(
    bill.finalAmount ?? bill.grandTotal ?? subtotal - discount
  );

  receipt += twoColumn("Subtotal", `Rs.${formatAmount(subtotal)}`, WIDTH);
  receipt += "\n";

  if (discount > 0) {
    receipt += twoColumn(
      "Discount",
      `-Rs.${formatAmount(discount)}`,
      WIDTH
    );
    receipt += "\n";
  }

  receipt += "-".repeat(WIDTH) + "\n";

  receipt += ESC_POS.BOLD_ON;
  receipt += twoColumn("GRAND TOTAL", `Rs.${formatAmount(grandTotal)}`, WIDTH);
  receipt += "\n";
  receipt += ESC_POS.BOLD_OFF;

  // ----------------------------------------------------------
  // PAYMENT
  // ----------------------------------------------------------

  receipt += "-".repeat(WIDTH) + "\n";

  receipt += twoColumn(
    "Payment",
    cleanText(bill.paymentMode || bill.paymentMethod || "Cash"),
    WIDTH
  );
  receipt += "\n";

  // ----------------------------------------------------------
  // QR CODE (scan to see bill details)
  // ----------------------------------------------------------

  receipt += "\n";
  receipt += ESC_POS.ALIGN_CENTER;
  receipt += ESC_POS.BOLD_ON;
  receipt += "SCAN FOR BILL DETAILS\n";
  receipt += ESC_POS.BOLD_OFF;
  receipt += "\n";
  receipt += buildQRCommand(buildBillSummaryText(bill), 6, 49);
  receipt += "\n";

  // ----------------------------------------------------------
  // FOOTER
  // ----------------------------------------------------------

  receipt += "\n";
  receipt += ESC_POS.ALIGN_CENTER;
  receipt += "Thank You!\n";
  receipt += "Visit Again\n";

  receipt += "\n";
  receipt += "\n";
  receipt += "\n";

  // ----------------------------------------------------------
  // CUT
  // ----------------------------------------------------------

  receipt += ESC_POS.CUT;

  return receipt;
};

// ============================================================
// RAWBT BASE64
// ============================================================

const stringToBase64 = (value) => {
  try {
    return btoa(value);
  } catch (error) {
    console.error("Base64 conversion error:", error);

    throw new Error("RawBT data encoding failed.");
  }
};

// ============================================================
// RAWBT PRINT
// ============================================================

const printWithRawBT = async (bill) => {
  try {
    if (!isAndroidDevice()) {
      throw new Error("RawBT printing is available only on Android.");
    }

    if (!bill) {
      throw new Error("Bill data not available.");
    }

    const rawData = await buildRawBTReceiptAsync(bill);

    if (!rawData) {
      throw new Error("Receipt data could not be generated.");
    }

    // --------------------------------------------------------
    // Convert ESC/POS data to Base64
    // --------------------------------------------------------

    const base64Data = stringToBase64(rawData);

    // --------------------------------------------------------
    // RawBT URI
    // --------------------------------------------------------

    const rawbtUrl = `rawbt:base64,${base64Data}`;

    console.log("=================================");
    console.log("RawBT print request started");
    console.log("Invoice:", bill.invoiceNumber || bill._id);
    console.log("Android:", isAndroidDevice());
    console.log("=================================");

    // --------------------------------------------------------
    // Open RawBT
    // --------------------------------------------------------

    window.location.href = rawbtUrl;

    return true;
  } catch (error) {
    console.error("RawBT print error:", error);

    throw error;
  }
};

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function BillingTable({
  bills = [],
  pagination,
  setPage,
  onViewDetails,
  search,
  statusFilter,
}) {
  // ==========================================================
  // STATE
  // ==========================================================

  const [downloadingId, setDownloadingId] = useState(null);
  const [showPrinterModal, setShowPrinterModal] = useState(false);
  const [printers, setPrinters] = useState([]);
  const [selectedPrinter, setSelectedPrinter] = useState("");
  const [connectedPrinter, setConnectedPrinter] = useState("");
  const [qzConnected, setQzConnected] = useState(false);
  const [printerLoading, setPrinterLoading] = useState(false);
  const [printerConnecting, setPrinterConnecting] = useState(false);
  const [printingId, setPrintingId] = useState(null);
  const [testPrinting, setTestPrinting] = useState(false);
  const [printerError, setPrinterError] = useState("");
  const [toast, setToast] = useState(null);

  const isConnectingRef = useRef(false);
  const connectPromiseRef = useRef(null);

  // ==========================================================
  // DEVICE
  // ==========================================================

  const isAndroid = isAndroidDevice();

  // ==========================================================
  // TOAST
  // ==========================================================

  const showToast = (message, type = "success") => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // ==========================================================
  // PRICE
  // ==========================================================

  const displayPrice = (amount) => {
    return `₹${Number(amount || 0).toFixed(2)}`;
  };

  // ==========================================================
  // STATUS
  // ==========================================================

  const getStatusStyle = (status) => {
    const value = String(status || "").toLowerCase();

    if (value === "paid" || value === "success" || value === "completed") {
      return { background: "#dcfce7", color: "#166534" };
    }

    if (value === "pending") {
      return { background: "#fef3c7", color: "#92400e" };
    }

    if (value === "cancelled" || value === "failed") {
      return { background: "#fee2e2", color: "#991b1b" };
    }

    return { background: "#f3f4f6", color: "#374151" };
  };

  // ==========================================================
  // FILE NAME
  // ==========================================================

  const sanitizeFileName = (name = "") => {
    return String(name)
      .replace(/[<>:"/\\|?*]/g, "_")
      .trim();
  };

  // ==========================================================
  // QZ CONNECT
  // ==========================================================

  const connectQZTray = async () => {
    if (isAndroid) {
      console.log("Android detected - QZ Tray not required.");
      return false;
    }

    if (qz.websocket.isActive()) {
      setQzConnected(true);
      return true;
    }

    if (isConnectingRef.current) {
      return connectPromiseRef.current;
    }

    isConnectingRef.current = true;

    connectPromiseRef.current = (async () => {
      try {
        setPrinterError("");

        await qz.websocket.connect();

        setQzConnected(true);
        console.log("QZ connected");

        return true;
      } catch (error) {
        console.error("QZ connection error:", error);

        setQzConnected(false);
        setPrinterError(
          "QZ Tray connect nahi hua. Please QZ Tray install/open karein."
        );

        return false;
      } finally {
        isConnectingRef.current = false;
        connectPromiseRef.current = null;
      }
    })();

    return connectPromiseRef.current;
  };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    // --------------------------------------------------------
    // Android
    // --------------------------------------------------------

    if (isAndroid) {
      console.log("=================================");
      console.log("ANDROID DEVICE DETECTED");
      console.log("RawBT mode enabled");
      console.log("User Agent:", navigator.userAgent);
      console.log("Platform:", navigator.platform);
      console.log("Touch Points:", navigator.maxTouchPoints);
      console.log("=================================");

      return;
    }

    // --------------------------------------------------------
    // Desktop
    // --------------------------------------------------------

    connectQZTray();

    const savedPrinter = localStorage.getItem(
      "ganguram_selected_printer"
    );

    if (savedPrinter) {
      setSelectedPrinter(savedPrinter);
    }
  }, []);

  // ==========================================================
  // QZ PRINTER SEARCH
  // ==========================================================

  const searchPrinters = async () => {
    if (isAndroid) {
      return [];
    }

    try {
      setPrinterLoading(true);
      setPrinterError("");

      const connected = await connectQZTray();

      if (!connected) {
        return [];
      }

      const printerList = await qz.printers.find();

      console.log("Available printers:", printerList);

      setPrinters(printerList || []);

      return printerList || [];
    } catch (error) {
      console.error("Printer search error:", error);

      setPrinterError(
        error?.message || "Printer list load nahi ho saka."
      );

      return [];
    } finally {
      setPrinterLoading(false);
    }
  };

  // ==========================================================
  // OPEN PRINTER MODAL
  // ==========================================================

  const openPrinterModal = async () => {
    if (isAndroid) {
      showToast("Android par RawBT + USB OTG use hoga.", "success");
      return;
    }

    setShowPrinterModal(true);

    await searchPrinters();
  };

  // ==========================================================
  // SELECT QZ PRINTER
  // ==========================================================

  const handleConnectPrinter = async (printerName) => {
    if (!printerName) {
      return;
    }

    try {
      setPrinterConnecting(true);
      setPrinterError("");

      const connected = await connectQZTray();

      if (!connected) {
        throw new Error("QZ Tray connected nahi hai.");
      }

      const printerExists = printers.includes(printerName);

      if (!printerExists) {
        const available = await qz.printers.find();

        if (!available.includes(printerName)) {
          throw new Error("Selected printer available nahi hai.");
        }
      }

      setSelectedPrinter(printerName);
      setConnectedPrinter(printerName);

      localStorage.setItem("ganguram_selected_printer", printerName);

      showToast(`Printer connected: ${printerName}`);

      setShowPrinterModal(false);
    } catch (error) {
      console.error("Printer connection error:", error);

      setPrinterError(error?.message || "Printer connect nahi hua.");

      showToast("Printer connect nahi hua.", "error");
    } finally {
      setPrinterConnecting(false);
    }
  };

  // ==========================================================
  // DISCONNECT QZ
  // ==========================================================

  const disconnectQZ = async () => {
    try {
      if (qz.websocket.isActive()) {
        await qz.websocket.disconnect();
      }
    } catch (error) {
      console.error("QZ disconnect error:", error);
    } finally {
      setQzConnected(false);
      setConnectedPrinter("");

      showToast("Printer disconnected.");
    }
  };

  // ==========================================================
  // DOWNLOAD PDF
  // ==========================================================

  const handleDownloadPdf = async (bill) => {
    if (!bill?.invoiceUrl) {
      showToast("Invoice PDF URL available nahi hai.", "error");
      return;
    }

    try {
      setDownloadingId(bill._id);

      const response = await fetch(bill.invoiceUrl);

      if (!response.ok) {
        throw new Error("PDF download failed.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = sanitizeFileName(
        `${bill.invoiceNumber || "invoice"}.pdf`
      );

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

      showToast("Invoice downloaded successfully.");
    } catch (error) {
      console.error("Download error:", error);

      showToast("Invoice download failed.", "error");
    } finally {
      setDownloadingId(null);
    }
  };

  // ==========================================================
  // FETCH PDF BASE64
  // ==========================================================

  const fetchPdfAsBase64 = async (pdfUrl) => {
    const response = await fetch(pdfUrl);

    if (!response.ok) {
      throw new Error("Invoice PDF fetch failed.");
    }

    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    let binary = "";
    const chunkSize = 0x8000;

    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize);
      binary += String.fromCharCode(...chunk);
    }

    return btoa(binary);
  };

  // ==========================================================
  // DESKTOP QZ PDF PRINT
  // ==========================================================

  const handleDirectPrint = async (bill) => {
    if (isAndroid) {
      return;
    }

    if (!bill?.invoiceUrl) {
      showToast("Invoice PDF available nahi hai.", "error");
      return;
    }

    try {
      setPrintingId(bill._id);
      setPrinterError("");

      const connected = await connectQZTray();

      if (!connected) {
        throw new Error("QZ Tray connected nahi hai.");
      }

      let printerName = connectedPrinter || selectedPrinter;

      if (!printerName) {
        const saved = localStorage.getItem("ganguram_selected_printer");

        if (saved) {
          printerName = saved;
        }
      }

      if (!printerName) {
        setShowPrinterModal(true);

        await searchPrinters();

        showToast("Please printer select karein.", "error");

        return;
      }

      // ----------------------------------------------------
      // Fetch PDF
      // ----------------------------------------------------

      const pdfBase64 = await fetchPdfAsBase64(bill.invoiceUrl);

      // ----------------------------------------------------
      // QZ Configuration
      // ----------------------------------------------------

      const config = qz.configs.create(printerName, { copies: 1 });

      // ----------------------------------------------------
      // PDF Print
      // ----------------------------------------------------

      const printData = [
        {
          type: "pixel",
          format: "pdf",
          flavor: "base64",
          data: pdfBase64,
        },
      ];

      await qz.print(config, printData);

      setConnectedPrinter(printerName);

      showToast(`Invoice sent to ${printerName}`);
    } catch (error) {
      console.error("QZ print error:", error);

      showToast(error?.message || "Printing failed.", "error");
    } finally {
      setPrintingId(null);
    }
  };

  // ==========================================================
  // ANDROID RAWBT PRINT
  // ==========================================================

  const handleRawBTPrint = async (bill) => {
    try {
      setPrintingId(bill._id);

      await printWithRawBT(bill);

      showToast("RawBT open ho raha hai...");
    } catch (error) {
      console.error("RawBT error:", error);

      showToast("RawBT printing start nahi hua.", "error");
    } finally {
      setTimeout(() => {
        setPrintingId(null);
      }, 1000);
    }
  };

  // ==========================================================
  // MAIN PRINT FUNCTION
  // ==========================================================

  const handlePrint = async (bill) => {
    if (isAndroid) {
      await handleRawBTPrint(bill);
      return;
    }

    await handleDirectPrint(bill);
  };

  // ==========================================================
  // DESKTOP TEST PRINT
  // ==========================================================

  const handleQZTestPrint = async () => {
    if (isAndroid) {
      return;
    }

    try {
      setTestPrinting(true);

      const connected = await connectQZTray();

      if (!connected) {
        throw new Error("QZ Tray connected nahi hai.");
      }

      const printerName = connectedPrinter || selectedPrinter;

      if (!printerName) {
        setShowPrinterModal(true);

        await searchPrinters();

        throw new Error("Please printer select karein.");
      }

      const config = qz.configs.create(printerName, { copies: 1 });

      const data = [
        ESC_POS.INIT,
        ESC_POS.ALIGN_CENTER,
        ESC_POS.BOLD_ON,
        ESC_POS.DOUBLE_ON,
        `${SHOP.name}\n`,
        ESC_POS.NORMAL,
        ESC_POS.BOLD_ON,
        `${SHOP.subName}\n`,
        ESC_POS.BOLD_OFF,
        `${SHOP.phone}\n`,
        "\n",
        ESC_POS.BOLD_ON,
        "TEST PRINT\n",
        ESC_POS.BOLD_OFF,
        "\n",
        "Printer connection successful!\n",
        "\n",
        ESC_POS.CUT,
      ];

      await qz.print(config, data);

      showToast("Test print sent successfully.");
    } catch (error) {
      console.error("Test print error:", error);

      showToast(error?.message || "Test print failed.", "error");
    } finally {
      setTestPrinting(false);
    }
  };

  // ==========================================================
  // ANDROID RAWBT TEST PRINT
  // ==========================================================

  const handleRawBTTestPrint = async () => {
    try {
      setTestPrinting(true);

      const testBill = {
        _id: "TEST",
        invoiceNumber: "TEST-001",
        customerName: "Test Customer",
        mobile: "9999999999",
        items: [
          {
            productName: "Test Item",
            quantity: 1,
            price: 100,
            total: 100,
          },
        ],
        subTotal: 100,
        discountAmount: 0,
        finalAmount: 100,
        paymentMode: "Cash",
        createdAt: new Date().toISOString(),
      };

      await printWithRawBT(testBill);

      showToast("RawBT test print start ho gaya.");
    } catch (error) {
      console.error("RawBT test error:", error);

      showToast("RawBT test print failed.", "error");
    } finally {
      setTimeout(() => {
        setTestPrinting(false);
      }, 1000);
    }
  };

  // ==========================================================
  // EMPTY DATA
  // ==========================================================

  if (!bills || bills.length === 0) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
          background: "#fff",
          borderRadius: "12px",
        }}
      >
        <ReceiptText size={40} style={{ margin: "0 auto 10px", opacity: 0.5 }} />
        <h3>No bills found</h3>
        <p>No invoice records available.</p>
      </div>
    );
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div style={{ width: "100%" }}>
      {/* ====================================================
          TOAST
      ===================================================== */}

      {toast && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 9999,
            padding: "12px 18px",
            borderRadius: "8px",
            background: toast.type === "error" ? "#dc2626" : "#16a34a",
            color: "#fff",
            boxShadow: "0 5px 20px rgba(0,0,0,0.2)",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          {toast.message}
        </div>
      )}

      {/* ====================================================
          PRINTER BAR
      ===================================================== */}

      <div
        style={{
          marginBottom: "16px",
          padding: "12px 16px",
          background: "#fff",
          borderRadius: "10px",
          border: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        {/* ==================================================
            ANDROID
        ================================================== */}

        {isAndroid ? (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "8px",
                  background: "#dcfce7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Usb size={20} color="#16a34a" />
              </div>

              <div>
                <div style={{ fontWeight: 600, fontSize: "14px" }}>
                  RawBT + USB
                </div>
                <div style={{ fontSize: "12px", color: "#6b7280" }}>
                  Android → USB OTG → RP3230ABW
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRawBTTestPrint}
              disabled={testPrinting}
              style={{
                border: "none",
                background: "#111827",
                color: "#fff",
                padding: "9px 14px",
                borderRadius: "7px",
                cursor: testPrinting ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "7px",
              }}
            >
              <Printer size={16} />
              {testPrinting ? "Printing..." : "Test Print"}
            </button>
          </>
        ) : (
          /* =================================================
             DESKTOP QZ
          ================================================= */

          <>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "8px",
                  background: qzConnected ? "#dcfce7" : "#fee2e2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {qzConnected ? (
                  <Wifi size={20} color="#16a34a" />
                ) : (
                  <WifiOff size={20} color="#dc2626" />
                )}
              </div>

              <div>
                <div style={{ fontWeight: 600, fontSize: "14px" }}>
                  {qzConnected ? "QZ Tray Connected" : "QZ Tray Disconnected"}
                </div>
                <div style={{ fontSize: "12px", color: "#6b7280" }}>
                  {connectedPrinter || selectedPrinter || "No printer selected"}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={openPrinterModal}
                style={{
                  border: "1px solid #d1d5db",
                  background: "#fff",
                  padding: "9px 14px",
                  borderRadius: "7px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                }}
              >
                <Printer size={16} />
                Select Printer
              </button>

              <button
                type="button"
                onClick={handleQZTestPrint}
                disabled={testPrinting}
                style={{
                  border: "none",
                  background: "#111827",
                  color: "#fff",
                  padding: "9px 14px",
                  borderRadius: "7px",
                  cursor: testPrinting ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                }}
              >
                <Printer size={16} />
                {testPrinting ? "Printing..." : "Test Print"}
              </button>

              {qzConnected && (
                <button
                  type="button"
                  onClick={disconnectQZ}
                  style={{
                    border: "1px solid #fecaca",
                    background: "#fff",
                    color: "#dc2626",
                    padding: "9px 14px",
                    borderRadius: "7px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                  }}
                >
                  <WifiOff size={16} />
                  Disconnect
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* ====================================================
          ERROR
      ===================================================== */}

      {printerError && (
        <div
          style={{
            marginBottom: "16px",
            padding: "10px 14px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#991b1b",
            borderRadius: "8px",
            fontSize: "13px",
          }}
        >
          {printerError}
        </div>
      )}

      {/* ====================================================
          DESKTOP TABLE
      ===================================================== */}

      <div
        className="billing-desktop-table"
        style={{
          background: "#fff",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          overflow: "hidden",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  background: "#f9fafb",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "13px" }}>
                  Invoice
                </th>
                <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "13px" }}>
                  Customer
                </th>
                <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "13px" }}>
                  Date
                </th>
                <th style={{ padding: "14px 16px", textAlign: "right", fontSize: "13px" }}>
                  Amount
                </th>
                <th style={{ padding: "14px 16px", textAlign: "center", fontSize: "13px" }}>
                  Status
                </th>
                <th style={{ padding: "14px 16px", textAlign: "center", fontSize: "13px" }}>
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {bills.map((bill) => {
                const statusStyle = getStatusStyle(bill.status);

                return (
                  <tr key={bill._id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    {/* Invoice */}
                    <td style={{ padding: "14px 16px", fontWeight: 600 }}>
                      {bill.invoiceNumber || bill._id || "-"}
                    </td>

                    {/* Customer */}
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontWeight: 500 }}>
                        {bill.customerName || "-"}
                      </div>
                      {bill.mobile && (
                        <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "3px" }}>
                          {bill.mobile}
                        </div>
                      )}
                    </td>

                    {/* Date */}
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Calendar size={15} />
                        {bill.createdAt
                          ? new Date(bill.createdAt).toLocaleDateString("en-IN")
                          : "-"}
                      </div>
                    </td>

                    {/* Amount */}
                    <td style={{ padding: "14px 16px", textAlign: "right", fontWeight: 600 }}>
                      {displayPrice(bill.finalAmount ?? bill.grandTotal ?? 0)}
                    </td>

                    {/* Status */}
                    <td style={{ padding: "14px 16px", textAlign: "center" }}>
                      <span
                        style={{
                          ...statusStyle,
                          padding: "5px 9px",
                          borderRadius: "999px",
                          fontSize: "12px",
                          fontWeight: 600,
                        }}
                      >
                        {bill.status || "Paid"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", justifyContent: "center", gap: "7px" }}>
                        {/* View */}
                        <button
                          type="button"
                          title="View"
                          onClick={() => onViewDetails?.(bill)}
                          style={{
                            border: "1px solid #d1d5db",
                            background: "#fff",
                            width: "34px",
                            height: "34px",
                            borderRadius: "7px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Eye size={16} />
                        </button>

                        {/* Download */}
                        <button
                          type="button"
                          title="Download PDF"
                          onClick={() => handleDownloadPdf(bill)}
                          disabled={downloadingId === bill._id}
                          style={{
                            border: "1px solid #d1d5db",
                            background: "#fff",
                            width: "34px",
                            height: "34px",
                            borderRadius: "7px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {downloadingId === bill._id ? (
                            <RefreshCw size={16} className="spin" />
                          ) : (
                            <Download size={16} />
                          )}
                        </button>

                        {/* Print */}
                        <button
                          type="button"
                          title={isAndroid ? "Print using RawBT" : "Print using QZ Tray"}
                          onClick={() => handlePrint(bill)}
                          disabled={printingId === bill._id}
                          style={{
                            border: "none",
                            background: "#111827",
                            color: "#fff",
                            width: "34px",
                            height: "34px",
                            borderRadius: "7px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {printingId === bill._id ? (
                            <RefreshCw size={16} className="spin" />
                          ) : (
                            <Printer size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ====================================================
          MOBILE CARDS
      ===================================================== */}

      <div className="billing-mobile-cards" style={{ display: "none" }}>
        {bills.map((bill) => {
          const statusStyle = getStatusStyle(bill.status);

          return (
            <div
              key={bill._id}
              style={{
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                padding: "14px",
                marginBottom: "12px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
                <div>
                  <div style={{ fontWeight: 700 }}>
                    {bill.invoiceNumber || bill._id}
                  </div>
                  <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "4px" }}>
                    {bill.customerName || "-"}
                  </div>
                </div>

                <span
                  style={{
                    ...statusStyle,
                    padding: "5px 9px",
                    borderRadius: "999px",
                    fontSize: "11px",
                    fontWeight: 600,
                    height: "fit-content",
                  }}
                >
                  {bill.status || "Paid"}
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px" }}>
                <span style={{ fontSize: "13px", color: "#6b7280" }}>
                  {bill.createdAt
                    ? new Date(bill.createdAt).toLocaleDateString("en-IN")
                    : "-"}
                </span>
                <strong>{displayPrice(bill.finalAmount ?? bill.grandTotal ?? 0)}</strong>
              </div>

              <div style={{ display: "flex", gap: "7px", marginTop: "14px" }}>
                {/* View */}
                <button
                  type="button"
                  onClick={() => onViewDetails?.(bill)}
                  style={{
                    flex: 1,
                    border: "1px solid #d1d5db",
                    background: "#fff",
                    padding: "9px",
                    borderRadius: "7px",
                    cursor: "pointer",
                  }}
                >
                  <Eye size={15} style={{ verticalAlign: "middle", marginRight: "4px" }} />
                  View
                </button>

                {/* PDF */}
                <button
                  type="button"
                  onClick={() => handleDownloadPdf(bill)}
                  style={{
                    flex: 1,
                    border: "1px solid #d1d5db",
                    background: "#fff",
                    padding: "9px",
                    borderRadius: "7px",
                    cursor: "pointer",
                  }}
                >
                  <Download size={15} style={{ verticalAlign: "middle", marginRight: "4px" }} />
                  PDF
                </button>

                {/* Print */}
                <button
                  type="button"
                  onClick={() => handlePrint(bill)}
                  disabled={printingId === bill._id}
                  style={{
                    flex: 1,
                    border: "none",
                    background: "#111827",
                    color: "#fff",
                    padding: "9px",
                    borderRadius: "7px",
                    cursor: "pointer",
                  }}
                >
                  {printingId === bill._id ? (
                    <RefreshCw
                      size={15}
                      className="spin"
                      style={{ verticalAlign: "middle", marginRight: "4px" }}
                    />
                  ) : (
                    <Printer size={15} style={{ verticalAlign: "middle", marginRight: "4px" }} />
                  )}
                  Print
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ====================================================
          PAGINATION
      ===================================================== */}

      {pagination && (
        <div
          style={{
            marginTop: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ fontSize: "13px", color: "#6b7280" }}>
            Page {pagination.page || 1} of {pagination.totalPages || 1}
          </div>

          <div style={{ display: "flex", gap: "7px" }}>
            {/* Previous */}
            <button
              type="button"
              disabled={!pagination.hasPrevPage}
              onClick={() => setPage?.(Math.max(1, (pagination.page || 1) - 1))}
              style={{
                padding: "8px 13px",
                border: "1px solid #d1d5db",
                background: "#fff",
                borderRadius: "7px",
                cursor: pagination.hasPrevPage ? "pointer" : "not-allowed",
              }}
            >
              Previous
            </button>

            {/* Next */}
            <button
              type="button"
              disabled={!pagination.hasNextPage}
              onClick={() => setPage?.((pagination.page || 1) + 1)}
              style={{
                padding: "8px 13px",
                border: "1px solid #d1d5db",
                background: "#fff",
                borderRadius: "7px",
                cursor: pagination.hasNextPage ? "pointer" : "not-allowed",
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* ====================================================
          DESKTOP PRINTER MODAL
      ===================================================== */}

      {showPrinterModal && !isAndroid && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9998,
            padding: "20px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "500px",
              background: "#fff",
              borderRadius: "14px",
              padding: "20px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "18px",
              }}
            >
              <div>
                <h3 style={{ margin: 0 }}>Select Printer</h3>
                <p style={{ margin: "5px 0 0", fontSize: "13px", color: "#6b7280" }}>
                  Select your thermal printer
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowPrinterModal(false)}
                style={{ border: "none", background: "transparent", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Refresh */}
            <button
              type="button"
              onClick={searchPrinters}
              disabled={printerLoading}
              style={{
                width: "100%",
                border: "1px solid #d1d5db",
                background: "#fff",
                padding: "10px",
                borderRadius: "8px",
                marginBottom: "12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <RefreshCw size={16} className={printerLoading ? "spin" : ""} />
              {printerLoading ? "Searching..." : "Refresh Printers"}
            </button>

            {/* Printer list */}
            {printers.length === 0 ? (
              <div
                style={{
                  padding: "25px",
                  textAlign: "center",
                  background: "#f9fafb",
                  borderRadius: "8px",
                  color: "#6b7280",
                  fontSize: "13px",
                }}
              >
                No printers found.
                <br />
                Make sure printer is installed on this computer.
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  maxHeight: "300px",
                  overflowY: "auto",
                }}
              >
                {printers.map((printer) => (
                  <button
                    key={printer}
                    type="button"
                    onClick={() => handleConnectPrinter(printer)}
                    disabled={printerConnecting}
                    style={{
                      textAlign: "left",
                      padding: "12px",
                      border:
                        selectedPrinter === printer
                          ? "2px solid #111827"
                          : "1px solid #e5e7eb",
                      background: selectedPrinter === printer ? "#f9fafb" : "#fff",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <Printer size={18} />
                      <span style={{ fontWeight: 500 }}>{printer}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ====================================================
          RESPONSIVE CSS
      ===================================================== */}

      <style>
        {`
          @media (max-width: 768px) {
            .billing-desktop-table {
              display: none !important;
            }
            .billing-mobile-cards {
              display: block !important;
            }
          }

          .spin {
            animation: billingSpin 1s linear infinite;
          }

          @keyframes billingSpin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}