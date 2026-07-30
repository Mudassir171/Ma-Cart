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
    const targetTime = item.dealExpiry
      ? new Date(item.dealExpiry).getTime()
      : new Date().getTime() + 86400000 * 3;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60),
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [item.dealExpiry]);

  const discountPercentage =
    item.discount ||
    (item.cuttedPrice && item.price
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
        <p className="text-[10px] text-gray-500 text-center mb-1 font-medium">
          Offers ends in:
        </p>
        <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-gray-800 bg-gray-50 py-1 rounded">
          <span>{String(timeLeft.days).padStart(2, "0")}d</span>:
          <span>{String(timeLeft.hours).padStart(2, "0")}h</span>:
          <span>{String(timeLeft.minutes).padStart(2, "0")}m</span>:
          <span>{String(timeLeft.seconds).padStart(2, "0")}s</span>
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
        left:
          direction === "left"
            ? scrollLeft - scrollAmount
            : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollDeals = (direction) => {
    if (dealsScrollRef.current) {
      const { scrollLeft, clientWidth } = dealsScrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      dealsScrollRef.current.scrollTo({
        left:
          direction === "left"
            ? scrollLeft - scrollAmount
            : scrollLeft + scrollAmount,
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
    ? [...products].sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
      )
    : [];

  // --- 2. Discounted / Deal Products ---
  const discountedProducts = products?.filter((item) => {
    const disc =
      item.discount ||
      (item.cuttedPrice && item.price
        ? Math.round(((item.cuttedPrice - item.price) / item.cuttedPrice) * 100)
        : 0);
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
        {/* --- LATEST PRODUCTS SECTION (Banner Left + 4 Products Right in a Single Line) --- */}
{latestProducts && latestProducts.length > 0 && (
  <section className="bg-gradient-to-b from-white to-gray-50/50 my-6 w-full shadow-md rounded-2xl overflow-hidden border border-emerald-100/60 p-4 md:p-6">
    
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
        <svg
          className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </Link>
    </div>

    {/* --- Main Container: Left Banner + Right 4 Products --- */}
    <div className="flex flex-col lg:flex-row gap-4 items-stretch">
      
      {/* Left Side: Banner */}
      <div className="w-full lg:w-[260px] flex-shrink-0">
        <Link 
          to="/products" 
          className="group relative h-full min-h-[300px] rounded-xl overflow-hidden shadow-sm border border-emerald-100 flex flex-col justify-end p-5 block"
        >
          <img 
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=600&q=80" 
            alt="Latest Collection Banner"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          
          <div className="relative z-10 text-white">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-300 bg-emerald-950/70 px-2.5 py-1 rounded-md backdrop-blur-md">
              Special Offer
            </span>
            <h3 className="text-lg font-extrabold mt-2 leading-snug">
              Hot New Arrivals & Deals
            </h3>
            <span className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-white bg-emerald-600 px-3 py-1.5 rounded-lg group-hover:bg-emerald-500 transition-colors">
              Shop Now &rarr;
            </span>
          </div>
        </Link>
      </div>

      {/* Right Side: 4 Products in a Single Line (Fixed Width 200px, Height 300px) */}
      <div className="flex-grow overflow-x-auto pb-2">
        <div className="flex gap-4 items-center justify-start lg:justify-between">
          {!loading &&
            latestProducts.slice(0, 4).map((item) => {
              return (
                <div
                  key={item._id}
                  style={{ width: '200px', height: '300px' }}
                  className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-emerald-200 transition-all duration-300 flex-shrink-0 flex flex-col shadow-sm"
                >
                  <Product {...item} />
                </div>
              );
            })}
        </div>
      </div>

    </div>
  </section>
)}
         {/* --- FLASH SALE / SPECIAL DISCOUNTS SECTION --- */}
{discountedProducts && discountedProducts.length > 0 && (
  <section className="bg-gradient-to-b from-white to-gray-50/50 my-6 w-full shadow-md rounded-2xl overflow-hidden relative border border-emerald-100/60 p-4 md:p-6">
    
    {/* --- Header Section --- */}
    <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-100">
      <div className="flex items-center gap-2.5">
        <div className="h-6 w-1.5 bg-emerald-600 rounded-full"></div>
        <h2 className="text-lg md:text-xl font-extrabold text-emerald-950 tracking-tight">
          Flash Sale & Special Discounts
        </h2>
      </div>

      <Link
        to="/products"
        className="group relative inline-flex items-center gap-2 px-5 py-2 text-xs md:text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all duration-300 shadow-sm"
      >
        <span>View All</span>
        <svg
          className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </Link>
    </div>

    {/* --- Main Content Container: Left Banner + Right Scrollable Products --- */}
    <div className="flex flex-col lg:flex-row gap-4 items-stretch relative">
      
      {/* Left Side: Flash Sale Promotional Banner */}
      <div className="w-full lg:w-[260px] flex-shrink-0">
        <Link 
          to="/products" 
          className="group relative h-full min-h-[300px] rounded-xl overflow-hidden shadow-sm border border-emerald-100 flex flex-col justify-end p-5 block"
        >
          <img 
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=600&q=80" 
            alt="Flash Sale Banner"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          
          <div className="relative z-10 text-white">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-300 bg-emerald-950/70 px-2.5 py-1 rounded-md backdrop-blur-md">
              Limited Time
            </span>
            <h3 className="text-lg font-extrabold mt-2 leading-snug">
              Flash Deals Up to 70% Off
            </h3>
            <span className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-white bg-emerald-600 px-3 py-1.5 rounded-lg group-hover:bg-emerald-500 transition-colors">
              Shop Sale &rarr;
            </span>
          </div>
        </Link>
      </div>

      {/* Right Side: Scrollable Container with Fixed Product Dimensions (200px x 300px) */}
      <div className="flex-grow relative overflow-hidden flex items-center">
        
        {/* Floating Left Arrow */}
        {discountedProducts.length >= 4 && (
          <button
            onClick={() => scrollDeals("left")}
            aria-label="Scroll Left"
            className="absolute left-1 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-emerald-600 hover:text-white text-emerald-900 shadow-lg border border-emerald-100 p-2 rounded-full hidden sm:flex items-center justify-center cursor-pointer transition-all duration-300 backdrop-blur-md"
          >
            <ChevronLeftIcon fontSize="small" />
          </button>
        )}

        {/* Floating Right Arrow */}
        {discountedProducts.length >= 4 && (
          <button
            onClick={() => scrollDeals("right")}
            aria-label="Scroll Right"
            className="absolute right-1 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-emerald-600 hover:text-white text-emerald-900 shadow-lg border border-emerald-100 p-2 rounded-full hidden sm:flex items-center justify-center cursor-pointer transition-all duration-300 backdrop-blur-md"
          >
            <ChevronRightIcon fontSize="small" />
          </button>
        )}

        {/* Product Horizontal Scroll Track */}
        <div
          ref={dealsScrollRef}
          className="flex items-center overflow-x-auto scroll-smooth scrollbar-none gap-4 py-2 w-full"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {!loading &&
            discountedProducts.slice(0, 30).map((item) => (
              <div
                key={item._id}
                style={{ width: '200px', height: '300px' }}
                className="flex-shrink-0 bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-emerald-200 transition-all duration-300 shadow-sm flex flex-col"
              >
                <DealProductItem item={item} />
              </div>
            ))}
        </div>

      </div>

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
              {!loading &&
                products &&
                products.map((item) => (
                  <div
                    key={item._id}
                    className="h-full bg-white p-2 rounded border border-gray-100 shadow-sm hover:shadow-md transition-all"
                  >
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
