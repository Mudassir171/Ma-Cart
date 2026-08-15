import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, getSliderProducts } from "../../actions/productAction";
import { useSnackbar } from "notistack";
import MetaData from "../Layouts/MetaData";
import { Link } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import StarIcon from "@mui/icons-material/Star";

// --- CUSTOM PRODUCT CARD WITH EXACT HOVER BUTTONS & BADGE ---
const ProductCard = ({ item }) => {
  const discountPercentage =
    item.discount ||
    (item.cuttedPrice && item.price
      ? Math.round(((item.cuttedPrice - item.price) / item.cuttedPrice) * 100)
      : 0);

  return (
    <div className="group relative bg-white border border-gray-200 rounded-md p-3 flex flex-col justify-between h-full hover:shadow-lg transition-all duration-300">
      {/* Top Discount Badge */}
      {discountPercentage > 0 && (
        <span className="absolute top-2 left-2 z-10 bg-[#2bbef9] text-white text-[11px] font-bold px-2 py-0.5 rounded-sm">
          {discountPercentage}% OFF
        </span>
      )}

      {/* Floating Right Action Icons (Expand & Wishlist) */}
      <div className="absolute top-2 right-2 z-10 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:bg-sky-50 hover:text-sky-500 transition-colors">
          <OpenInFullIcon className="!text-sm" />
        </button>
        <button className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:bg-rose-50 hover:text-rose-500 transition-colors">
          <FavoriteBorderIcon className="!text-sm" />
        </button>
      </div>

      {/* Product Image */}
      <div className="w-full h-36 flex items-center justify-center p-2 overflow-hidden my-1">
        <img
          src={item.images?.[0]?.url || item.image || "https://via.placeholder.com/150"}
          alt={item.name}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-col gap-1 mt-2">
        <h4 className="text-xs font-semibold text-gray-800 line-clamp-2 h-8 leading-snug">
          {item.name}
        </h4>
        
        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wide">
          {item.stock > 0 ? "IN STOCK" : "OUT OF STOCK"}
        </span>

        {/* Rating Stars */}
        <div className="flex items-center text-amber-400 my-0.5">
          {[...Array(5)].map((_, i) => (
            <StarIcon
              key={i}
              className={`!text-xs ${
                i < Math.floor(item.ratings || 4) ? "text-amber-400" : "text-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Pricing */}
        <div className="flex items-center gap-2 mt-1">
          {item.cuttedPrice && (
            <span className="text-xs text-gray-400 line-through font-semibold">
              ${item.cuttedPrice}
            </span>
          )}
          <span className="text-sm font-black text-rose-500">
            ${item.price}
          </span>
        </div>
      </div>

      {/* Bottom Full-Width Action Button */}
      <Link
        to={`/product/${item._id}`}
        className="mt-3 w-full text-center py-1.5 bg-[#2bbef9] hover:bg-sky-500 text-white text-xs font-bold rounded-full transition-colors"
      >
        View Product
      </Link>
    </div>
  );
};

// --- FEATURED CATEGORIES SECTION ---
const FeaturedCategoriesSection = () => {
  const categories = [
    { name: "Household Needs", count: "1 Item", img: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?auto=format&fit=crop&w=150&q=80" },
    { name: "Biscuits & Snacks", count: "5 Items", img: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=150&q=80" },
    { name: "Breads & Bakery", count: "6 Items", img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=150&q=80" },
    { name: "Breakfast & Dairy", count: "5 Items", img: "https://images.unsplash.com/photo-1528751014936-863e6e7a319c?auto=format&fit=crop&w=150&q=80" },
    { name: "Beverages", count: "6 Items", img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=150&q=80" },
    { name: "Frozen Foods", count: "5 Items", img: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=150&q=80" },
  ];

  const catRef = useRef(null);

  const scroll = (direction) => {
    if (catRef.current) {
      const { scrollLeft, clientWidth } = catRef.current;
      catRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - clientWidth * 0.5 : scrollLeft + clientWidth * 0.5,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full relative bg-white border border-gray-200 rounded-md p-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-4">
        FEATURED CATEGORIES
      </h3>

      <div className="relative group">
        <button
          onClick={() => scroll("left")}
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white border shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-50"
        >
          <ChevronLeftIcon fontSize="small" />
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white border shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-50"
        >
          <ChevronRightIcon fontSize="small" />
        </button>

        <div
          ref={catRef}
          className="flex overflow-x-auto scroll-smooth divide-x divide-gray-200 border-y border-gray-200 scrollbar-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="min-w-[160px] flex-1 flex flex-col items-center justify-center p-4 bg-white text-center hover:shadow-sm transition-shadow cursor-pointer"
            >
              <img src={cat.img} alt={cat.name} className="w-16 h-16 object-contain mb-2" />
              <h5 className="text-xs font-bold text-gray-800 leading-tight mb-0.5">{cat.name}</h5>
              <span className="text-[10px] text-gray-400 font-medium">{cat.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- MAIN HOME COMPONENT ---
const Home = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { error, loading, products } = useSelector((state) => state.products);

  const featuredScrollRef = useRef(null);
  const newScrollRef = useRef(null);

  const scrollContainer = (ref, direction) => {
    if (ref.current) {
      const { scrollLeft, clientWidth } = ref.current;
      ref.current.scrollTo({
        left: direction === "left" ? scrollLeft - clientWidth * 0.75 : scrollLeft + clientWidth * 0.75,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }
    dispatch(getSliderProducts());
  }, [dispatch, error, enqueueSnackbar]);

  const featuredProducts = products?.filter((item) => {
    const disc =
      item.discount ||
      (item.cuttedPrice && item.price
        ? Math.round(((item.cuttedPrice - item.price) / item.cuttedPrice) * 100)
        : 0);
    return disc > 0;
  }) || [];

  const newProducts = products
    ? [...products].sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      )
    : [];

  return (
    <>
      <MetaData title="Ma-Cart | Online Shopping Site" />

      <main className="w-full bg-[#f8f9fa] min-h-screen pb-12 pt-4">
        <div className="max-w-[1360px] mx-auto px-2 sm:px-4 flex flex-col gap-6">

          {/* 1. TOP MAIN BANNER */}
          <div className="w-full relative h-[320px] rounded-xl overflow-hidden bg-emerald-900 shadow-sm flex items-center justify-between px-8 text-white">
            <div className="max-w-md z-10">
              <span className="text-xs uppercase bg-emerald-700/60 px-2 py-1 rounded font-semibold text-emerald-200">
                EXCLUSIVE OFFER -20% OFF
              </span>
              <h1 className="text-3xl font-extrabold mt-3 leading-tight">
                Having the best quality products
              </h1>
              <p className="text-xs text-emerald-100 mt-2">Only this week. Don't miss...</p>
              <p className="text-xs mt-3">
                from <span className="text-xl font-black text-rose-300">$5.45</span>
              </p>
              <Link
                to="/products"
                className="mt-4 inline-block bg-[#2bbef9] hover:bg-sky-500 text-white font-bold text-xs px-5 py-2.5 rounded-full transition-colors"
              >
                Shop Now &rarr;
              </Link>
            </div>
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80"
              alt="Main Banner"
              className="absolute right-0 top-0 h-full w-2/3 object-cover opacity-80 pointer-events-none"
            />
          </div>

          {/* 2. FEATURED CATEGORIES SECTION */}
          <FeaturedCategoriesSection />

          {/* MAIN GRID LAYOUT */}
          <div className="flex flex-col lg:flex-row gap-6 items-start">

            {/* LEFT COLUMN: Promos & Info */}
            <div className="w-full lg:w-[270px] flex-shrink-0 flex flex-col gap-5">
              {/* Promo Banner 1 */}
              <div className="relative rounded-xl overflow-hidden h-[340px] shadow-sm group">
                <img
                  src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80"
                  alt="Fresh Products"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-5 flex flex-col justify-between text-white">
                  <div>
                    <span className="text-xs uppercase font-medium text-emerald-300">
                      Best Bakery Products
                    </span>
                    <h4 className="text-xl font-bold mt-1 leading-tight">
                      Freshest Products every hour.
                    </h4>
                  </div>
                  <div>
                    <p className="text-xs text-gray-200">Only from</p>
                    <p className="text-2xl font-black text-rose-400 mb-3">$24.99</p>
                    <Link
                      to="/products"
                      className="inline-block bg-[#2bbef9] hover:bg-sky-500 text-white text-xs font-bold px-4 py-2 rounded-md transition-colors"
                    >
                      Shop Now
                    </Link>
                  </div>
                </div>
              </div>

              {/* Promo Banner 2 */}
              <div className="relative rounded-xl overflow-hidden h-[220px] bg-amber-400 p-5 flex flex-col justify-between shadow-sm">
                <div>
                  <span className="text-xs uppercase font-bold text-amber-900/70">
                    Baco's Natural Foods
                  </span>
                  <h4 className="text-lg font-black text-amber-950 mt-1">
                    Special Organic Roats Burger
                  </h4>
                </div>
                <div>
                  <p className="text-xs text-amber-900">Only from</p>
                  <p className="text-2xl font-extrabold text-rose-600">$14.99</p>
                </div>
              </div>

              {/* Side Info Features */}
              <div className="bg-white rounded-xl p-4 border border-gray-200 flex flex-col gap-3 text-xs text-gray-600 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="text-base">📱</span>
                  <p>Download the App for your Phone.</p>
                </div>
                <hr className="border-gray-100" />
                <div className="flex items-center gap-3">
                  <span className="text-base">🚚</span>
                  <p>Order now so you don't miss the opportunities.</p>
                </div>
                <hr className="border-gray-100" />
                <div className="flex items-center gap-3">
                  <span className="text-base">⏰</span>
                  <p>Your order will arrive at your door in 15 minutes.</p>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Featured Products, Category Cards, New Products */}
            <div className="flex-grow w-full flex flex-col gap-6 overflow-hidden">

              {/* 3. FEATURED PRODUCTS SECTION */}
              <section className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-xs font-bold uppercase text-gray-800 tracking-wider">
                      FEATURED PRODUCTS
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Do not miss the current offers until the end of March.
                    </p>
                  </div>
                  <Link
                    to="/products"
                    className="text-xs font-semibold text-gray-500 border border-gray-200 px-3 py-1 rounded-full hover:bg-gray-50"
                  >
                    View All &rarr;
                  </Link>
                </div>

                <div className="relative group">
                  <button
                    onClick={() => scrollContainer(featuredScrollRef, "left")}
                    className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white border shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-50 hidden group-hover:flex"
                  >
                    <ChevronLeftIcon fontSize="small" />
                  </button>
                  <button
                    onClick={() => scrollContainer(featuredScrollRef, "right")}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white border shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-50 hidden group-hover:flex"
                  >
                    <ChevronRightIcon fontSize="small" />
                  </button>

                  <div
                    ref={featuredScrollRef}
                    className="flex gap-4 overflow-x-auto scroll-smooth py-2 scrollbar-none"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    {!loading &&
                      (featuredProducts.length > 0 ? featuredProducts : products)
                        ?.slice(0, 10)
                        .map((item) => (
                          <div key={item._id} className="w-[190px] flex-shrink-0">
                            <ProductCard item={item} />
                          </div>
                        ))}
                  </div>
                </div>

                {/* Promotional Category Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <div className="bg-sky-50/70 rounded-xl p-4 flex items-center justify-between border border-sky-100">
                    <div>
                      <span className="text-[10px] font-bold text-sky-600 bg-sky-200/60 px-2 py-0.5 rounded">
                        WEEKEND DISCOUNT 40%
                      </span>
                      <h4 className="font-extrabold text-gray-800 text-base mt-2">
                        Dairy & Eggs
                      </h4>
                      <p className="text-xs text-gray-500 mb-3">A different kind of grocery store</p>
                      <Link
                        to="/products"
                        className="text-xs bg-sky-200 text-sky-900 font-bold px-3 py-1.5 rounded-md hover:bg-sky-300"
                      >
                        Shop Now
                      </Link>
                    </div>
                    <img
                      src="https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=200&q=80"
                      alt="Dairy & Eggs"
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </div>

                  <div className="bg-emerald-50/70 rounded-xl p-4 flex items-center justify-between border border-emerald-100">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-200/60 px-2 py-0.5 rounded">
                        WEEKEND DISCOUNT 40%
                      </span>
                      <h4 className="font-extrabold text-gray-800 text-base mt-2">
                        Legumes & Cereals
                      </h4>
                      <p className="text-xs text-gray-500 mb-3">Feed your family the best</p>
                      <Link
                        to="/products"
                        className="text-xs bg-emerald-200 text-emerald-900 font-bold px-3 py-1.5 rounded-md hover:bg-emerald-300"
                      >
                        Shop Now
                      </Link>
                    </div>
                    <img
                      src="https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=200&q=80"
                      alt="Legumes & Cereals"
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </div>
                </div>
              </section>

              {/* 4. NEW PRODUCTS SECTION */}
              <section className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-xs font-bold uppercase text-gray-800 tracking-wider">
                      NEW PRODUCTS
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      New products with updated stocks.
                    </p>
                  </div>
                  <Link
                    to="/products"
                    className="text-xs font-semibold text-gray-500 border border-gray-200 px-3 py-1 rounded-full hover:bg-gray-50"
                  >
                    View All &rarr;
                  </Link>
                </div>

                <div className="relative group">
                  <button
                    onClick={() => scrollContainer(newScrollRef, "left")}
                    className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white border shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-50 hidden group-hover:flex"
                  >
                    <ChevronLeftIcon fontSize="small" />
                  </button>
                  <button
                    onClick={() => scrollContainer(newScrollRef, "right")}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white border shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-50 hidden group-hover:flex"
                  >
                    <ChevronRightIcon fontSize="small" />
                  </button>

                  <div
                    ref={newScrollRef}
                    className="flex gap-4 overflow-x-auto scroll-smooth py-2 scrollbar-none"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    {!loading &&
                      newProducts?.slice(0, 10).map((item) => (
                        <div key={item._id} className="w-[190px] flex-shrink-0">
                          <ProductCard item={item} />
                        </div>
                      ))}
                  </div>
                </div>
              </section>

            </div>
          </div>

        </div>
      </main>
    </>
  );
};

export default Home;