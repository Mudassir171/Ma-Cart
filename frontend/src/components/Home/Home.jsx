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

// --- Sub-component for individual product timers in Discounted/Deals Section ---
const DealProductItem = ({ item }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetTime = item.dealExpiry ? new Date(item.dealExpiry).getTime() : new Date().getTime() + 86400000 * 3;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [item.dealExpiry]);

  const discountPercentage = item.discount || (item.cuttedPrice && item.price
    ? Math.round(((item.cuttedPrice - item.price) / item.cuttedPrice) * 100)
    : 0);

  return (
    <div className="min-w-[50%] sm:min-w-[210px] border-r border-gray-200 p-2 sm:p-3 flex flex-col justify-between relative bg-white flex-shrink-0 group hover:shadow-md transition-all">
      {discountPercentage > 0 && (
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 bg-pink-100 text-rose-600 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
          -{discountPercentage}%
        </div>
      )}
      <Product {...item} />
      
      <div className="mt-2 pt-2 border-t border-gray-100">
        <p className="text-[10px] text-gray-500 text-center mb-1 font-medium">Offers ends in:</p>
        <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-gray-800 bg-gray-50 py-1 rounded">
          <span>{String(timeLeft.days).padStart(2, '0')}d</span>:
          <span>{String(timeLeft.hours).padStart(2, '0')}h</span>:
          <span>{String(timeLeft.minutes).padStart(2, '0')}m</span>:
          <span>{String(timeLeft.seconds).padStart(2, '0')}s</span>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { error, loading, products } = useSelector((state) => state.products);

  // --- Scroll References ---
  const latestScrollRef = useRef(null);
  const dealsScrollRef = useRef(null);

  const scrollLatest = (direction) => {
    if (latestScrollRef.current) {
      const { scrollLeft, clientWidth } = latestScrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      latestScrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollDeals = (direction) => {
    if (dealsScrollRef.current) {
      const { scrollLeft, clientWidth } = dealsScrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      dealsScrollRef.current.scrollTo({
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

  // --- 1. Latest Products (Sorted by newest first) ---
  const latestProducts = products 
    ? [...products].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    : [];

  // --- 2. Discounted / Deal Products ---
  const discountedProducts = products?.filter((item) => {
    const disc = item.discount || (item.cuttedPrice && item.price ? Math.round(((item.cuttedPrice - item.price) / item.cuttedPrice) * 100) : 0);
    return disc > 0;
  });

  return (
    <>
      <MetaData title="Ma-Cart | Online Shopping Site" />

      <main className="w-full bg-[#f4f4f4] min-h-screen pb-10 overflow-x-hidden mt-5">
        
        <div className="w-full mt-12 bg-white shadow-sm">
          <Banner />
        </div>

        <div className="max-w-[1360px] mx-auto px-2 sm:px-4 flex flex-col gap-6">

          {/* --- CATEGORIES SECTION (Matching Categories page design & structure) --- */}
          <section className="bg-white mt-2 mb-2 w-full shadow-sm rounded-sm overflow-hidden border border-gray-100">
            <div className="p-2">
              <Categories />
            </div>
          </section>

{latestProducts && latestProducts.length > 0 && (
    <section className="bg-gradient-to-b from-white to-gray-50/50 my-6 w-full shadow-md rounded-2xl overflow-hidden relative border border-emerald-100/60 p-4 md:p-6">
        
        {/* --- Header Section --- */}
        <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
                <div className="h-6 w-1.5 bg-emerald-600 rounded-full"></div>
                <h2 className="text-lg md:text-xl font-extrabold text-emerald-900 tracking-tight">
                    Latest Products
                </h2>
            </div>

            <Link 
                to="/products" 
                className="group relative inline-flex items-center gap-2 px-5 py-2 text-xs md:text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all duration-300 shadow-sm"
            >
                <span>View All</span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
            </Link>
        </div>

        {/* --- Floating Scroll Navigation Arrows --- */}
        {latestProducts.length >= 4 && (
            <>
                <button 
                    onClick={() => scrollLatest("left")} 
                    aria-label="Scroll Left"
                    className="absolute left-2 top-[58%] -translate-y-1/2 z-30 bg-white/90 hover:bg-emerald-600 hover:text-white text-emerald-900 shadow-lg border border-emerald-100 p-2.5 rounded-full hidden sm:flex items-center justify-center cursor-pointer transition-all duration-300 backdrop-blur-md"
                >
                    <ChevronLeftIcon fontSize="small" />
                </button>
                <button 
                    onClick={() => scrollLatest("right")} 
                    aria-label="Scroll Right"
                    className="absolute right-2 top-[58%] -translate-y-1/2 z-30 bg-white/90 hover:bg-emerald-600 hover:text-white text-emerald-900 shadow-lg border border-emerald-100 p-2.5 rounded-full hidden sm:flex items-center justify-center cursor-pointer transition-all duration-300 backdrop-blur-md"
                >
                    <ChevronRightIcon fontSize="small" />
                </button>
            </>
        )}

        {/* --- Product Horizontal Scroll Track (Limited to 30 Products) --- */}
        <div 
            ref={latestScrollRef}
            className="flex items-stretch overflow-x-auto scroll-smooth scrollbar-none gap-4 py-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
            {!loading && latestProducts.slice(0, 30).map((item) => {
                return (
                    <div 
                        key={item._id} 
                        className="min-w-[160px] sm:min-w-[210px] md:min-w-[230px] flex-shrink-0"
                    >
                        {/* Passes data directly into your newly styled <Product /> component */}
                        <Product {...item} />
                    </div>
                );
            })}
        </div>
    </section>
)}
{/* --- 2. DISCOUNTED / DEALS PRODUCTS SECTION --- */}
{discountedProducts && discountedProducts.length > 0 && (
    <section className="bg-gradient-to-b from-white to-gray-50/50 my-6 w-full shadow-md rounded-2xl overflow-hidden relative border border-emerald-100/60 p-4 md:p-6">
        
        {/* --- Header Section --- */}
        <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
                <div className="h-6 w-1.5 bg-emerald-600 rounded-full"></div>
                <h2 className="text-lg md:text-xl font-extrabold text-emerald-950 tracking-tight">
                    Special Discounts & Offers
                </h2>
            </div>

            <Link 
                to="/products" 
                className="group relative inline-flex items-center gap-2 px-5 py-2 text-xs md:text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all duration-300 shadow-sm"
            >
                <span>View All</span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
            </Link>
        </div>

        {/* --- Floating Scroll Navigation Arrows --- */}
        {discountedProducts.length >= 4 && (
            <>
                <button 
                    onClick={() => scrollDeals("left")} 
                    aria-label="Scroll Left"
                    className="absolute left-2 top-[58%] -translate-y-1/2 z-30 bg-white/90 hover:bg-emerald-600 hover:text-white text-emerald-900 shadow-lg border border-emerald-100 p-2.5 rounded-full hidden sm:flex items-center justify-center cursor-pointer transition-all duration-300 backdrop-blur-md"
                >
                    <ChevronLeftIcon fontSize="small" />
                </button>
                <button 
                    onClick={() => scrollDeals("right")} 
                    aria-label="Scroll Right"
                    className="absolute right-2 top-[58%] -translate-y-1/2 z-30 bg-white/90 hover:bg-emerald-600 hover:text-white text-emerald-900 shadow-lg border border-emerald-100 p-2.5 rounded-full hidden sm:flex items-center justify-center cursor-pointer transition-all duration-300 backdrop-blur-md"
                >
                    <ChevronRightIcon fontSize="small" />
                </button>
            </>
        )}

        {/* --- Product Horizontal Scroll Track (Limited to 30 Deals) --- */}
        <div 
            ref={dealsScrollRef}
            className="flex items-stretch overflow-x-auto scroll-smooth scrollbar-none gap-4 py-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
            {!loading && discountedProducts.slice(0, 30).map((item) => (
                <div 
                    key={item._id} 
                    className="min-w-[160px] sm:min-w-[210px] md:min-w-[230px] flex-shrink-0"
                >
                    <DealProductItem item={item} />
                </div>
            ))}
        </div>
    </section>
)}
          {/* --- 3. JUST FOR YOU SECTION (All Products Grid - Same Design Structure) --- */}
          <section className="bg-white rounded-md shadow-sm overflow-hidden border border-gray-100 mt-2">
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-50 mb-2">
              <h2 className="text-lg font-bold text-green-800 uppercase tracking-tight">
                Just For You
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4 p-2 sm:p-4">
              {!loading && products && products.map((item) => (
                <div key={item._id} className="h-full bg-white p-2 rounded border border-gray-100 shadow-sm hover:shadow-md transition-all">
                  <Product {...item} />
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>
    </>
  );
};

export default Home;