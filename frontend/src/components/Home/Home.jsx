import { useEffect, useState, useRef } from "react";
import Categories from "../Layouts/Categories";
import Banner from "./Banner/Banner";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, getSliderProducts } from "../../actions/productAction";
import { useSnackbar } from "notistack";
import MetaData from "../Layouts/MetaData";
import Product from "./ProductSlider/Product";
import { Link } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const Home = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { error, loading, products } = useSelector((state) => state.products);

  const featuredScrollRef = useRef(null);
  const newScrollRef = useRef(null);

  const scrollContainer = (ref, direction) => {
    if (ref.current) {
      const { scrollLeft, clientWidth } = ref.current;
      const scrollAmount = clientWidth * 0.75;
      ref.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
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

  // Featured / Discounted products
  const featuredProducts = products?.filter((item) => {
    const disc =
      item.discount ||
      (item.cuttedPrice && item.price
        ? Math.round(((item.cuttedPrice - item.price) / item.cuttedPrice) * 100)
        : 0);
    return disc > 0;
  }) || [];

  // New products sorted by latest date
  const newProducts = products
    ? [...products].sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      )
    : [];

  return (
    <>
      <MetaData title="Ma-Cart | Online Shopping Site" />

      <main className="w-full bg-[#f8f9fa] min-h-screen pb-12 pt-4">
        <div className="max-w-[1360px] mx-auto px-2 sm:px-4 flex flex-col gap-8">
          
          {/* 1. TOP MAIN BANNER */}
          <div className="w-full bg-white rounded-xl shadow-sm overflow-hidden">
            <Banner />
          </div>

          {/* 2. FEATURED CATEGORIES SECTION */}
          <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
              FEATURED CATEGORIES
            </h3>
            <Categories />
          </section>

          {/* MAIN CONTENT GRID (Left Banners + Right Products Layout) */}
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            
            {/* LEFT COLUMN: Promo Side Banners & Mini Info */}
            <div className="w-full lg:w-[280px] flex-shrink-0 flex flex-col gap-5">
              {/* Top Side Banner */}
              <div className="relative rounded-xl overflow-hidden h-[340px] shadow-sm group">
                <img
                  src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80"
                  alt="Fresh Products"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-5 flex flex-col justify-between text-white">
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
                      className="inline-block bg-sky-400 hover:bg-sky-500 text-white text-xs font-bold px-4 py-2 rounded-md transition-colors"
                    >
                      Shop Now
                    </Link>
                  </div>
                </div>
              </div>

              {/* Bottom Side Banner */}
              <div className="relative rounded-xl overflow-hidden h-[240px] bg-amber-400 p-5 flex flex-col justify-between shadow-sm">
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
              <div className="bg-white rounded-xl p-4 border border-gray-100 flex flex-col gap-4 text-xs text-gray-600 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="text-lg">📱</span>
                  <p>Download the App for your Phone.</p>
                </div>
                <hr className="border-gray-100" />
                <div className="flex items-center gap-3">
                  <span className="text-lg">🚚</span>
                  <p>Order now so you don't miss the opportunities.</p>
                </div>
                <hr className="border-gray-100" />
                <div className="flex items-center gap-3">
                  <span className="text-lg">⏰</span>
                  <p>Your order will arrive at your door in 15 minutes.</p>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Featured Products, Category Cards & New Products */}
            <div className="flex-grow w-full flex flex-col gap-6 overflow-hidden">
              
              {/* 3. FEATURED PRODUCTS SECTION */}
              <section className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 relative">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-black uppercase text-gray-800 tracking-tight">
                      FEATURED PRODUCTS
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Do not miss the current offers until the end of March.
                    </p>
                  </div>
                  <Link
                    to="/products"
                    className="text-xs font-semibold text-gray-500 border border-gray-200 px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors"
                  >
                    View All &rarr;
                  </Link>
                </div>

                {/* Featured Products Scroll Track */}
                <div className="relative group">
                  <button
                    onClick={() => scrollContainer(featuredScrollRef, "left")}
                    className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 bg-white border shadow-md p-1.5 rounded-full text-gray-700 hover:bg-gray-100 hidden group-hover:flex"
                  >
                    <ChevronLeftIcon fontSize="small" />
                  </button>
                  <button
                    onClick={() => scrollContainer(featuredScrollRef, "right")}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 bg-white border shadow-md p-1.5 rounded-full text-gray-700 hover:bg-gray-100 hidden group-hover:flex"
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
                          <div
                            key={item._id}
                            className="w-[200px] flex-shrink-0 bg-white border border-gray-100 rounded-lg p-2 hover:shadow-md transition-shadow"
                          >
                            <Product {...item} />
                          </div>
                        ))}
                  </div>
                </div>

                {/* Promotional Category Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <div className="bg-sky-50 rounded-xl p-4 flex items-center justify-between border border-sky-100">
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
                        className="text-xs bg-sky-200 text-sky-900 font-bold px-3 py-1.5 rounded-md hover:bg-sky-300 transition-colors"
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

                  <div className="bg-emerald-50 rounded-xl p-4 flex items-center justify-between border border-emerald-100">
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
                        className="text-xs bg-emerald-200 text-emerald-900 font-bold px-3 py-1.5 rounded-md hover:bg-emerald-300 transition-colors"
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
              <section className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 relative">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-black uppercase text-gray-800 tracking-tight">
                      NEW PRODUCTS
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      New products with updated stocks.
                    </p>
                  </div>
                  <Link
                    to="/products"
                    className="text-xs font-semibold text-gray-500 border border-gray-200 px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors"
                  >
                    View All &rarr;
                  </Link>
                </div>

                {/* New Products Scroll Track */}
                <div className="relative group">
                  <button
                    onClick={() => scrollContainer(newScrollRef, "left")}
                    className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 bg-white border shadow-md p-1.5 rounded-full text-gray-700 hover:bg-gray-100 hidden group-hover:flex"
                  >
                    <ChevronLeftIcon fontSize="small" />
                  </button>
                  <button
                    onClick={() => scrollContainer(newScrollRef, "right")}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 bg-white border shadow-md p-1.5 rounded-full text-gray-700 hover:bg-gray-100 hidden group-hover:flex"
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
                        <div
                          key={item._id}
                          className="w-[200px] flex-shrink-0 bg-white border border-gray-100 rounded-lg p-2 hover:shadow-md transition-shadow"
                        >
                          <Product {...item} />
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