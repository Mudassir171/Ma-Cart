import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, getSliderProducts } from "../../actions/productAction";
import { getCategories } from "../../actions/categoryAction";
import { addToWishlist } from "../../actions/wishlistAction"; // ✅ FIX: Correct function name imported
import { useSnackbar } from "notistack";
import MetaData from "../Layouts/MetaData";
import { Link } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import StarIcon from "@mui/icons-material/Star";

// --- 1. ISOLATED PRODUCT CARD WITH HANDLERS ---
const ProductCard = ({ item, onQuickView }) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [isHovered, setIsHovered] = useState(false);

  // Wishlist Click Handler
  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToWishlist(item._id)); // ✅ FIX: Using correct action function
    enqueueSnackbar("Added to Wishlist!", { variant: "success" });
  };

  // Quick View Click Handler
  const handleQuickViewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(item);
    } else {
      enqueueSnackbar(`Quick View: ${item.name}`, { variant: "info" });
    }
  };

  const discountPercentage =
    item.discount ||
    (item.cuttedPrice && item.price
      ? Math.round(((item.cuttedPrice - item.price) / item.cuttedPrice) * 100)
      : 0);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white border border-gray-200 rounded-md p-3 flex flex-col justify-between h-full transition-all duration-300 hover:shadow-lg"
    >
      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <span className="absolute top-2 left-2 z-10 bg-[#2bbef9] text-white text-[11px] font-bold px-2 py-0.5 rounded-sm">
          {discountPercentage}% OFF
        </span>
      )}

      {/* Action Buttons on Hover */}
      <div
        className={`absolute top-2 right-2 z-10 flex flex-col gap-1.5 transition-opacity duration-200 ${
          isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <button
          type="button"
          onClick={handleQuickViewClick}
          className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:bg-sky-50 hover:text-sky-500 transition-colors cursor-pointer"
          title="Quick View"
        >
          <OpenInFullIcon className="!text-sm" />
        </button>
        <button
          type="button"
          onClick={handleWishlist}
          className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:bg-rose-50 hover:text-rose-500 transition-colors cursor-pointer"
          title="Add to Wishlist"
        >
          <FavoriteBorderIcon className="!text-sm" />
        </button>
      </div>

      {/* Image */}
      <div className="w-full h-36 flex items-center justify-center p-2 overflow-hidden my-1">
        <img
          src={item.images?.[0]?.url || item.image || "https://via.placeholder.com/150"}
          alt={item.name}
          className={`max-h-full max-w-full object-contain transition-transform duration-300 ${
            isHovered ? "scale-105" : "scale-100"
          }`}
        />
      </div>

      {/* Details */}
      <div className="flex flex-col gap-1 mt-2">
        <h4 className="text-xs font-semibold text-gray-800 line-clamp-2 h-8 leading-snug">
          {item.name}
        </h4>

        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wide">
          {item.stock > 0 || item.Stock > 0 ? "IN STOCK" : "OUT OF STOCK"}
        </span>

        {/* Rating */}
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

        {/* Price */}
        <div className="flex items-center gap-2 mt-1">
          {item.cuttedPrice && (
            <span className="text-xs text-gray-400 line-through font-semibold">
              ${item.cuttedPrice}
            </span>
          )}
          <span className="text-sm font-black text-rose-500">${item.price}</span>
        </div>
      </div>

      <Link
        to={`/product/${item._id}`}
        className="mt-3 w-full text-center py-1.5 bg-[#2bbef9] hover:bg-sky-500 text-white text-xs font-bold rounded-full transition-colors block"
      >
        View Product
      </Link>
    </div>
  );
};

// --- 2. DYNAMIC CATEGORIES SLIDER ---
const FeaturedCategoriesSection = () => {
  const { categories, loading } = useSelector((state) => state.allCategories);
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
          type="button"
          onClick={() => scroll("left")}
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white border shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-50"
        >
          <ChevronLeftIcon fontSize="small" />
        </button>
        <button
          type="button"
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
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="min-w-[160px] flex-1 p-4 flex flex-col items-center animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-full mb-2"></div>
                <div className="h-3 w-20 bg-gray-200 rounded"></div>
              </div>
            ))
          ) : (
            categories &&
            categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="min-w-[160px] flex-1 flex flex-col items-center justify-center p-4 bg-white text-center hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <img
                  src={cat.image?.url || "https://via.placeholder.com/150"}
                  alt={cat.name}
                  className="w-16 h-16 object-contain mb-2"
                />
                <h5 className="text-xs font-bold text-gray-800 leading-tight mb-0.5">{cat.name}</h5>
                <span className="text-[10px] text-gray-400 font-medium">
                  {cat.numOfProducts ? `${cat.numOfProducts} Items` : "Explore"}
                </span>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// --- 3. MAIN HOME COMPONENT ---
const Home = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { error, loading, products } = useSelector((state) => state.products);
  const [selectedQuickViewProduct, setSelectedQuickViewProduct] = useState(null);

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
    dispatch(getCategories());
  }, [dispatch, error, enqueueSnackbar]);

  const featuredProducts =
    products?.filter((item) => {
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

          {/* BANNER 1: MAIN TOP HERO BANNER */}
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

          {/* DYNAMIC CATEGORIES SECTION */}
          <FeaturedCategoriesSection />

          {/* MAIN GRID LAYOUT */}
          <div className="flex flex-col lg:flex-row gap-6 items-start">

            {/* LEFT SIDE BANNERS (CONTAINING 5 BANNERS IN TOTAL) */}
            <div className="w-full lg:w-[270px] flex-shrink-0 flex flex-col gap-5">

              {/* BANNER 2: SIDE BAKERY BANNER */}
              <div className="relative rounded-xl overflow-hidden h-[300px] shadow-sm group">
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

              {/* BANNER 3: SIDE ORGANIC BURGER BANNER */}
              <div className="relative rounded-xl overflow-hidden h-[200px] bg-amber-400 p-5 flex flex-col justify-between shadow-sm">
                <div>
                  <span className="text-xs uppercase font-bold text-amber-900/70">
                    Baco's Natural Foods
                  </span>
                  <h4 className="text-lg font-black text-amber-950 mt-1">
                    Special Organic Roast Burger
                  </h4>
                </div>
                <div>
                  <p className="text-xs text-amber-900">Only from</p>
                  <p className="text-2xl font-extrabold text-rose-600">$14.99</p>
                </div>
              </div>

              {/* BANNER 4: SIDE FRESH BEVERAGES BANNER */}
              <div className="relative rounded-xl overflow-hidden h-[200px] bg-sky-500 p-5 flex flex-col justify-between text-white shadow-sm">
                <div>
                  <span className="text-xs uppercase font-bold text-sky-100">
                    100% Pure Juices
                  </span>
                  <h4 className="text-lg font-black mt-1 leading-tight">
                    Cold Pressed Fresh Juices
                  </h4>
                </div>
                <div>
                  <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded">
                    30% OFF THIS WEEK
                  </span>
                </div>
              </div>

              {/* BANNER 5: SIDE SNACK DISCOUNTS BANNER */}
              <div className="relative rounded-xl overflow-hidden h-[180px] bg-rose-500 p-5 flex flex-col justify-between text-white shadow-sm">
                <div>
                  <span className="text-xs uppercase font-bold text-rose-100">
                    Snack Time Special
                  </span>
                  <h4 className="text-lg font-extrabold mt-1">
                    Chocolates & Biscuits
                  </h4>
                </div>
                <Link
                  to="/products"
                  className="inline-block bg-white text-rose-600 text-xs font-bold px-3 py-1.5 rounded-full self-start hover:bg-rose-50 transition-colors"
                >
                  Buy Now
                </Link>
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

            {/* RIGHT MAIN CONTENT AREA */}
            <div className="flex-grow w-full flex flex-col gap-6 overflow-hidden">

              {/* FEATURED PRODUCTS SECTION */}
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
                    type="button"
                    onClick={() => scrollContainer(featuredScrollRef, "left")}
                    className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white border shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-50 hidden group-hover:flex"
                  >
                    <ChevronLeftIcon fontSize="small" />
                  </button>
                  <button
                    type="button"
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
                            <ProductCard
                              item={item}
                              onQuickView={(prod) => setSelectedQuickViewProduct(prod)}
                            />
                          </div>
                        ))}
                  </div>
                </div>

                {/* MID GRID PROMO CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <div className="bg-sky-50/70 rounded-xl p-4 flex items-center justify-between border border-sky-100">
                    <div>
                      <span className="text-[10px] font-bold text-sky-600 bg-sky-200/60 px-2 py-0.5 rounded">
                        WEEKEND DISCOUNT 40%
                      </span>
                      <h4 className="font-extrabold text-gray-800 text-base mt-2">
                        Dairy & Eggs
                      </h4>
                      <p className="text-xs text-gray-500 mb-3">
                        A different kind of grocery store
                      </p>
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

              {/* NEW PRODUCTS SECTION */}
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
                    type="button"
                    onClick={() => scrollContainer(newScrollRef, "left")}
                    className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white border shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-50 hidden group-hover:flex"
                  >
                    <ChevronLeftIcon fontSize="small" />
                  </button>
                  <button
                    type="button"
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
                          <ProductCard
                            item={item}
                            onQuickView={(prod) => setSelectedQuickViewProduct(prod)}
                          />
                        </div>
                      ))}
                  </div>
                </div>
              </section>

            </div>
          </div>

        </div>
      </main>

      {/* QUICK VIEW POPUP MODAL */}
      {selectedQuickViewProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 relative flex flex-col gap-4 shadow-2xl">
            <button
              onClick={() => setSelectedQuickViewProduct(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-lg font-bold"
            >
              ✕
            </button>
            <div className="w-full h-48 flex items-center justify-center border-b pb-4">
              <img
                src={selectedQuickViewProduct.images?.[0]?.url || selectedQuickViewProduct.image}
                alt={selectedQuickViewProduct.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-800">
                {selectedQuickViewProduct.name}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {selectedQuickViewProduct.description || "High quality product from our store."}
              </p>
              <div className="flex items-center gap-3 mt-3">
                <span className="text-xl font-black text-rose-500">
                  ${selectedQuickViewProduct.price}
                </span>
                {selectedQuickViewProduct.cuttedPrice && (
                  <span className="text-xs text-gray-400 line-through">
                    ${selectedQuickViewProduct.cuttedPrice}
                  </span>
                )}
              </div>
            </div>
            <Link
              to={`/product/${selectedQuickViewProduct._id}`}
              onClick={() => setSelectedQuickViewProduct(null)}
              className="w-full text-center py-2 bg-[#2bbef9] text-white font-bold rounded-lg text-xs hover:bg-sky-500"
            >
              Full Details & Purchase
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;