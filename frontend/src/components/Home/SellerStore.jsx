import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import StarIcon from "@mui/icons-material/Star";
import SearchIcon from "@mui/icons-material/Search";
import ViewModuleIcon from "@mui/icons-material/ViewModule";

const SellerStore = () => {
  const { id } = useParams();
  const [data, setData] = useState({ seller: null, products: [] });
  const [loading, setLoading] = useState(true);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState(["All Categories"]);
  const [gridCols, setGridCols] = useState(4); // Default 4 columns

  // Helper function to handle image URLs
  const getImageUrl = (image, fallback = "/default-shop.png") => {
    if (!image) return fallback;
    return typeof image === "object" ? image.url : image;
  };

  const getCategoryName = (category) => {
    if (!category) return "";
    if (typeof category === "string") return category;
    if (typeof category === "object") return category.name || category.title || "";
    return "";
  };

  const filterProducts = (products, query, category) => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(query);
      const categoryName = getCategoryName(p.category);
      const matchesCategory = category === "all" || categoryName.toLowerCase() === category.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  };

useEffect(() => {
  setLoading(true);

  // 1. Store ka Data fetch karein (Seller ke products)
  const fetchStoreData = axios.get(`/api/v1/seller/store/${id}`);
  
  // 2. Sirf Approved Categories fetch karein (Admin ki approve ki hui)
  const fetchApprovedCategories = axios.get(`/api/v1/categories/approved`);

  Promise.all([fetchStoreData, fetchApprovedCategories])
    .then(([storeRes, catRes]) => {
      setData(storeRes.data);
      setSortedProducts(storeRes.data.products);
      
      // Approved categories ko state mein set karein
      setCategories(["All Categories", ...catRes.data.categories.map(c => c.name)]);
      
      setLoading(false);
    })
    .catch((err) => {
      console.error("Error fetching data:", err);
      setLoading(false);
    });
}, [id]);

  // Search Function
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = filterProducts(data.products, query, selectedCategory);
    setSortedProducts(filtered);
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    const filtered = filterProducts(data.products, searchQuery, category);
    setSortedProducts(filtered);
  };

  if (loading) return <div className="text-center py-20 font-bold">Loading Store...</div>;
  if (!data.seller) return <div className="text-center py-20">Store not found.</div>;

  return (
    <div className="bg-[#f4f4f4] min-h-screen pb-10">
      {/* 1. Header Banner */}
      <div className="w-full h-48 bg-green-800 overflow-hidden relative">
        <img
          src={getImageUrl(data.seller.banner, "")}
          className="w-full h-full object-cover opacity-70"
          alt="banner"
          onError={(e) => (e.target.style.display = "none")}
        />
      </div>

      <div className="max-w-7xl mx-auto -mt-16 px-4">
        {/* 2. Store Identity Bar */}
        <div className="bg-white p-4 shadow-sm flex items-center gap-4 relative z-10 mb-6">
          <img
            src={data.seller.logo?.url || "/default-shop.png"}
            className="w-24 h-24 border bg-white object-cover"
            alt="shop-logo"
          />
          <div>
            <h1 className="font-bold text-lg">{data.seller.shopName}</h1>
            <p className="text-xs text-gray-500">85% Positive Seller Ratings</p>
          </div>
          <button className="ml-auto bg-orange-500 text-white px-6 py-2 text-sm font-bold hover:bg-orange-600 transition">
            FOLLOW
          </button>
          <button
            onClick={() => {
              const phone = data.seller.phone;
              window.open(`https://wa.me/${phone}?text=${encodeURIComponent(`Hello, I'm interested in your shop: ${data.seller.shopName}`)}`, "_blank");
            }}
            className="border border-orange-500 text-orange-500 px-6 py-2 text-sm font-bold hover:bg-orange-50 transition"
          >
            CHAT NOW
          </button>
        </div>

        {/* 3. Tabs Navigation */}
        <div className="flex gap-8 bg-white border-b px-4 py-3 mb-6 text-sm font-bold text-gray-600">
          <span className="text-orange-500 border-b-2 border-orange-500 pb-2 cursor-pointer">Store</span>
          
        </div>

        {/* 4. Search & Grid Control Bar */}
        <div className="flex flex-wrap gap-4 items-center justify-between bg-white p-4 shadow-sm border rounded-lg mb-6">
          <div className="relative w-full md:w-1/3">
            <SearchIcon className="absolute left-2 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products in this store..."
              value={searchQuery}
              onChange={handleSearch}
              className="border pl-10 pr-4 py-2 w-full outline-none focus:border-orange-500 rounded-md"
            />
          </div>
          <div className="relative w-full md:w-1/4">
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-1">
              Category
            </label>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="appearance-none border border-gray-300 bg-gradient-to-r from-white to-slate-50 py-3 px-4 pr-10 w-full rounded-3xl shadow-lg transition duration-200 ease-in-out outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 hover:border-gray-300"
              >
                {categories.map((category, index) => (
                  <option key={index} value={category === "All Categories" ? "all" : category}>
                    {category}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 7L10 11L14 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <p className="mt-2 text-[11px] text-gray-400">Choose an approved category for cleaner search results.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold flex items-center gap-1"><ViewModuleIcon fontSize="small" /> Grid:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((num) => (
                <button 
                  key={num}
                  onClick={() => setGridCols(num)}
                  className={`w-8 h-8 flex items-center justify-center border rounded transition 
                    ${gridCols === num ? "bg-green-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Product Grid */}
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}>
          
          {sortedProducts.map((p) => {
            const isOutOfStock = !p.stock || p.stock <= 0;
            return (
            <div key={p._id} className="relative bg-white p-3 border border-gray-100 flex flex-col hover:shadow-lg transition-shadow duration-200">
              <Link to={`/product/${p._id}`} className="block h-48 w-full mb-3">
                <img src={p.images?.[0]?.url || "/placeholder.png"} alt={p.name} className="h-full w-full object-contain" />
              </Link>

              {isOutOfStock && (
                <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] px-2 py-1 font-bold uppercase rounded">Sold Out</div>
              )}

              <div className="text-[11px] font-bold uppercase mb-1">
                {isOutOfStock ? (
                  <span className="text-red-500">Out of Stock</span>
                ) : p.stock < 10 ? (
                  <span className="text-red-600">Only {p.stock} left</span>
                ) : (
                  <span className="text-green-600">In Stock ({p.stock})</span>
                )}
              </div>

              <Link to={`/product/${p._id}`} className="text-[14px] text-gray-700 leading-tight mb-2 hover:text-blue-600">
                {p.name.length > 40 ? p.name.substring(0, 40) + "..." : p.name}
              </Link>

              <div className="flex items-center gap-1 mb-2">
                <div className="flex text-yellow-400 text-xs">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} sx={{ fontSize: "14px", color: i < 4 ? "#FBBF24" : "#E5E7EB" }} />
                  ))}
                </div>
              </div>

              <div className="mt-auto">
                <span className="text-lg font-bold text-gray-900 block">Rs:{p.price.toLocaleString()}</span>
                {p.cuttedPrice && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-xs line-through">Rs:{p.cuttedPrice.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          )})}
        </div>
      </div>
    </div>
  );
};

export default SellerStore;