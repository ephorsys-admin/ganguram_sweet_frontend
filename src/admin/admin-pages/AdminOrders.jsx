import { useState, useEffect } from "react";
import { ClipboardList, Search, Filter } from "lucide-react";
import OrderTable from "../admin-components/OrderTable";
import OrderDetailModal from "../admin-components/OrderDetailModal";

const AdminOrders = () => {
  // Load orders from localStorage
  const [orders, setOrders] = useState(() => {
    const data = localStorage.getItem("ganguram_orders");
    return data ? JSON.parse(data) : [
      { 
        id: "ORD-1001", 
        customerName: "Rajesh Kumar", 
        email: "rajesh.k@gmail.com",
        phone: "9876543210",
        amount: 1480, 
        paymentMethod: "Online UPI",
        address: "Flat 402, Royal Residency, Saheed Nagar, Bhubaneswar, Odisha - 751007",
        items: [
          { name: "Authentic Chhena Poda", qty: 2, price: 450 },
          { name: "Royal Kendrapara Rasabali", qty: 1, price: 490 }
        ],
        status: "Processing", 
        date: "2026-07-28" 
      },
      { 
        id: "ORD-1002", 
        customerName: "Priya Sharma", 
        email: "priya.sharma@yahoo.com",
        phone: "8765432109",
        amount: 920, 
        paymentMethod: "Credit Card",
        address: "Sector 2, CDA Colony, Cuttack, Odisha - 753014",
        items: [
          { name: "Classic Saffron Rajbhog", qty: 1, price: 400 },
          { name: "Pahala Style Chhena Jhili", qty: 1, price: 420 }
        ],
        status: "Completed", 
        date: "2026-07-27" 
      },
      { 
        id: "ORD-1003", 
        customerName: "Amit Das", 
        email: "amit.das@outlook.com",
        phone: "7654321098",
        amount: 450, 
        paymentMethod: "Cash on Delivery",
        address: "Quarter No. D-12, Sector 5, Rourkela, Odisha - 769002",
        items: [
          { name: "Authentic Chhena Poda", qty: 1, price: 450 }
        ],
        status: "Pending", 
        date: "2026-07-27" 
      },
      { 
        id: "ORD-1004", 
        customerName: "Sneha Sen", 
        email: "sneha.sen@gmail.com",
        phone: "9123456789",
        amount: 2350, 
        paymentMethod: "Online UPI",
        address: "7A, Salt Lake Sector V, Kolkata, West Bengal - 700091",
        items: [
          { name: "Kaju Katli", qty: 2, price: 850 },
          { name: "Pahala Style Chhena Jhili", qty: 1, price: 420 },
          { name: "Classic Saffron Rajbhog", qty: 2, price: 400 }
        ],
        status: "Completed", 
        date: "2026-07-26" 
      },
      { 
        id: "ORD-1005", 
        customerName: "Rahul Verma", 
        email: "rahul.v@gmail.com",
        phone: "9812345670",
        amount: 890, 
        paymentMethod: "Cash on Delivery",
        address: "Patia Chowk, Behind Big Bazaar, Bhubaneswar, Odisha - 751024",
        items: [
          { name: "Royal Kendrapara Rasabali", qty: 1, price: 490 },
          { name: "Classic Saffron Rajbhog", qty: 1, price: 400 }
        ],
        status: "Pending", 
        date: "2026-07-25" 
      }
    ];
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem("ganguram_orders", JSON.stringify(orders));
  }, [orders]);

  // Filters State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Selected Order for Details Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleUpdateStatus = (id, newStatus) => {
    const updated = orders.map(o => o.id === id ? { ...o, status: newStatus } : o);
    setOrders(updated);
    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const handleDeleteOrder = (id) => {
    if (window.confirm("Are you sure you want to delete this order record?")) {
      setOrders(orders.filter(o => o.id !== id));
      setDetailsOpen(false);
    }
  };

  const handleOpenDetails = (order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  // Filtered orders list
  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.customerName.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 text-xs font-sans">
      {/* Header */}
      <div className="flex justify-between items-center pb-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-black text-[#3D271B] flex items-center gap-2">
            <ClipboardList className="text-[#a65827] h-8 w-8" />
            Manage Orders
          </h1>
          <p className="text-xs text-[#6E5A4F] mt-1">Audit transactions, manage delivery statuses, and view customer details.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-[#E6CCB2]/30 shadow-xs flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <Search className="absolute inset-y-0 left-3.5 my-auto text-[#6E5A4F]/50 h-4 w-4" />
          <input
            type="text"
            placeholder="Search by Order ID or Customer Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-10 pr-4 py-2.5 bg-[#FAF6F0]/40 border border-[#E6CCB2]/30 rounded-xl text-xs text-[#3D271B] focus:outline-none focus:ring-2 focus:ring-[#a65827]/10"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
          <Filter size={15} className="text-[#a65827]" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full md:w-48 px-3 py-2.5 bg-[#FAF6F0]/40 border border-[#E6CCB2]/30 rounded-xl text-xs text-[#3D271B] font-semibold focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Grid/Table Component */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-[#E6CCB2]/30 text-center space-y-4 shadow-xs">
          <div className="mx-auto w-16 h-16 rounded-full bg-[#FAF6F0] flex items-center justify-center text-[#DFA250] border border-[#E6CCB2]/20">
            <ClipboardList size={28} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#3D271B]">No Orders Found</h3>
            <p className="text-xs text-[#6E5A4F]">Try adjusting your search criteria.</p>
          </div>
        </div>
      ) : (
        <OrderTable 
          orders={filteredOrders}
          onViewDetails={handleOpenDetails}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      {/* Detailed View Modal Component */}
      <OrderDetailModal 
        isOpen={detailsOpen}
        order={selectedOrder}
        onClose={() => setDetailsOpen(false)}
        onDelete={handleDeleteOrder}
      />
    </div>
  );
};

export default AdminOrders;
