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

  // --- Scroll References for both sections ---
  const dealsScrollRef = useRef(null);
  const discountScrollRef = useRef(null);

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

  const scrollDiscount = (direction) => {
    if (discountScrollRef.current) {
      const { scrollLeft, clientWidth } = discountScrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      discountScrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // --- Countdown Timer State (Deals Section) ---
  const [timeLeft, setTimeLeft] = useState({
    days: 4,
    hours: 13,
    minutes: 34,
    seconds: 56,
  });

  // --- Countdown Timer State (Discount Section) ---
  const [discountTimeLeft, setDiscountTimeLeft] = useState({
    days: 2,
    hours: 8,
    minutes: 15,
    seconds: 30,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });

      setDiscountTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }
    dispatch(getSliderProducts());
  }, [dispatch, error, enqueueSnackbar]);

  // --- Filter Products with Discount > 0 ---
  const discountedProducts = products?.filter((item) => {
    const disc = item.discount || (item.cuttedPrice && item.price ? Math.round(((item.cuttedPrice - item.price) / item.cuttedPrice) * 100) : 0);
    return disc > 0;
  });

  return (
    <>
      <MetaData title="Daraz.pk | Online Shopping Site" />

      <main className="w-full bg-[#f4f4f4] min-h-screen pb-10 overflow-x-hidden mt-5">
        
        {/* Banner Section - Hidden or stacked appropriately on mobile if required, matching reference style */}
        <div className="w-full mt-12 bg-white shadow-sm">
          <Banner />
        </div>

        <div className="max-w-[1360px] mx-auto px-2 sm:px-4 flex flex-col gap-6">

          {/* Categories Section - Moved up right below banner for mobile/desktop layout flow */}
          <section className="mt-4">
            <div className="flex items-center gap-4 mb-3">
              <h2 className="text-gray-900 text-lg sm:text-xl font-bold">Categories</h2>
              <div className="h-[1px] bg-gray-300 flex-1"></div>
            </div>
            <div className="bg-white rounded-sm shadow-sm p-2">
              <Categories />
            </div>
          </section>

          {/* --- 1. DEALS AND OFFERS SECTION --- */}
          {discountedProducts && discountedProducts.length > 0 && (
            <section className="bg-white rounded-md shadow-sm overflow-hidden relative border border-gray-100 mt-2">
              {discountedProducts.length >= 4 && (
                <>
                  <button 
                    onClick={() => scrollDeals("left")} 
                    className="absolute left-1 top-[60%] -translate-y-1/2 z-20 bg-white/90 hover:bg-white shadow-md border border-gray-200 p-1 rounded-full hidden sm:flex items-center justify-center cursor-pointer"
                  >
                    <ChevronLeftIcon fontSize="medium" />
                  </button>
                  <button 
                    onClick={() => scrollDeals("right")} 
                    className="absolute right-1 top-[60%] -translate-y-1/2 z-20 bg-white/90 hover:bg-white shadow-md border border-gray-200 p-1 rounded-full hidden sm:flex items-center justify-center cursor-pointer"
                  >
                    <ChevronRightIcon fontSize="medium" />
                  </button>
                </>
              )}

              <div 
                ref={dealsScrollRef}
                className="flex items-stretch overflow-x-auto scroll-smooth scrollbar-none"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {/* Timer Box */}
                <div className="min-w-[160px] sm:min-w-[260px] p-3 sm:p-5 flex flex-col justify-center border-r border-gray-200 bg-white flex-shrink-0">
                  <h2 className="text-gray-900 font-bold text-base sm:text-xl leading-tight">Deals and offers</h2>
                  <p className="text-gray-500 text-[11px] sm:text-xs mb-3 sm:mb-4">Hygiene equipments</p>

                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="flex flex-col items-center bg-gradient-to-b from-gray-800 to-gray-900 text-white rounded-md sm:rounded-lg px-1.5 sm:px-2.5 py-1 sm:py-1.5 shadow">
                      <span className="text-xs sm:text-base font-bold">{String(timeLeft.days).padStart(2, '0')}</span>
                      <span className="text-[8px] sm:text-[9px] text-gray-300 uppercase tracking-wider">Days</span>
                    </div>
                    <span className="text-gray-400 font-bold text-xs sm:text-base">:</span>
                    <div className="flex flex-col items-center bg-gradient-to-b from-gray-800 to-gray-900 text-white rounded-md sm:rounded-lg px-1.5 sm:px-2.5 py-1 sm:py-1.5 shadow">
                      <span className="text-xs sm:text-base font-bold">{String(timeLeft.hours).padStart(2, '0')}</span>
                      <span className="text-[8px] sm:text-[9px] text-gray-300 uppercase tracking-wider">Hour</span>
                    </div>
                    <span className="text-gray-400 font-bold text-xs sm:text-base">:</span>
                    <div className="flex flex-col items-center bg-gradient-to-b from-gray-800 to-gray-900 text-white rounded-md sm:rounded-lg px-1.5 sm:px-2.5 py-1 sm:py-1.5 shadow">
                      <span className="text-xs sm:text-base font-bold">{String(timeLeft.minutes).padStart(2, '0')}</span>
                      <span className="text-[8px] sm:text-[9px] text-gray-300 uppercase tracking-wider">Min</span>
                    </div>
                    <span className="text-gray-400 font-bold text-xs sm:text-base">:</span>
                    <div className="flex flex-col items-center bg-gradient-to-b from-gray-800 to-gray-900 text-white rounded-md sm:rounded-lg px-1.5 sm:px-2.5 py-1 sm:py-1.5 shadow">
                      <span className="text-xs sm:text-base font-bold">{String(timeLeft.seconds).padStart(2, '0')}</span>
                      <span className="text-[8px] sm:text-[9px] text-gray-300 uppercase tracking-wider">Sec</span>
                    </div>
                  </div>
                </div>

                {/* Products List */}
                <div className="flex flex-1 items-stretch">
                  {!loading && discountedProducts.map((item) => {
                    const discountPercentage = item.discount || (item.cuttedPrice && item.price
                      ? Math.round(((item.cuttedPrice - item.price) / item.cuttedPrice) * 100)
                      : 0);

                    return (
                      <div 
                        key={item._id} 
                        className="min-w-[50%] sm:min-w-[210px] border-r border-gray-200 p-2 sm:p-3 flex flex-col justify-between relative bg-white flex-shrink-0 group hover:shadow-md transition-all"
                      >
                        {discountPercentage > 0 && (
                          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 bg-pink-100 text-rose-600 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                            -{discountPercentage}%
                          </div>
                        )}
                        <Product {...item} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {/* --- 2. DISCOUNTED PRODUCTS SECTION WITH TIMER --- */}
          {discountedProducts && discountedProducts.length > 0 && (
            <section className="bg-white rounded-md shadow-sm overflow-hidden relative border border-gray-100 mt-2">
              {discountedProducts.length >= 4 && (
                <>
                  <button 
                    onClick={() => scrollDiscount("left")} 
                    className="absolute left-1 top-[60%] -translate-y-1/2 z-20 bg-white/90 hover:bg-white shadow-md border border-gray-200 p-1 rounded-full hidden sm:flex items-center justify-center cursor-pointer"
                  >
                    <ChevronLeftIcon fontSize="medium" />
                  </button>
                  <button 
                    onClick={() => scrollDiscount("right")} 
                    className="absolute right-1 top-[60%] -translate-y-1/2 z-20 bg-white/90 hover:bg-white shadow-md border border-gray-200 p-1 rounded-full hidden sm:flex items-center justify-center cursor-pointer"
                  >
                    <ChevronRightIcon fontSize="medium" />
                  </button>
                </>
              )}

              <div 
                ref={discountScrollRef}
                className="flex items-stretch overflow-x-auto scroll-smooth scrollbar-none"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {/* Timer Box for Discounted Products */}
                <div className="min-w-[160px] sm:min-w-[260px] p-3 sm:p-5 flex flex-col justify-center border-r border-gray-200 bg-white flex-shrink-0">
                  <h2 className="text-gray-900 font-bold text-base sm:text-xl leading-tight">Special Discounts</h2>
                  <p className="text-gray-500 text-[11px] sm:text-xs mb-3 sm:mb-4">Limited time offers</p>

                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="flex flex-col items-center bg-gradient-to-b from-gray-800 to-gray-900 text-white rounded-md sm:rounded-lg px-1.5 sm:px-2.5 py-1 sm:py-1.5 shadow">
                      <span className="text-xs sm:text-base font-bold">{String(discountTimeLeft.days).padStart(2, '0')}</span>
                      <span className="text-[8px] sm:text-[9px] text-gray-300 uppercase tracking-wider">Days</span>
                    </div>
                    <span className="text-gray-400 font-bold text-xs sm:text-base">:</span>
                    <div className="flex flex-col items-center bg-gradient-to-b from-gray-800 to-gray-900 text-white rounded-md sm:rounded-lg px-1.5 sm:px-2.5 py-1 sm:py-1.5 shadow">
                      <span className="text-xs sm:text-base font-bold">{String(discountTimeLeft.hours).padStart(2, '0')}</span>
                      <span className="text-[8px] sm:text-[9px] text-gray-300 uppercase tracking-wider">Hour</span>
                    </div>
                    <span className="text-gray-400 font-bold text-xs sm:text-base">:</span>
                    <div className="flex flex-col items-center bg-gradient-to-b from-gray-800 to-gray-900 text-white rounded-md sm:rounded-lg px-1.5 sm:px-2.5 py-1 sm:py-1.5 shadow">
                      <span className="text-xs sm:text-base font-bold">{String(discountTimeLeft.minutes).padStart(2, '0')}</span>
                      <span className="text-[8px] sm:text-[9px] text-gray-300 uppercase tracking-wider">Min</span>
                    </div>
                    <span className="text-gray-400 font-bold text-xs sm:text-base">:</span>
                    <div className="flex flex-col items-center bg-gradient-to-b from-gray-800 to-gray-900 text-white rounded-md sm:rounded-lg px-1.5 sm:px-2.5 py-1 sm:py-1.5 shadow">
                      <span className="text-xs sm:text-base font-bold">{String(discountTimeLeft.seconds).padStart(2, '0')}</span>
                      <span className="text-[8px] sm:text-[9px] text-gray-300 uppercase tracking-wider">Sec</span>
                    </div>
                  </div>
                </div>

                {/* Products List */}
                <div className="flex flex-1 items-stretch">
                  {!loading && discountedProducts.map((item) => {
                    const discountPercentage = item.discount || (item.cuttedPrice && item.price
                      ? Math.round(((item.cuttedPrice - item.price) / item.cuttedPrice) * 100)
                      : 0);

                    return (
                      <div 
                        key={item._id} 
                        className="min-w-[50%] sm:min-w-[210px] border-r border-gray-200 p-2 sm:p-3 flex flex-col justify-between relative bg-white flex-shrink-0 group hover:shadow-md transition-all"
                      >
                        {discountPercentage > 0 && (
                          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 bg-pink-100 text-rose-600 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                            -{discountPercentage}%
                          </div>
                        )}
                        <Product {...item} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {/* Just For You Section */}
          <section className="mt-2">
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-gray-900 text-lg sm:text-xl font-bold">Just For You</h2>
              <div className="h-[1px] bg-gray-300 flex-1"></div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
              {!loading && products && products.slice(0, 30).map((item) => (
                <div key={item._id} className="h-full bg-white p-2 rounded shadow-sm">
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