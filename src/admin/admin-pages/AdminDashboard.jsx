import { useState } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  Layers,
  ChefHat,
  ArrowUpRight,
  IndianRupee,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  CalendarDays,
} from "lucide-react";
import { motion } from "framer-motion";

// ---------------------------------------------------------------------------
// DUMMY DATA (no Redux for now) — swap these for real API/Redux calls later.
// The shape below matches the stats payload you shared, so wiring in the
// real API later is just a matter of replacing this block with a fetch/dispatch.
// ---------------------------------------------------------------------------

const DUMMY_ADMIN = { name: "Admin User", role: "super_admin" };

const DUMMY_STATS = {
  totalSales: 23626,
  todaySales: 1216,
  totalCategory: 7,
  totalProduct: 8,
  todayOrders: 2,
  todayInquiries: 0,
  weeklySales: [
    { day: "Sun", sales: 0 },
    { day: "Mon", sales: 0 },
    { day: "Tue", sales: 0 },
    { day: "Wed", sales: 7550 },
    { day: "Thu", sales: 5300 },
    { day: "Fri", sales: 9560 },
    { day: "Sat", sales: 1216 },
  ],
  monthlySales: [
    { month: "Jan", sales: 0 },
    { month: "Feb", sales: 0 },
    { month: "Mar", sales: 0 },
    { month: "Apr", sales: 0 },
    { month: "May", sales: 0 },
    { month: "Jun", sales: 0 },
    { month: "Jul", sales: 22410 },
    { month: "Aug", sales: 1216 },
    { month: "Sep", sales: 0 },
    { month: "Oct", sales: 0 },
    { month: "Nov", sales: 0 },
    { month: "Dec", sales: 0 },
  ],
};

const DUMMY_ORDERS = [
  { id: "ORD-1001", customerName: "Rajesh Kumar", amount: 1480, itemsCount: 3, status: "Processing", date: "2026-07-28" },
  { id: "ORD-1002", customerName: "Priya Sharma", amount: 920, itemsCount: 2, status: "Completed", date: "2026-07-27" },
  { id: "ORD-1003", customerName: "Amit Das", amount: 450, itemsCount: 1, status: "Pending", date: "2026-07-27" },
  { id: "ORD-1004", customerName: "Sneha Sen", amount: 2350, itemsCount: 5, status: "Completed", date: "2026-07-26" },
  { id: "ORD-1005", customerName: "Rahul Verma", amount: 890, itemsCount: 2, status: "Pending", date: "2026-07-25" },
];

const DUMMY_INQUIRIES = [
  {
    _id: "inq1",
    name: "Sunita Patra",
    email: "sunita.patra@example.com",
    phone: "9876543210",
    reason: "Need 50 boxes of Chhena Poda for a wedding reception next month.",
    status: "Pending",
    createdAt: "2026-07-30T10:00:00.000Z",
    isDeleted: false,
  },
  {
    _id: "inq2",
    name: "Manoj Mishra",
    email: "manoj.mishra@example.com",
    phone: "9123456780",
    reason: "Do you offer bulk catering discounts for corporate orders?",
    status: "Resolved",
    createdAt: "2026-07-29T14:30:00.000Z",
    isDeleted: false,
  },
  {
    _id: "inq3",
    name: "Ipsita Rout",
    email: "ipsita.rout@example.com",
    phone: "9988776655",
    reason: "Rasabali packaging leaked during delivery, requesting replacement.",
    status: "Pending",
    createdAt: "2026-07-28T09:15:00.000Z",
    isDeleted: false,
  },
];

const currency = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const AdminDashboard = () => {
  const adminName = DUMMY_ADMIN.name;
  const adminRole = DUMMY_ADMIN.role === "super_admin" ? "Super Admin" : "Admin";

  const [stats] = useState(DUMMY_STATS);
  const [inquiries] = useState(DUMMY_INQUIRIES);
  const [orders, setOrders] = useState(DUMMY_ORDERS);

  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
  };

  const pendingOrders = orders.filter((o) => o.status === "Pending" || o.status === "Processing").length;

  // ---- Chart data (weekly / monthly toggle) ----
  const [chartView, setChartView] = useState("weekly");
  const chartData = chartView === "weekly" ? stats.weeklySales : stats.monthlySales;
  const labelKey = chartView === "weekly" ? "day" : "month";
  const maxVal = Math.max(1, ...(chartData || []).map((d) => d.sales || 0));

  const points = (chartData || []).map((d, i) => {
    const x = chartData.length > 1 ? (i / (chartData.length - 1)) * 500 : 250;
    const y = 150 - (d.sales / maxVal) * 130;
    return { x, y };
  });
  const linePath = points.length
    ? "M" + points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" L ")
    : "";
  const areaPath = points.length ? `${linePath} L500,160 L0,160 Z` : "";

  const statCards = [
    {
      label: "Total Sales",
      value: currency(stats.totalSales),
      icon: IndianRupee,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      to: "/admin/orders",
    },
    {
      label: "Today's Sales",
      value: currency(stats.todaySales),
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      to: "/admin/orders",
    },
    {
      label: "Categories",
      value: stats.totalCategory,
      icon: Layers,
      color: "text-violet-600",
      bg: "bg-violet-50",
      to: "/admin/categories",
    },
    {
      label: "Products",
      value: stats.totalProduct,
      icon: ChefHat,
      color: "text-orange-600",
      bg: "bg-orange-50",
      to: "/admin/products",
    },
    {
      label: "Today's Orders",
      value: stats.todayOrders,
      icon: ShoppingBag,
      color: "text-sky-600",
      bg: "bg-sky-50",
      to: "/admin/orders",
    },
    {
      label: "Today's Inquiries",
      value: stats.todayInquiries,
      icon: MessageSquare,
      color: "text-rose-600",
      bg: "bg-rose-50",
      to: "/admin/inquiries",
    },
  ];

  return (
    <div className="space-y-6 bg-slate-50 -m-4 sm:-m-6 p-4 sm:p-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Welcome back, {adminName.split(" ")[0]}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            You're signed in as{" "}
            <span className="font-semibold text-indigo-600">{adminRole}</span>. Here's what's
            happening with your store today.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          All systems online
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, bg, to }) => (
          <Link to={to} key={label} className="block">
            <motion.div
              whileHover={{ y: -2 }}
              className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col justify-between gap-3"
            >
              <div className={`w-9 h-9 rounded-lg ${bg} ${color} flex items-center justify-center`}>
                <Icon size={18} />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">
                  {label}
                </p>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5 truncate">{value}</h3>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Chart + Snapshot row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Sales Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Sales Trend</h2>
              <p className="text-xs text-slate-400">
                {chartView === "weekly" ? "Revenue over the last 7 days" : "Revenue by month"}
              </p>
            </div>
            <div className="flex bg-slate-100 rounded-lg p-1 text-xs font-medium">
              {["weekly", "monthly"].map((v) => (
                <button
                  key={v}
                  onClick={() => setChartView(v)}
                  className={`px-3 py-1 rounded-md capitalize transition-colors ${chartView === v
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                    }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="relative w-full overflow-hidden">
            <svg className="w-full h-44" viewBox="0 0 500 160" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
                </linearGradient>
              </defs>
              <line x1="0" y1="40" x2="500" y2="40" stroke="#E2E8F0" strokeWidth="1" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="#E2E8F0" strokeWidth="1" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="#E2E8F0" strokeWidth="1" />
              {areaPath && <path d={areaPath} fill="url(#chartGrad)" />}
              {linePath && (
                <path d={linePath} fill="none" stroke="#6366F1" strokeWidth="3" strokeLinecap="round" />
              )}
              {points.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="4" fill="#fff" stroke="#6366F1" strokeWidth="2.5" />
              ))}
            </svg>
            <div className="flex justify-between text-[10px] text-slate-400 font-medium px-1 pt-2 border-t border-slate-100">
              {(chartData || []).map((d) => (
                <span key={d[labelKey]}>{d[labelKey]}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Today's Snapshot */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <h2 className="text-base font-semibold text-slate-900 pb-3">Today's Snapshot</h2>

          <div className="space-y-3 flex-1">
            <div className="flex items-center justify-between border-b border-slate-50 pb-2.5">
              <div className="flex items-center gap-2.5 text-slate-600">
                <CalendarDays size={14} className="text-indigo-500" />
                <span className="text-xs font-medium">Today's Orders</span>
              </div>
              <span className="text-xs font-bold text-slate-900">{stats.todayOrders}</span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-50 pb-2.5">
              <div className="flex items-center gap-2.5 text-slate-600">
                <Clock size={14} className="text-amber-500" />
                <span className="text-xs font-medium">Pending / Processing</span>
              </div>
              <span className="text-xs font-bold text-amber-600">{pendingOrders}</span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-50 pb-2.5">
              <div className="flex items-center gap-2.5 text-slate-600">
                <AlertCircle size={14} className="text-rose-500" />
                <span className="text-xs font-medium">New Inquiries Today</span>
              </div>
              <span className="text-xs font-bold text-rose-600">{stats.todayInquiries}</span>
            </div>
          </div>

          <div className="bg-indigo-50/60 p-3.5 rounded-xl border border-indigo-100 text-[11px] text-indigo-800 leading-relaxed mt-3">
            💡 Respond to catering inquiries within a few hours — quick replies convert far
            better on bulk and wedding orders.
          </div>
        </div>
      </div>

      {/* Recent Orders & Inquiries */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Recent Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Recent Orders</h2>
              <p className="text-xs text-slate-400">Latest sales transactions</p>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5"
            >
              View All <ArrowUpRight size={13} />
            </Link>
          </div>

          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-left text-xs border-collapse min-w-[480px]">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-medium">
                  <th className="py-2.5 px-1">Order ID</th>
                  <th className="py-2.5 px-1">Customer</th>
                  <th className="py-2.5 px-1">Amount</th>
                  <th className="py-2.5 px-1 text-center">Status</th>
                  <th className="py-2.5 px-1 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {orders.slice(0, 4).map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-1 font-medium font-mono text-slate-700">{order.id}</td>
                    <td className="py-3 px-1 text-slate-700">{order.customerName}</td>
                    <td className="py-3 px-1 font-semibold text-slate-900">
                      {currency(order.amount)}
                    </td>
                    <td className="py-3 px-1">
                      <div className="flex justify-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold
                          ${order.status === "Completed" ? "bg-emerald-50 text-emerald-700" : ""}
                          ${order.status === "Processing" ? "bg-amber-50 text-amber-700" : ""}
                          ${order.status === "Pending" ? "bg-rose-50 text-rose-700" : ""}
                        `}
                        >
                          {order.status === "Completed" && <CheckCircle2 size={10} />}
                          {(order.status === "Processing" || order.status === "Pending") && (
                            <Clock size={10} />
                          )}
                          {order.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-1 text-right">
                      {order.status !== "Completed" ? (
                        <button
                          onClick={() => handleUpdateStatus(order.id, "Completed")}
                          className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md text-[10px] shadow-sm transition-colors"
                        >
                          Complete
                        </button>
                      ) : (
                        <span className="text-[10px] text-emerald-600 font-semibold">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Customer Inquiries</h2>
              <p className="text-xs text-slate-400">Latest feedback and wedding bookings</p>
            </div>
            <Link
              to="/admin/inquiries"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5"
            >
              View All <ArrowUpRight size={13} />
            </Link>
          </div>

          <div className="space-y-3">
            {inquiries
              .filter((i) => !i.isDeleted)
              .slice(0, 3)
              .map((inquiry) => (
                <div
                  key={inquiry._id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3 justify-between"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-slate-900">{inquiry.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1 italic">
                      "{inquiry.reason}"
                    </p>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 truncate">
                      <span className="truncate">{inquiry.email}</span>
                      <span>|</span>
                      <span>{inquiry.phone}</span>
                    </div>
                  </div>
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0
                    ${inquiry.status === "Pending"
                        ? "bg-rose-50 text-rose-700 border border-rose-100"
                        : "bg-emerald-50 text-emerald-700"
                      }
                  `}
                  >
                    {inquiry.status}
                  </span>
                </div>
              ))}
            {inquiries.filter((i) => !i.isDeleted).length === 0 && (
              <p className="text-xs text-slate-400 text-center py-6">No inquiries yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;