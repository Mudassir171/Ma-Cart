import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, getSliderProducts } from "../../actions/productAction";
import { getCategories } from "../../actions/categoryAction";
import { addToWishlist } from "../../actions/wishlistAction";
import { useSnackbar } from "notistack";
import MetaData from "../Layouts/MetaData";
import { Link } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import StarIcon from "@mui/icons-material/Star";
import Banner from "./Banner/Banner";

// --- 1. PRODUCT CARD (Bottom-to-Top Hover Effect & Matching UI) ---
const ProductCard = ({ item, onQuickView }) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToWishlist(item._id));
    enqueueSnackbar("Added to Wishlist!", { variant: "success" });
  };

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
    <div className="group relative bg-white border border-gray-200 rounded-md p-3 flex flex-col justify-between h-full transition-all duration-300 hover:shadow-xl hover:border-green-500 overflow-hidden">
      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <span className="absolute top-2 left-2 z-10 bg-[#2bbef9] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">
          {discountPercentage}% OFF
        </span>
      )}

      {/* Action Buttons: Nichay say uper slide hovering effect */}
      <div className="absolute top-2 right-2 z-20 flex flex-col gap-1.5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
        <button
          type="button"
          onClick={handleQuickViewClick}
          className="w-[40px] h-[40px] rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-white-500 hover:bg-green-600 hover:text-white transition-colors cursor-pointer"
          title="Quick View"
        >
          <OpenInFullIcon className="!text-xs" />
        </button>
        <button
          type="button"
          onClick={handleWishlist}
          className="w-[40px] h-[40px] rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-green-600 hover:text-white transition-colors cursor-pointer"
          title="Add to Wishlist"
        >
          <FavoriteBorderIcon className="!text-xs" />
        </button>
      </div>

      {/* Product Image */}
    <div className="w-[200px] h-[200px] flex items-center justify-center mx-auto overflow-hidden my-1">
  <img
    src={
      item.images?.[0]?.url ||
      item.image ||
      "https://via.placeholder.com/150"
    }
    alt={item.name}
    className="w-[200px] h-[200px] object-contain transition-transform duration-300 group-hover:scale-105"
  />
</div>

      {/* Details */}
      <div className="flex flex-col gap-1 mt-1">
        <h4 className="text-[13px] font-bold text-gray-700 line-clamp-2 h-7 leading-tight hover:text-green-400 transition-colors">
          {item.name}
        </h4>

        <span className="text-[13px] text-green-500 uppercase tracking-wider">
          {item.stock > 0 || item.Stock > 0 ? "IN STOCK" : "OUT OF STOCK"}
        </span>

        {/* Rating */}
        <div className="flex items-center text-yellow-400 my-0.5">
          {[...Array(5)].map((_, i) => (
            <StarIcon
              key={i}
              className={`!text-[20px] ${
                i < Math.floor(item.ratings || 4)
                  ? "text-amber-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mt-0.5">
          {item.cuttedPrice && (
            <span className="text-[13px] text-gray-400 line-through font-medium">
              Rs:{item.cuttedPrice}
            </span>
          )}
          <span className="text-[15px] font-bold text-red-500">
            Rs:{item.price}
          </span>
        </div>
      </div>

      {/* View Product Button (Hover Background Green 600) */}
      <Link
        to={`/product/${item._id}`}
        className="mt-3 w-full text-center py-1.5 border border-[#2bbef9] text-[#2bbef9] hover:bg-green-600 hover:border-green-600 hover:text-white text-[11px] font-bold rounded-full transition-all duration-300 block"
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
        left:
          direction === "left"
            ? scrollLeft - clientWidth * 0.5
            : scrollLeft + clientWidth * 0.5,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full relative bg-white border border-gray-200 rounded-md p-4">
      <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-3">
        FEATURED CATEGORIES
      </h3>

      <div className="relative group">
        <button
          type="button"
          onClick={() => scroll("left")}
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white border shadow-md flex items-center justify-center text-gray-600 hover:bg-emerald-600 hover:text-white transition-colors"
        >
          <ChevronLeftIcon fontSize="small" />
        </button>
        <button
          type="button"
          onClick={() => scroll("right")}
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white border shadow-md flex items-center justify-center text-gray-600 hover:bg-emerald-600 hover:text-white transition-colors"
        >
          <ChevronRightIcon fontSize="small" />
        </button>

        <div
          ref={catRef}
          className="flex overflow-x-auto scroll-smooth divide-x divide-gray-200 border-y border-gray-200 scrollbar-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {loading
            ? [...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="min-w-[150px] flex-1 p-4 flex flex-col items-center animate-pulse"
                >
                  <div className="w-14 h-14 bg-gray-200 rounded-full mb-2"></div>
                  <div className="h-3 w-16 bg-gray-200 rounded"></div>
                </div>
              ))
            : categories &&
              categories.map((cat) => (
                <Link
                  key={cat._id}
                  to={`/products?category=${encodeURIComponent(cat.name)}`}
                  className="min-w-[150px] h-[200px] flex-1 flex flex-col items-center justify-center p-3 bg-white text-center hover:bg-gray-50 transition-colors cursor-pointer group"
                >
                  <img
                    src={cat.image?.url || "https://via.placeholder.com/150"}
                    alt={cat.name}
                    className="w-[100px] h-[100px] object-contain mb-2 group-hover:scale-105 transition-transform duration-300"
                  />
                  <h5 className="text-[15px] font-bold text-gray-800 leading-tight mb-0.5">
                    {cat.name}
                  </h5>
                  <span className="text-[12px] text-gray-400 font-medium">
                    {cat.numOfProducts
                      ? `${cat.numOfProducts} Items`
                      : "Explore"}
                  </span>
                </Link>
              ))}
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
  const [selectedQuickViewProduct, setSelectedQuickViewProduct] =
    useState(null);

  const featuredScrollRef = useRef(null);
  const newScrollRef = useRef(null);

  const scrollContainer = (ref, direction) => {
    if (ref.current) {
      const { scrollLeft, clientWidth } = ref.current;
      ref.current.scrollTo({
        left:
          direction === "left"
            ? scrollLeft - clientWidth * 0.75
            : scrollLeft + clientWidth * 0.75,
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
          ? Math.round(
              ((item.cuttedPrice - item.price) / item.cuttedPrice) * 100
            )
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
          {/* BANNER 1: HERO TOP BANNER */}
          <div className="w-full relative h-[300px] rounded-xl overflow-hidden bg-white shadow-sm flex items-center justify-between">
            <Banner />
          </div>

          {/* DYNAMIC CATEGORIES SECTION */}
          <FeaturedCategoriesSection />

          {/* MAIN GRID LAYOUT */}
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* LEFT SIDEBAR BANNERS */}
            <div className="w-full lg:w-[260px] flex-shrink-0 flex flex-col gap-5">
              {/* BANNER 2: BAKERY */}
              <div className="relative rounded-xl overflow-hidden h-[290px] shadow-sm group">
                <img
                  src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80"
                  alt="Fresh Products"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-5 flex flex-col justify-between text-white">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300">
                      Baco Natural Foods
                    </span>
                    <h4 className="text-lg font-black mt-1 leading-tight">
                      Freshest Products every hour.
                    </h4>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-300">Only from</p>
                    <p className="text-xl font-black text-rose-500 mb-2">
                      $24.99
                    </p>
                    <Link
                      to="/products"
                      className="inline-block bg-[#2bbef9] hover:bg-emerald-600 text-white text-[11px] font-bold px-4 py-1.5 rounded-full transition-colors"
                    >
                      Shop Now
                    </Link>
                  </div>
                </div>
              </div>

              {/* BANNER 3: BURGER (YELLOW THEME) */}
              <div className="relative rounded-xl overflow-hidden h-[210px] shadow-sm group bg-[#f5cb42]">
                <img
                  src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
                  alt="Organic Burger"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent p-4 flex flex-col justify-between text-white">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-200">
                      Baco Natural Foods
                    </span>
                    <h4 className="text-base font-extrabold mt-0.5 leading-tight">
                      Special Organic Roast Burger
                    </h4>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-200">Only from</p>
                    <p className="text-lg font-black text-rose-500">
                      $14.99
                    </p>
                  </div>
                </div>
              </div>

              {/* SIDE INFO FEATURES */}
              <div className="bg-white rounded-xl p-4 border border-gray-200 flex flex-col gap-3 text-[11px] text-gray-600 shadow-sm">
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

            {/* RIGHT CONTENT AREA */}
            <div className="flex-grow w-full flex flex-col gap-6 overflow-hidden">
              {/* FEATURED PRODUCTS SECTION */}
              <section className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-xs font-extrabold uppercase text-gray-800 tracking-wider">
                      FEATURED PRODUCTS
                    </h3>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Do not miss the current offers until the end of March.
                    </p>
                  </div>
                  <Link
                    to="/products"
                    className="text-[11px] font-semibold text-gray-500 border border-gray-200 px-3 py-1 rounded-full hover:bg-emerald-600 hover:text-white transition-colors"
                  >
                    View All &rarr;
                  </Link>
                </div>

                <div className="relative group">
                  <button
                    type="button"
                    onClick={() => scrollContainer(featuredScrollRef, "left")}
                    className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white border shadow-md flex items-center justify-center text-gray-600 hover:bg-emerald-600 hover:text-white transition-colors hidden group-hover:flex"
                  >
                    <ChevronLeftIcon fontSize="small" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollContainer(featuredScrollRef, "right")}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white border shadow-md flex items-center justify-center text-gray-600 hover:bg-emerald-600 hover:text-white transition-colors hidden group-hover:flex"
                  >
                    <ChevronRightIcon fontSize="small" />
                  </button>

                  <div
                    ref={featuredScrollRef}
                    className="flex gap-3 overflow-x-auto scroll-smooth py-2 scrollbar-none"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    {!loading &&
                      (featuredProducts.length > 0
                        ? featuredProducts
                        : products
                      )
                        ?.slice(0, 10)
                        .map((item) => (
                          <div
                            key={item._id}
                            className="w-[185px] flex-shrink-0"
                          >
                            <ProductCard
                              item={item}
                              onQuickView={(prod) =>
                                setSelectedQuickViewProduct(prod)
                              }
                            />
                          </div>
                        ))}
                  </div>
                </div>

                {/* PROMO CARDS (MIDDLE BANNERS) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <div className="bg-[#f0f3f8] rounded-xl p-4 flex items-center justify-between border border-gray-200">
                    <div>
                      <span className="text-[9px] font-extrabold text-sky-600 bg-sky-100 px-2 py-0.5 rounded">
                        WEEKEND DISCOUNT 40%
                      </span>
                      <h4 className="font-black text-gray-800 text-sm mt-2">
                        Dairy & Eggs
                      </h4>
                      <p className="text-[10px] text-gray-500 mb-3">
                        A different kind of grocery store
                      </p>
                      <Link
                        to="/products"
                        className="text-[10px] bg-gray-300 hover:bg-emerald-600 hover:text-white text-gray-700 font-bold px-3 py-1.5 rounded-full transition-colors"
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

                  <div className="bg-[#f0f3f8] rounded-xl p-4 flex items-center justify-between border border-gray-200">
                    <div>
                      <span className="text-[9px] font-extrabold text-sky-600 bg-sky-100 px-2 py-0.5 rounded">
                        WEEKEND DISCOUNT 40%
                      </span>
                      <h4 className="font-black text-gray-800 text-sm mt-2">
                        Legumes & Cereals
                      </h4>
                      <p className="text-[10px] text-gray-500 mb-3">
                        Feed your family the best
                      </p>
                      <Link
                        to="/products"
                        className="text-[10px] bg-gray-300 hover:bg-emerald-600 hover:text-white text-gray-700 font-bold px-3 py-1.5 rounded-full transition-colors"
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

              {/* NEW PRODUCTS SECTION (2-ROW GRID) */}
              <section className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-xs font-extrabold uppercase text-gray-800 tracking-wider">
                      NEW PRODUCTS
                    </h3>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      New products with updated stocks.
                    </p>
                  </div>
                  <Link
                    to="/products"
                    className="text-[11px] font-semibold text-gray-500 border border-gray-200 px-3 py-1 rounded-full hover:bg-emerald-600 hover:text-white transition-colors"
                  >
                    View All &rarr;
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {!loading &&
                    newProducts?.slice(0, 8).map((item) => (
                      <div key={item._id} className="w-full">
                        <ProductCard
                          item={item}
                          onQuickView={(prod) =>
                            setSelectedQuickViewProduct(prod)
                          }
                        />
                      </div>
                    ))}
                </div>
              </section>
            </div>
          </div>

          {/* BOTTOM BANNERS ROW */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            {/* BOTTOM BANNER 1 */}
            <div className="relative rounded-xl overflow-hidden h-[160px] bg-[#00a862] p-5 flex items-center justify-between text-white shadow-sm group">
              <div>
                <h4 className="text-lg font-black leading-tight">
                  Organic <br /> Breakfasts
                </h4>
                <p className="text-[10px] text-emerald-100 mt-1 mb-3">
                  Baco Natural Discount
                </p>
                <Link
                  to="/products"
                  className="bg-blue-900 hover:bg-emerald-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-full inline-block transition-colors"
                >
                  Shop Now
                </Link>
              </div>
              <img
                src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=200&q=80"
                alt="Organic Breakfast"
                className="w-24 h-24 object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* BOTTOM BANNER 2 */}
            <div className="relative rounded-xl overflow-hidden h-[160px] bg-[#fce0c5] p-5 flex items-center justify-between text-gray-800 shadow-sm group">
              <div>
                <h4 className="text-lg font-black leading-tight">
                  Organic <br /> Baby Food
                </h4>
                <p className="text-[10px] text-gray-500 mt-1 mb-3">
                  Baco Natural Discount
                </p>
                <Link
                  to="/products"
                  className="bg-rose-500 hover:bg-emerald-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full inline-block transition-colors"
                >
                  Shop Now
                </Link>
              </div>
              <img
                src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=200&q=80"
                alt="Baby Food"
                className="w-24 h-24 object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* BOTTOM BANNER 3 */}
            <div className="relative rounded-xl overflow-hidden h-[160px] bg-[#f0e7d8] p-5 flex items-center justify-between text-gray-800 shadow-sm group">
              <div>
                <h4 className="text-lg font-black leading-tight">
                  Organic <br /> Breakfast
                </h4>
                <p className="text-[10px] text-gray-500 mt-1 mb-3">
                  Baco Natural Discount
                </p>
                <Link
                  to="/products"
                  className="bg-rose-500 hover:bg-emerald-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full inline-block transition-colors"
                >
                  Shop Now
                </Link>
              </div>
              <img
                src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=200&q=80"
                alt="Organic Breakfast"
                className="w-24 h-24 object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
              />
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
                src={
                  selectedQuickViewProduct.images?.[0]?.url ||
                  selectedQuickViewProduct.image
                }
                alt={selectedQuickViewProduct.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-800">
                {selectedQuickViewProduct.name}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {selectedQuickViewProduct.description ||
                  "High quality product from our store."}
              </p>
              <div className="flex items-center gap-3 mt-3">
                <span className="text-xl font-black text-rose-500">
                  Rs:{selectedQuickViewProduct.price}
                </span>
                {selectedQuickViewProduct.cuttedPrice && (
                  <span className="text-xs text-gray-400 line-through">
                    Rs:{selectedQuickViewProduct.cuttedPrice}
                  </span>
                )}
              </div>
            </div>
            <Link
              to={`/product/${selectedQuickViewProduct._id}`}
              onClick={() => setSelectedQuickViewProduct(null)}
              className="w-full text-center py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors"
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