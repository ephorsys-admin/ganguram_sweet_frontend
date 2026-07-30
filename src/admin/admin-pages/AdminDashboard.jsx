import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  TrendingUp, 
  Layers, 
  ChefHat, 
  ClipboardList, 
  MessageSquare, 
  ArrowUpRight, 
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../../redux/features/category/categoryThunk";

// Helper to load localStorage data with fallback
const getLocalStorageData = (key, fallback) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : fallback;
};

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { categories = [] } = useSelector((state) => state.category);
  const categoryCount = categories.length;

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  // Load mock products, orders, and inquiries from localStorage (to maintain changes across pages)
  const [products] = useState(() => getLocalStorageData("ganguram_products", [
    { id: 1, name: "Authentic Chhena Poda", mrp: 480, sellingPrice: 450, stock: 15, status: true },
    { id: 2, name: "Royal Kendrapara Rasabali", mrp: 520, sellingPrice: 490, stock: 10, status: true },
    { id: 3, name: "Pahala Style Chhena Jhili", mrp: 460, sellingPrice: 420, stock: 20, status: true },
    { id: 4, name: "Classic Saffron Rajbhog", mrp: 450, sellingPrice: 400, stock: 8, status: true },
    { id: 5, name: "Kaju Katli", mrp: 900, sellingPrice: 850, stock: 25, status: true }
  ]));

  const [orders, setOrders] = useState(() => getLocalStorageData("ganguram_orders", [
    { id: "ORD-1001", customerName: "Rajesh Kumar", amount: 1480, itemsCount: 3, status: "Processing", date: "2026-07-28" },
    { id: "ORD-1002", customerName: "Priya Sharma", amount: 920, itemsCount: 2, status: "Completed", date: "2026-07-27" },
    { id: "ORD-1003", customerName: "Amit Das", amount: 450, itemsCount: 1, status: "Pending", date: "2026-07-27" },
    { id: "ORD-1004", customerName: "Sneha Sen", amount: 2350, itemsCount: 5, status: "Completed", date: "2026-07-26" },
    { id: "ORD-1005", customerName: "Rahul Verma", amount: 890, itemsCount: 2, status: "Pending", date: "2026-07-25" }
  ]));

  const [inquiries] = useState(() => getLocalStorageData("ganguram_inquiries", [
    { id: 1, name: "Vikram Singh", email: "vikram@gmail.com", phone: "9876543210", message: "Bulk catering order for wedding on 15th August.", status: "Pending", date: "2026-07-28" },
    { id: 2, name: "Anjali Gupta", email: "anjali@gmail.com", phone: "8765432109", message: "Do you deliver packaged sweets to Mumbai?", status: "Resolved", date: "2026-07-27" },
    { id: 3, name: "Debashish Roy", email: "debashish@gmail.com", phone: "7654321098", message: "Franchise options in Cuttack.", status: "Pending", date: "2026-07-26" }
  ]));

  // Sync back defaults to localStorage if empty
  useEffect(() => {
    if (!localStorage.getItem("ganguram_products")) localStorage.setItem("ganguram_products", JSON.stringify(products));
    if (!localStorage.getItem("ganguram_orders")) localStorage.setItem("ganguram_orders", JSON.stringify(orders));
    if (!localStorage.getItem("ganguram_inquiries")) localStorage.setItem("ganguram_inquiries", JSON.stringify(inquiries));
  }, [products, orders, inquiries]);

  // Derived metrics
  const totalSales = orders.reduce((sum, order) => sum + order.amount, 0);
  const activeProducts = products.filter(p => p.status).length;
  const pendingOrders = orders.filter(o => o.status === "Pending" || o.status === "Processing").length;
  const pendingInquiries = inquiries.filter(i => i.status === "Pending").length;

  const handleUpdateStatus = (orderId, newStatus) => {
    const updated = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    setOrders(updated);
    localStorage.setItem("ganguram_orders", JSON.stringify(updated));
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-black text-[#3D271B]">Dashboard</h1>
          <p className="text-xs text-[#6E5A4F] mt-1">Regulate operations, track performance, and audit sweets orders.</p>
        </div>
        <div className="text-xs text-[#a65827] font-semibold bg-[#FAF0E6] px-3 py-1.5 rounded-lg border border-[#E6CCB2]/40 font-mono">
          SYSTEM STATUS: ONLINE
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Sales */}
        <Link to="/admin/orders" className="block">
          <motion.div 
            whileHover={{ y: -3, scale: 1.01 }}
            className="bg-white p-5 rounded-2xl border border-[#E6CCB2]/30 shadow-xs flex items-center justify-between h-full cursor-pointer hover:border-[#DFA250]/40 transition-colors"
          >
            <div className="space-y-1">
              <span className="text-xs font-semibold text-[#6E5A4F] uppercase tracking-wider">Total Sales</span>
              <h3 className="text-2xl font-bold text-[#3D271B]">₹{totalSales.toLocaleString()}</h3>
              <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                <TrendingUp size={12} /> +12.4% vs last week
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#DFA250] flex items-center justify-center border border-amber-100 shrink-0">
              <DollarSign size={20} />
            </div>
          </motion.div>
        </Link>

        {/* Categories */}
        <Link to="/admin/categories" className="block">
          <motion.div 
            whileHover={{ y: -3, scale: 1.01 }}
            className="bg-white p-5 rounded-2xl border border-[#E6CCB2]/30 shadow-xs flex items-center justify-between h-full cursor-pointer hover:border-[#DFA250]/40 transition-colors"
          >
            <div className="space-y-1">
              <span className="text-xs font-semibold text-[#6E5A4F] uppercase tracking-wider">Categories</span>
              <h3 className="text-2xl font-bold text-[#3D271B]">{categoryCount}</h3>
              <p className="text-[10px] text-[#6E5A4F]/70">Live on storefront</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#FAF6F0] text-[#a65827] flex items-center justify-center border border-[#E6CCB2]/30 shrink-0">
              <Layers size={20} />
            </div>
          </motion.div>
        </Link>

        {/* Live Products */}
        <Link to="/admin/products" className="block">
          <motion.div 
            whileHover={{ y: -3, scale: 1.01 }}
            className="bg-white p-5 rounded-2xl border border-[#E6CCB2]/30 shadow-xs flex items-center justify-between h-full cursor-pointer hover:border-[#DFA250]/40 transition-colors"
          >
            <div className="space-y-1">
              <span className="text-xs font-semibold text-[#6E5A4F] uppercase tracking-wider">Products</span>
              <h3 className="text-2xl font-bold text-[#3D271B]">{activeProducts}/{products.length}</h3>
              <p className="text-[10px] text-[#6E5A4F]/70">Active menu items</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100 shrink-0">
              <ChefHat size={20} />
            </div>
          </motion.div>
        </Link>

        {/* Pending Orders & Inquiries */}
        <Link to="/admin/orders" className="block">
          <motion.div 
            whileHover={{ y: -3, scale: 1.01 }}
            className="bg-white p-5 rounded-2xl border border-[#E6CCB2]/30 shadow-xs flex items-center justify-between h-full cursor-pointer hover:border-red-400/40 transition-colors"
          >
            <div className="space-y-1">
              <span className="text-xs font-semibold text-[#6E5A4F] uppercase tracking-wider">Pending Alerts</span>
              <h3 className="text-2xl font-bold text-red-600">{pendingOrders + pendingInquiries}</h3>
              <p className="text-[10px] text-red-600/70 font-semibold">{pendingOrders} Orders | {pendingInquiries} Inquiries</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100 shrink-0">
              <AlertCircle size={20} />
            </div>
          </motion.div>
        </Link>
      </div>

      {/* Analytics & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Performance Graph */}
        <div className="bg-white p-5 rounded-3xl border border-[#E6CCB2]/30 shadow-xs lg:col-span-2 flex flex-col justify-between">
          <div className="flex justify-between items-center pb-4">
            <div>
              <h2 className="text-lg font-serif font-black text-[#3D271B]">Sales Trend</h2>
              <p className="text-xs text-[#6E5A4F]">Weekly revenue analysis</p>
            </div>
            <span className="text-[11px] font-bold text-[#DFA250] bg-[#FAF6F0] border border-[#E6CCB2]/40 px-2 py-1 rounded-md">Mon - Sun</span>
          </div>

          {/* SVG Sales Line Chart */}
          <div className="relative w-full overflow-hidden">
            <svg className="w-full h-44" viewBox="0 0 500 160" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#DFA250" stopOpacity="0.25"/>
                  <stop offset="100%" stopColor="#DFA250" stopOpacity="0.0"/>
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="40" x2="500" y2="40" stroke="#E6CCB2" strokeOpacity="0.15" strokeWidth="1" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="#E6CCB2" strokeOpacity="0.15" strokeWidth="1" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="#E6CCB2" strokeOpacity="0.15" strokeWidth="1" />

              {/* Gradient Path */}
              <path d="M0,160 L0,120 L83,100 L166,130 L249,70 L332,50 L415,90 L500,40 L500,160 Z" fill="url(#chartGrad)" />

              {/* Line Path */}
              <path d="M0,120 L83,100 L166,130 L249,70 L332,50 L415,90 L500,40" fill="none" stroke="#DFA250" strokeWidth="3.5" strokeLinecap="round" />

              {/* Data Points */}
              <circle cx="83" cy="100" r="4.5" fill="#3D271B" stroke="#DFA250" strokeWidth="2" />
              <circle cx="249" cy="70" r="4.5" fill="#3D271B" stroke="#DFA250" strokeWidth="2" />
              <circle cx="332" cy="50" r="4.5" fill="#3D271B" stroke="#DFA250" strokeWidth="2" />
              <circle cx="500" cy="40" r="4.5" fill="#3D271B" stroke="#DFA250" strokeWidth="2" />
            </svg>
            <div className="flex justify-between text-[10px] text-[#6E5A4F] font-bold px-1 pt-2 border-t border-slate-100 font-mono">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </div>

        {/* Quick Summary list */}
        <div className="bg-white p-5 rounded-3xl border border-[#E6CCB2]/30 shadow-xs flex flex-col justify-between">
          <h2 className="text-lg font-serif font-black text-[#3D271B] pb-3">Operational Status</h2>
          
          <div className="space-y-4 flex-1 mt-2">
            <div className="flex items-center justify-between border-b border-[#FAF6F0] pb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold text-[#3D271B]">Menu Synchronized</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">OK</span>
            </div>
            
            <div className="flex items-center justify-between border-b border-[#FAF6F0] pb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-xs font-semibold text-[#3D271B]">Pending Deliveries</span>
              </div>
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">{pendingOrders} Active</span>
            </div>

            <div className="flex items-center justify-between border-b border-[#FAF6F0] pb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-semibold text-[#3D271B]">Awaiting Response</span>
              </div>
              <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">{pendingInquiries} Inquiries</span>
            </div>
          </div>

          <div className="bg-[#FAF6F0]/60 p-3.5 rounded-xl border border-[#E6CCB2]/30 text-[11px] text-[#6E5A4F] leading-relaxed">
            💡 <strong>Daily Tip:</strong> Review catering inquiries promptly! Ganguram Sweet Heritage's royal brand depends heavily on timely bulk orders.
          </div>
        </div>
      </div>

      {/* Grid: Recent Orders & Inquiries */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white p-5 rounded-3xl border border-[#E6CCB2]/30 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-serif font-black text-[#3D271B]">Recent Orders</h2>
              <p className="text-xs text-[#6E5A4F]">Latest sales transactions</p>
            </div>
            <Link to="/admin/orders" className="text-xs font-bold text-[#a65827] hover:text-[#DFA250] flex items-center gap-0.5 transition">
              View All <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#FAF6F0] text-[#6E5A4F] font-semibold">
                  <th className="py-2.5">Order ID</th>
                  <th className="py-2.5">Customer</th>
                  <th className="py-2.5">Amount</th>
                  <th className="py-2.5 text-center">Status</th>
                  <th className="py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FAF6F0]">
                {orders.slice(0, 4).map((order) => (
                  <tr key={order.id} className="hover:bg-[#FAF6F0]/25 transition">
                    <td className="py-3 font-semibold font-mono text-[#3D271B]">{order.id}</td>
                    <td className="py-3 text-[#3D271B]">{order.customerName}</td>
                    <td className="py-3 font-bold text-[#3D271B]">₹{order.amount}</td>
                    <td className="py-3">
                      <div className="flex justify-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold
                          ${order.status === "Completed" ? "bg-emerald-50 text-emerald-700" : ""}
                          ${order.status === "Processing" ? "bg-amber-50 text-amber-700" : ""}
                          ${order.status === "Pending" ? "bg-red-50 text-red-700" : ""}
                        `}>
                          {order.status === "Completed" && <CheckCircle2 size={10} />}
                          {order.status === "Processing" && <Clock size={10} />}
                          {order.status === "Pending" && <Clock size={10} />}
                          {order.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-right">
                      {order.status !== "Completed" && (
                        <button 
                          onClick={() => handleUpdateStatus(order.id, "Completed")}
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md text-[10px] shadow-sm transition"
                        >
                          Complete
                        </button>
                      )}
                      {order.status === "Completed" && (
                        <span className="text-[10px] text-emerald-600 font-bold">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="bg-white p-5 rounded-3xl border border-[#E6CCB2]/30 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-serif font-black text-[#3D271B]">Customer Inquiries</h2>
              <p className="text-xs text-[#6E5A4F]">Latest feedback and wedding bookings</p>
            </div>
            <Link to="/admin/inquiries" className="text-xs font-bold text-[#a65827] hover:text-[#DFA250] flex items-center gap-0.5 transition">
              View All <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="space-y-3.5">
            {inquiries.slice(0, 3).map((inquiry) => (
              <div key={inquiry.id} className="p-3 bg-[#FAF6F0]/40 rounded-2xl border border-[#E6CCB2]/20 flex items-start gap-3 justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-[#3D271B]">{inquiry.name}</span>
                    <span className="text-[9px] text-[#6E5A4F]/60 font-mono">{inquiry.date}</span>
                  </div>
                  <p className="text-[11px] text-[#6E5A4F] line-clamp-1 italic">
                    "{inquiry.message}"
                  </p>
                  <div className="flex items-center gap-2 text-[9px] font-mono text-[#6E5A4F]/70">
                    <span>{inquiry.email}</span>
                    <span>|</span>
                    <span>{inquiry.phone}</span>
                  </div>
                </div>
                <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold shrink-0
                  ${inquiry.status === "Pending" ? "bg-red-50 text-red-700 border border-red-100" : "bg-emerald-50 text-emerald-700"}
                `}>
                  {inquiry.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;