import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, getSliderProducts } from "../../actions/productAction";
import { getCategories } from "../../actions/categoryAction";
import { addToWishlist } from "../../actions/wishlistAction";
import { addItemsToCart } from "../../actions/cartAction";
import { useSnackbar } from "notistack";
import MetaData from "../Layouts/MetaData";
import { Link } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import StarIcon from "@mui/icons-material/Star";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Banner from "./Banner/Banner";

// --- 1. PRODUCT CARD (Bottom-to-Top Hover Effect & Matching UI) ---
const ProductCard = ({ item, onQuickView, onViewed }) => {
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

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!item.stock || item.stock < 1) {
      enqueueSnackbar("Product is Out of Stock", { variant: "error" });
      return;
    }
    dispatch(addItemsToCart(item._id, 1));
    enqueueSnackbar("Added To Cart Successfully", { variant: "success" });
  };

  const discountPercentage =
    item.discount ||
    (item.cuttedPrice && item.price
      ? Math.round(((item.cuttedPrice - item.price) / item.cuttedPrice) * 100)
      : 0);

  return (
    <div className="scroll-reveal product-card-reveal group/product relative bg-white border border-gray-200 rounded-md p-2 sm:p-3 flex flex-col justify-between h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-green-500 overflow-hidden">
      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <span className="absolute top-2 left-2 z-10 bg-[#2bbef9] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">
          {discountPercentage}% OFF
        </span>
      )}

      {/* Action Buttons: Nichay say uper slide hovering effect */}
      <div className="absolute top-2 right-2 z-20 flex flex-col gap-1.5 translate-y-4 opacity-0 group-hover/product:translate-y-0 group-hover/product:opacity-100 transition-all duration-300">
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
      <div className="w-full aspect-square max-w-[200px] flex items-center justify-center mx-auto overflow-hidden my-1">
        <img
          src={
            item.images?.[0]?.url ||
            item.image ||
            "https://via.placeholder.com/150"
          }
          alt={item.name}
          className="w-full h-full object-contain transition-transform duration-500 group-hover/product:scale-105"
        />
      </div>

      {/* Details */}
      <div className="flex flex-col gap-1 mt-1">
        <h4 className="text-[11px] sm:text-[13px] font-bold text-gray-700 line-clamp-2 h-8 sm:h-7 leading-tight hover:text-green-400 transition-colors">
          {item.name}
        </h4>

        <span className="text-[10px] sm:text-[13px] text-green-500 uppercase tracking-wider">
          {item.stock > 0 || item.Stock > 0 ? "IN STOCK" : "OUT OF STOCK"}
        </span>

        {/* Rating: Sirf tabhi show hoga jab product ko rating mili ho */}
        {item.ratings > 0 && (
          <div className="flex items-center text-yellow-400 my-0.5">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`!text-[16px] sm:!text-[20px] ${
                  i < Math.floor(item.ratings)
                    ? "text-amber-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
        )}

        {/* Price */}
        <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-0.5">
          {item.cuttedPrice && (
            <span className="text-[10px] sm:text-[13px] text-gray-400 line-through font-medium">
              Rs:{item.cuttedPrice}
            </span>
          )}
          <span className="text-[13px] sm:text-[15px] font-bold text-red-500">
            Rs:{item.price}
          </span>
        </div>
      </div>

      {/* View Product Button (Hover Background Green 600) */}
      <Link
        to={`/product/${item._id}`}
        onClick={() => onViewed?.(item)}
        className="mt-2 sm:mt-3 w-full text-center py-1.5 border border-[#2bbef9] text-[#2bbef9] hover:bg-green-600 hover:border-green-600 hover:text-white text-[10px] sm:text-[11px] font-bold rounded-full transition-all duration-300 block"
      >
        View Product
      </Link>
      <button
        type="button"
        onClick={handleAddToCart}
        className="mt-1.5 w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] sm:text-[11px] font-bold rounded-full transition-colors flex items-center justify-center gap-1"
      >
        <ShoppingCartOutlinedIcon className="!text-[14px]" /> Add to Cart
      </button>
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
    <div className="scroll-reveal w-full relative bg-white border border-gray-200 rounded-md p-4">
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
  const { categories } = useSelector((state) => state.allCategories);
  const [selectedQuickViewProduct, setSelectedQuickViewProduct] =
    useState(null);
  const [scrollPosition, setScrollPosition] = useState({
    atTop: true,
    atBottom: false,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [deliveryPin, setDeliveryPin] = useState(
    () => localStorage.getItem("deliveryPin") || "",
  );
  const [deliveryMessage, setDeliveryMessage] = useState("");
  const [copiedCoupon, setCopiedCoupon] = useState(false);
  const [recentProducts, setRecentProducts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("recentProducts") || "[]");
    } catch {
      return [];
    }
  });
  const [saleTime, setSaleTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const featuredScrollRef = useRef(null);
  const newScrollRef = useRef(null);
  const scrollAnimationRef = useRef(null);

  const addRecentlyViewed = (item) => {
    setRecentProducts((current) => {
      const next = [
        item,
        ...current.filter((product) => product._id !== item._id),
      ].slice(0, 6);
      localStorage.setItem("recentProducts", JSON.stringify(next));
      return next;
    });
  };

  const checkDelivery = () => {
    if (!/^\d{5}$/.test(deliveryPin)) {
      setDeliveryMessage("Enter a valid 5-digit postal code.");
      return;
    }
    localStorage.setItem("deliveryPin", deliveryPin);
    setDeliveryMessage(
      `Delivery available to ${deliveryPin}. Expected in 2-4 days.`,
    );
  };

  const copyCoupon = async () => {
    try {
      await navigator.clipboard.writeText("FREE25BAC");
      setCopiedCoupon(true);
      enqueueSnackbar("Coupon copied to clipboard", { variant: "success" });
      window.setTimeout(() => setCopiedCoupon(false), 2200);
    } catch {
      enqueueSnackbar("Copy the coupon: FREE25BAC", { variant: "info" });
    }
  };

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

  useEffect(() => {
    const saleEndsAt =
      Date.now() + 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000;
    const updateSaleTime = () => {
      const remaining = Math.max(0, saleEndsAt - Date.now());
      const totalSeconds = Math.floor(remaining / 1000);
      setSaleTime({
        days: Math.floor(totalSeconds / 86400),
        hours: Math.floor((totalSeconds % 86400) / 3600),
        minutes: Math.floor((totalSeconds % 3600) / 60),
        seconds: totalSeconds % 60,
      });
    };
    updateSaleTime();
    const timer = window.setInterval(updateSaleTime, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll(".scroll-reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px" },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [loading, products]);

  useEffect(() => {
    const updateScrollPosition = () => {
      const atTop = window.scrollY <= 10;
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 10;
      setScrollPosition({ atTop, atBottom });
    };

    updateScrollPosition();
    window.addEventListener("scroll", updateScrollPosition, { passive: true });
    window.addEventListener("resize", updateScrollPosition);

    return () => {
      window.removeEventListener("scroll", updateScrollPosition);
      window.removeEventListener("resize", updateScrollPosition);
    };
  }, []);

  const scrollPage = (direction) => {
    if (scrollAnimationRef.current) {
      cancelAnimationFrame(scrollAnimationRef.current);
    }

    const start = window.scrollY;
    const target =
      direction === "up"
        ? 0
        : Math.max(
            0,
            document.documentElement.scrollHeight - window.innerHeight,
          );
    const distance = target - start;
    const duration = 1800;
    const startTime = performance.now();
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";

    const animateScroll = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easedProgress =
        progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      window.scrollTo(0, start + distance * easedProgress);
      if (progress < 1) {
        scrollAnimationRef.current = requestAnimationFrame(animateScroll);
      } else {
        scrollAnimationRef.current = null;
        root.style.scrollBehavior = previousScrollBehavior;
      }
    };

    scrollAnimationRef.current = requestAnimationFrame(animateScroll);
  };

  const featuredProducts =
    products?.filter((item) => {
      const disc =
        item.discount ||
        (item.cuttedPrice && item.price
          ? Math.round(
              ((item.cuttedPrice - item.price) / item.cuttedPrice) * 100,
            )
          : 0);
      return disc > 0;
    }) || [];

  const newProducts = products
    ? [...products].sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
      )
    : [];

  const searchSuggestions = searchTerm.trim()
    ? products
        .filter((item) =>
          item.name?.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        .slice(0, 5)
    : [];
  const categorySections = (categories || [])
    .map((category) => ({
      ...category,
      products: (products || [])
        .filter((item) => {
          const itemCategory = item.category?.name || item.category;
          return itemCategory?.toLowerCase() === category.name?.toLowerCase();
        })
        .slice(0, 5),
    }))
    .filter((category) => category.products.length > 0)
    .slice(0, 3);
  const ratedProducts = (products || [])
    .filter((item) => item.ratings > 0)
    .slice(0, 3);
  const saleProduct = featuredProducts[0] || newProducts[0];
  const saleUnits = [
    saleTime.days,
    saleTime.hours,
    saleTime.minutes,
    saleTime.seconds,
  ];

  return (
    <>
      <MetaData title="Ma-Cart | Online Shopping Site" />

      <main className="w-full bg-[#f8f9fa] min-h-screen pb-12 pt-4">
        <div className="max-w-[1360px] mx-auto px-2 sm:px-4 flex flex-col gap-6">
          {/* SEARCH WITH LIVE SUGGESTIONS */}
          <div className="scroll-reveal relative z-30">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm focus-within:border-emerald-500">
              <SearchIcon className="text-gray-400" fontSize="small" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search products..."
                aria-label="Search products"
                className="w-full bg-transparent outline-none text-sm text-gray-700"
              />
              <Link
                to={`/products${searchTerm.trim() ? `?keyword=${encodeURIComponent(searchTerm.trim())}` : ""}`}
                onClick={() => setSearchTerm("")}
                className="text-xs font-bold text-emerald-600 whitespace-nowrap"
              >
                Search
              </Link>
            </div>
            {searchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
                {searchSuggestions.map((item) => (
                  <Link
                    key={item._id}
                    to={`/product/${item._id}`}
                    onClick={() => {
                      addRecentlyViewed(item);
                      setSearchTerm("");
                    }}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-emerald-50 border-b last:border-b-0"
                  >
                    <img
                      src={item.images?.[0]?.url}
                      alt=""
                      className="w-9 h-9 object-contain"
                    />
                    <span className="text-xs text-gray-700 line-clamp-1">
                      {item.name}
                    </span>
                    <span className="ml-auto text-xs font-bold text-emerald-600">
                      Rs:{item.price}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
          {/* BANNER 1: HERO TOP BANNER */}
          <div className="scroll-reveal mt-[3l0px] w-full relative h-[350px] rounded-xl overflow-hidden bg-white shadow-sm flex items-center justify-between">
            <Banner />
          </div>

          {/* DYNAMIC CATEGORIES SECTION */}
          <FeaturedCategoriesSection />

          {/* FLASH SALE AND DELIVERY CHECKER */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-4">
            <section className="scroll-reveal bg-white border border-rose-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[10px] uppercase font-bold text-rose-500">
                    Limited time offer
                  </p>
                  <h2 className="text-lg font-black text-gray-800">
                    Flash Sale
                  </h2>
                </div>
                <div className="flex gap-1 text-center">
                  {saleUnits.map((unit, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 rounded px-2 py-1 text-xs font-bold text-gray-800"
                    >
                      {String(unit).padStart(2, "0")}
                      <small className="block text-[8px] font-normal text-gray-400">
                        {["D", "H", "M", "S"][index]}
                      </small>
                    </span>
                  ))}
                </div>
              </div>
              {saleProduct ? (
                <div className="flex items-center gap-4 border border-rose-300 rounded-lg p-3">
                  <span className="shrink-0 rounded-full bg-rose-500 text-white text-sm font-black px-3 py-3">
                    {saleProduct.discount || 0}%
                  </span>
                  <img
                    src={saleProduct.images?.[0]?.url}
                    alt={saleProduct.name}
                    className="w-24 h-24 object-contain"
                  />
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-gray-800 line-clamp-2">
                      {saleProduct.name}
                    </h3>
                    <p className="text-xs text-gray-400 line-through mt-1">
                      Rs:{saleProduct.cuttedPrice}
                    </p>
                    <p className="text-base font-black text-rose-500">
                      Rs:{saleProduct.price}
                    </p>
                    <Link
                      to={`/product/${saleProduct._id}`}
                      onClick={() => addRecentlyViewed(saleProduct)}
                      className="text-[11px] font-bold text-emerald-600"
                    >
                      Grab the deal
                    </Link>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-400">
                  Loading today&apos;s deal...
                </p>
              )}
            </section>

            <section className="scroll-reveal bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <LocationOnOutlinedIcon className="text-emerald-600" />
                <h2 className="text-sm font-black text-gray-800">
                  Check delivery availability
                </h2>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                Enter your postal code to see delivery availability.
              </p>
              <div className="flex gap-2">
                <input
                  value={deliveryPin}
                  onChange={(event) =>
                    setDeliveryPin(
                      event.target.value.replace(/\D/g, "").slice(0, 5),
                    )
                  }
                  placeholder="Postal code"
                  inputMode="numeric"
                  className="min-w-0 flex-1 rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={checkDelivery}
                  className="rounded bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                >
                  Check
                </button>
              </div>
              {deliveryMessage && (
                <p
                  className={`mt-3 text-xs ${deliveryMessage.startsWith("Delivery") ? "text-emerald-600" : "text-rose-500"}`}
                >
                  {deliveryMessage}
                </p>
              )}
            </section>
          </div>

          <button
            type="button"
            onClick={copyCoupon}
            className="scroll-reveal w-full rounded-xl bg-rose-50 px-4 py-4 text-xs text-rose-600 flex items-center justify-center gap-2 hover:bg-rose-100"
          >
            Super discount for your first purchase: <strong>FREE25BAC</strong>{" "}
            <ContentCopyIcon className="!text-sm" />{" "}
            {copiedCoupon ? "Copied" : "Copy coupon"}
          </button>

          {/* MAIN GRID LAYOUT */}
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* LEFT SIDEBAR BANNERS */}
            <div className="w-full lg:w-[260px] flex-shrink-0 flex flex-col gap-5">
              {/* BANNER 2: BAKERY */}
              <div className="scroll-reveal relative rounded-xl overflow-hidden h-[290px] shadow-sm group">
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
              <div className="scroll-reveal relative rounded-xl overflow-hidden h-[210px] shadow-sm group bg-[#f5cb42]">
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
                    <p className="text-lg font-black text-rose-500">$14.99</p>
                  </div>
                </div>
              </div>

              {/* SIDE INFO FEATURES */}
              <div className="scroll-reveal bg-white rounded-xl p-4 border border-gray-200 flex flex-col gap-3 text-[11px] text-gray-600 shadow-sm">
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
              <section className="scroll-reveal bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative">
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
                    className="product-scroll-track flex gap-2 sm:gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory py-2 px-1 scrollbar-none"
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
                            className="w-[calc(50vw-1.5rem)] min-w-[150px] max-w-[250px] flex-shrink-0 snap-start"
                          >
                            <ProductCard
                              item={item}
                              onViewed={addRecentlyViewed}
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
              <section className="scroll-reveal bg-white p-3 sm:p-5 rounded-xl border border-gray-200 shadow-sm relative">
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

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                  {!loading &&
                    newProducts?.slice(0, 8).map((item) => (
                      <div key={item._id} className="w-full">
                        <ProductCard
                          item={item}
                          onViewed={addRecentlyViewed}
                          onQuickView={(prod) =>
                            setSelectedQuickViewProduct(prod)
                          }
                        />
                      </div>
                    ))}
                </div>
              </section>

              {categorySections.map((category) => (
                <section
                  key={category._id}
                  className="scroll-reveal bg-white p-3 sm:p-5 rounded-xl border border-gray-200 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-xs font-extrabold uppercase text-gray-800 tracking-wider">
                        Shop {category.name}
                      </h3>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        Popular picks from this category.
                      </p>
                    </div>
                    <Link
                      to={`/products?category=${encodeURIComponent(category.name)}`}
                      className="text-[11px] font-semibold text-emerald-600"
                    >
                      View all &rarr;
                    </Link>
                  </div>
                  <div className="flex gap-3 overflow-x-auto scrollbar-none pb-1">
                    {category.products.map((item) => (
                      <div key={item._id} className="w-[170px] min-w-[170px]">
                        <ProductCard
                          item={item}
                          onViewed={addRecentlyViewed}
                          onQuickView={setSelectedQuickViewProduct}
                        />
                      </div>
                    ))}
                  </div>
                </section>
              ))}

              {recentProducts.length > 0 && (
                <section className="scroll-reveal bg-white p-3 sm:p-5 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-xs font-extrabold uppercase text-gray-800 tracking-wider">
                        Recently Viewed
                      </h3>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        Pick up where you left off.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        localStorage.removeItem("recentProducts");
                        setRecentProducts([]);
                      }}
                      className="text-[11px] text-gray-400 hover:text-rose-500"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
                    {recentProducts.map((item) => (
                      <ProductCard
                        key={item._id}
                        item={item}
                        onViewed={addRecentlyViewed}
                        onQuickView={setSelectedQuickViewProduct}
                      />
                    ))}
                  </div>
                </section>
              )}

              {ratedProducts.length > 0 && (
                <section className="scroll-reveal bg-[#f5fbf8] p-4 sm:p-5 rounded-xl border border-emerald-100">
                  <h3 className="text-xs font-extrabold uppercase text-gray-800 tracking-wider mb-4">
                    What shoppers are saying
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {ratedProducts.map((item) => (
                      <Link
                        key={item._id}
                        to={`/product/${item._id}`}
                        className="bg-white border border-gray-100 rounded-lg p-3 hover:border-emerald-300 transition-colors"
                        onClick={() => addRecentlyViewed(item)}
                      >
                        <div className="flex items-center gap-1 text-amber-400 text-sm">
                          ★★★★★{" "}
                          <span className="text-gray-500 text-[11px]">
                            {Number(item.ratings).toFixed(1)}/5
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-2">
                          “Great quality and value. I would order this again.”
                        </p>
                        <p className="text-[10px] font-bold text-gray-800 mt-2 line-clamp-1">
                          Verified shopper · {item.name}
                        </p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>

          {/* BOTTOM BANNERS ROW */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            {/* BOTTOM BANNER 1 */}
            <div className="scroll-reveal relative rounded-xl overflow-hidden h-[160px] bg-[#00a862] p-5 flex items-center justify-between text-white shadow-sm group">
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
            <div className="scroll-reveal relative rounded-xl overflow-hidden h-[160px] bg-[#fce0c5] p-5 flex items-center justify-between text-gray-800 shadow-sm group">
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
            <div className="scroll-reveal relative rounded-xl overflow-hidden h-[160px] bg-[#f0e7d8] p-5 flex items-center justify-between text-gray-800 shadow-sm group">
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

      <div className="fixed bottom-5 right-4 z-40 sm:right-6">
        {scrollPosition.atTop ? (
          <button
            type="button"
            onClick={() => scrollPage("down")}
            aria-label="Scroll slowly to bottom"
            title="Scroll down"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-green-600 bg-green-500 text-white shadow-lg transition-all duration-300 hover:translate-y-1 hover:bg-green-600"
          >
            <KeyboardArrowDownIcon />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => scrollPage("up")}
            aria-label="Scroll slowly to top"
            title="Scroll up"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-green-600 bg-green-500 text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-green-600"
          >
            <KeyboardArrowUpIcon />
          </button>
        )}
      </div>
    </>
  );
};

export default Home;
