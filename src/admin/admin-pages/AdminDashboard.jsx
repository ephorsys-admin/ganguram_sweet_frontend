import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { getDashboardStats } from "../../redux/features/dashboard/dashboardThunk";
import { getAllContacts } from "../../redux/features/contact/contactThunk";
import {
  getOrders,
  updateOrderStatus,
} from "../../redux/features/order/orderThunk";
import { useToast } from "../../context/ToastContext";

const currency = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const { stats, isLoading: statsLoading } = useSelector(
    (state) => state.dashboard
  );
  const { contacts: inquiries = [] } = useSelector(
    (state) => state.contact
  );
  const { orders = [] } = useSelector((state) => state.order);
  const admin = useSelector((state) => state.auth.user);

  const adminName = admin?.name || "Admin User";
  const adminRole = admin?.role === "super_admin" ? "Super Admin" : "Admin";

  useEffect(() => {
    dispatch(getDashboardStats());
    dispatch(getAllContacts());
    dispatch(getOrders({ limit: 100 }));
  }, [dispatch]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const resultAction = await dispatch(
        updateOrderStatus({ orderId, orderStatus: newStatus })
      ).unwrap();
      if (resultAction.success) {
        showToast(`Order marked as ${newStatus}!`, "success");
        dispatch(getOrders({ limit: 100 }));
        dispatch(getDashboardStats());
      }
    } catch (err) {
      showToast(err.message || "Failed to update order status", "error");
    }
  };

  const activeStats = stats || {
    totalSales: 0,
    todaySales: 0,
    totalCategory: 0,
    totalProduct: 0,
    todayOrders: 0,
    todayInquiries: 0,
    weeklySales: [],
    monthlySales: [],
  };

  const pendingOrders = orders.filter(
    (o) =>
      o.orderStatus === "Pending" ||
      o.orderStatus === "Preparing" ||
      o.orderStatus === "Confirmed"
  ).length;

  // ---- Chart data (weekly / monthly toggle) ----
  const [chartView, setChartView] = useState("weekly");
  const chartData =
    chartView === "weekly"
      ? activeStats.weeklySales
      : activeStats.monthlySales;
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
      value: currency(activeStats.totalSales),
      icon: IndianRupee,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      to: "/admin/orders",
      superAdminOnly: true,
    },
    {
      label: "Today's Sales",
      value: currency(activeStats.todaySales),
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      to: "/admin/orders",
    },
    {
      label: "Categories",
      value: activeStats.totalCategory,
      icon: Layers,
      color: "text-violet-600",
      bg: "bg-violet-50",
      to: "/admin/categories",
    },
    {
      label: "Products",
      value: activeStats.totalProduct,
      icon: ChefHat,
      color: "text-orange-600",
      bg: "bg-orange-50",
      to: "/admin/products",
    },
    {
      label: "Today's Orders",
      value: activeStats.todayOrders,
      icon: ShoppingBag,
      color: "text-sky-600",
      bg: "bg-sky-50",
      to: "/admin/orders",
    },
    {
      label: "Today's Inquiries",
      value: activeStats.todayInquiries,
      icon: MessageSquare,
      color: "text-rose-600",
      bg: "bg-rose-50",
      to: "/admin/inquiries",
    },
  ].filter((card) => !card.superAdminOnly || admin?.role === "super_admin");

  if (statsLoading && !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-slate-50 space-y-4">
        <Loader2 className="h-12 w-12 text-[#DFA250] animate-spin" />
        <span className="text-sm md:text-base text-[#6E5A4F] font-semibold">
          Loading Dashboard Data...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-slate-50 -m-4 sm:-m-6 p-4 sm:p-6 md:p-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {adminName.split(" ")[0]}
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-1 font-medium">
            You're signed in as{" "}
            <span className="font-bold text-indigo-600">{adminRole}</span>.
            Here's what's happening with your store today.
          </p>
        </div>
        <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          All systems online
        </div>
      </div>

      {/* Stats Cards */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${
          admin?.role === "super_admin" ? "xl:grid-cols-6" : "xl:grid-cols-5"
        } gap-4 sm:gap-5`}
      >
        {statCards.map(({ label, value, icon: Icon, color, bg, to }) => (
          <Link to={to} key={label} className="block">
            <motion.div
              whileHover={{ y: -3 }}
              className="bg-white p-5 rounded-3xl border border-slate-200/70 shadow-xs hover:shadow-md transition-shadow h-full flex flex-col justify-between gap-4"
            >
              <div
                className={`w-12 h-12 rounded-2xl ${bg} ${color} flex items-center justify-center shadow-xs`}
              >
                <Icon size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {label}
                </p>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 truncate">
                  {value}
                </h3>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Chart + Snapshot row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/70 shadow-xs lg:col-span-2 space-y-4">
          <div className="flex flex-wrap justify-between items-center gap-3 mb-2">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Sales Trend
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">
                {chartView === "weekly"
                  ? "Revenue over the last 7 days"
                  : "Revenue by month"}
              </p>
            </div>
            <div className="flex bg-slate-100 rounded-xl p-1 text-xs sm:text-sm font-bold">
              {["weekly", "monthly"].map((v) => (
                <button
                  key={v}
                  onClick={() => setChartView(v)}
                  className={`px-4 py-1.5 rounded-lg capitalize transition-colors cursor-pointer ${
                    chartView === v
                      ? "bg-white text-indigo-600 shadow-xs font-bold"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="relative w-full overflow-hidden pt-2">
            <svg
              className="w-full h-48 sm:h-56"
              viewBox="0 0 500 160"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
                </linearGradient>
              </defs>
              <line
                x1="0"
                y1="40"
                x2="500"
                y2="40"
                stroke="#E2E8F0"
                strokeWidth="1"
              />
              <line
                x1="0"
                y1="80"
                x2="500"
                y2="80"
                stroke="#E2E8F0"
                strokeWidth="1"
              />
              <line
                x1="0"
                y1="120"
                x2="500"
                y2="120"
                stroke="#E2E8F0"
                strokeWidth="1"
              />
              {areaPath && <path d={areaPath} fill="url(#chartGrad)" />}
              {linePath && (
                <path
                  d={linePath}
                  fill="none"
                  stroke="#6366F1"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              )}
              {points.map((p, i) => (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r="5"
                  fill="#fff"
                  stroke="#6366F1"
                  strokeWidth="3"
                />
              ))}
            </svg>
            <div className="flex justify-between text-xs text-slate-500 font-bold px-2 pt-3 border-t border-slate-100">
              {(chartData || []).map((d) => (
                <span key={d[labelKey]}>{d[labelKey]}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Today's Snapshot */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/70 shadow-xs flex flex-col justify-between gap-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
            Today's Snapshot
          </h2>

          <div className="space-y-4 flex-1">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3 text-slate-600">
                <CalendarDays size={18} className="text-indigo-500" />
                <span className="text-sm font-semibold">Today's Orders</span>
              </div>
              <span className="text-base font-black text-slate-900">
                {activeStats.todayOrders}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3 text-slate-600">
                <Clock size={18} className="text-amber-500" />
                <span className="text-sm font-semibold">
                  Pending / Processing
                </span>
              </div>
              <span className="text-base font-black text-amber-600">
                {pendingOrders}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3 text-slate-600">
                <AlertCircle size={18} className="text-rose-500" />
                <span className="text-sm font-semibold">
                  New Inquiries Today
                </span>
              </div>
              <span className="text-base font-black text-rose-600">
                {activeStats.todayInquiries}
              </span>
            </div>
          </div>

          <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-100 text-xs sm:text-sm text-indigo-900 leading-relaxed font-medium">
            💡 Respond to catering inquiries promptly — quick replies convert
            significantly better on bulk and wedding orders.
          </div>
        </div>
      </div>

      {/* Recent Orders & Inquiries */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/70 shadow-xs space-y-5">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Recent Orders
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">
                Latest sales transactions
              </p>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              View All <ArrowUpRight size={16} />
            </Link>
          </div>

          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-left text-sm border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold text-xs uppercase tracking-wider">
                  <th className="py-3 px-2">Order ID</th>
                  <th className="py-3 px-2">Customer</th>
                  <th className="py-3 px-2">Amount</th>
                  <th className="py-3 px-2 text-center">Status</th>
                  <th className="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.slice(0, 5).map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    <td
                      className="py-3.5 px-2 font-bold font-mono text-slate-700 truncate max-w-[120px]"
                      title={order._id}
                    >
                      {order.orderNumber || order._id.substring(18)}
                    </td>
                    <td className="py-3.5 px-2 text-slate-800 font-semibold">
                      {order.customerName}
                    </td>
                    <td className="py-3.5 px-2 font-black font-mono text-slate-900">
                      {currency(order.totalAmount)}
                    </td>
                    <td className="py-3.5 px-2">
                      <div className="flex justify-center">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold
                          ${
                            order.orderStatus === "Delivered"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : ""
                          }
                          ${
                            order.orderStatus === "Preparing" ||
                            order.orderStatus === "Confirmed" ||
                            order.orderStatus === "Out For Delivery"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : ""
                          }
                          ${
                            order.orderStatus === "Pending"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : ""
                          }
                          ${
                            order.orderStatus === "Cancelled"
                              ? "bg-slate-100 text-slate-600 border border-slate-200"
                              : ""
                          }
                        `}
                        >
                          {order.orderStatus === "Delivered" && (
                            <CheckCircle2 size={12} />
                          )}
                          {(order.orderStatus === "Preparing" ||
                            order.orderStatus === "Confirmed" ||
                            order.orderStatus === "Out For Delivery" ||
                            order.orderStatus === "Pending") && (
                            <Clock size={12} />
                          )}
                          {order.orderStatus}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      {order.orderStatus !== "Delivered" &&
                      order.orderStatus !== "Cancelled" ? (
                        <button
                          onClick={() =>
                            handleUpdateStatus(order._id, "Delivered")
                          }
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-xs transition cursor-pointer"
                        >
                          Deliver
                        </button>
                      ) : (
                        <span className="text-xs text-emerald-600 font-bold">
                          Processed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/70 shadow-xs space-y-5">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Customer Inquiries
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">
                Latest feedback and catering requests
              </p>
            </div>
            <Link
              to="/admin/inquiries"
              className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              View All <ArrowUpRight size={16} />
            </Link>
          </div>

          <div className="space-y-3.5">
            {inquiries
              .filter((i) => !i.isDeleted)
              .slice(0, 4)
              .map((inquiry) => (
                <div
                  key={inquiry._id}
                  className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3 justify-between"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold text-sm text-slate-900">
                        {inquiry.name}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {new Date(inquiry.createdAt).toLocaleDateString(
                          "en-IN"
                        )}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-1 italic">
                      "{inquiry.reason}"
                    </p>
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400 truncate">
                      <span className="truncate">{inquiry.email}</span>
                      <span>|</span>
                      <span>{inquiry.phone}</span>
                    </div>
                  </div>
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-bold shrink-0 ${
                      inquiry.status === "Pending"
                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    }`}
                  >
                    {inquiry.status}
                  </span>
                </div>
              ))}
            {inquiries.filter((i) => !i.isDeleted).length === 0 && (
              <p className="text-sm text-slate-400 text-center py-8">
                No inquiries yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;