import { useState, useEffect } from "react";
import { 
  Plus, 
  ChefHat, 
  Search, 
  Filter
} from "lucide-react";
import { useGetCategoriesQuery } from "../../redux/services/adminApi";
import ProductTable from "../admin-components/ProductTable";
import ProductModal from "../admin-components/ProductModal";

const SWEET_IMAGES = [
  "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?q=80&w=300&auto=format&fit=crop"
];

const AdminProducts = () => {
  // Fetch real categories list to bind to dropdown
  const { data: categoriesResponse } = useGetCategoriesQuery();
  const categories = categoriesResponse?.data || [];

  // Load products from localStorage
  const [products, setProducts] = useState(() => {
    const data = localStorage.getItem("ganguram_products");
    return data ? JSON.parse(data) : [
      { id: 1, name: "Authentic Chhena Poda", categoryId: "Traditional Odia Sweets", mrp: 480, sellingPrice: 450, stock: 15, unit: "Kg", status: true, image: SWEET_IMAGES[0], isFeatured: true, isBestSeller: true },
      { id: 2, name: "Royal Kendrapara Rasabali", categoryId: "Traditional Odia Sweets", mrp: 520, sellingPrice: 490, stock: 10, unit: "Kg", status: true, image: SWEET_IMAGES[1], isFeatured: false, isBestSeller: true },
      { id: 3, name: "Pahala Style Chhena Jhili", categoryId: "Traditional Odia Sweets", mrp: 460, sellingPrice: 420, stock: 20, unit: "Piece", status: true, image: SWEET_IMAGES[2], isFeatured: true, isBestSeller: false },
      { id: 4, name: "Classic Saffron Rajbhog", categoryId: "Signature Bengali Sweets", mrp: 450, sellingPrice: 400, stock: 8, unit: "Box", status: true, image: SWEET_IMAGES[1], isFeatured: false, isBestSeller: false },
      { id: 5, name: "Kaju Katli", categoryId: "Dry Sweets & Laddus", mrp: 900, sellingPrice: 850, stock: 25, unit: "Kg", status: true, image: SWEET_IMAGES[3], isFeatured: true, isBestSeller: true }
    ];
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem("ganguram_products", JSON.stringify(products));
  }, [products]);

  // Search & Filter state
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("add"); // "add" | "edit"
  const [currentProduct, setCurrentProduct] = useState(null);

  const handleOpenAddModal = () => {
    setModalType("add");
    setCurrentProduct(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setModalType("edit");
    setCurrentProduct(prod);
    setModalOpen(true);
  };

  const handleToggleStatus = (id) => {
    setProducts(products.map(p => p.id === id ? { ...p, status: !p.status } : p));
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleModalSubmit = (formData) => {
    if (modalType === "add") {
      const newProduct = {
        id: Date.now(),
        ...formData,
        mrp: parseFloat(formData.mrp) || 0,
        sellingPrice: parseFloat(formData.sellingPrice) || 0,
        stock: parseInt(formData.stock) || 0,
      };
      setProducts([...products, newProduct]);
    } else {
      setProducts(products.map(p => p.id === currentProduct.id ? {
        ...p,
        ...formData,
        mrp: parseFloat(formData.mrp) || 0,
        sellingPrice: parseFloat(formData.sellingPrice) || 0,
        stock: parseInt(formData.stock) || 0,
      } : p));
    }
    setModalOpen(false);
  };

  // Filtered lists
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "All" || p.categoryId === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-black text-[#3D271B] flex items-center gap-2">
            <ChefHat className="text-[#a65827] h-8 w-8" />
            Manage Products
          </h1>
          <p className="text-xs text-[#6E5A4F] mt-1 font-sans">Regulate menu pricing, sweet inventory, and catalog status.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-gradient-to-r from-[#3D271B] to-[#a65827] hover:from-[#a65827] hover:to-[#DFA250] text-[#FAF6F0] text-xs font-semibold rounded-xl shadow-lg transition-all duration-300 flex items-center gap-1.5 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus size={16} /> Add Sweet Product
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-[#E6CCB2]/30 shadow-xs flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <Search className="absolute inset-y-0 left-3.5 my-auto text-[#6E5A4F]/50 h-4 w-4" />
          <input
            type="text"
            placeholder="Search sweets by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-10 pr-4 py-2.5 bg-[#FAF6F0]/40 border border-[#E6CCB2]/30 rounded-xl text-xs text-[#3D271B] placeholder-[#6E5A4F]/40 focus:outline-none focus:ring-2 focus:ring-[#a65827]/10 focus:border-[#a65827] transition"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
          <Filter size={15} className="text-[#a65827]" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="block w-full md:w-48 px-3 py-2.5 bg-[#FAF6F0]/40 border border-[#E6CCB2]/30 rounded-xl text-xs text-[#3D271B] font-semibold focus:outline-none focus:ring-2 focus:ring-[#a65827]/10 focus:border-[#a65827] transition"
          >
            <option value="All">All Categories</option>
            {categories.map(c => (
              <option key={c._id} value={c.name}>{c.name}</option>
            ))}
            {categories.length === 0 && (
              <>
                <option value="Traditional Odia Sweets">Traditional Odia Sweets</option>
                <option value="Signature Bengali Sweets">Signature Bengali Sweets</option>
                <option value="Dry Sweets & Laddus">Dry Sweets & Laddus</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* Grid table */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-[#E6CCB2]/30 text-center space-y-4 shadow-xs">
          <div className="mx-auto w-16 h-16 rounded-full bg-[#FAF6F0] flex items-center justify-center text-[#DFA250] border border-[#E6CCB2]/20">
            <ChefHat size={28} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#3D271B]">No Sweets Found</h3>
            <p className="text-xs text-[#6E5A4F]">Try adjusting your search criteria or add a new sweet item.</p>
          </div>
        </div>
      ) : (
        <ProductTable 
          products={filteredProducts}
          onEditClick={handleOpenEditModal}
          onDeleteClick={handleDeleteProduct}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {/* Add / Edit modal component */}
      <ProductModal 
        isOpen={modalOpen}
        type={modalType}
        product={currentProduct}
        categories={categories}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};

export default AdminProducts;
