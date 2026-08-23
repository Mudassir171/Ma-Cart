import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getCategories } from "../../../actions/categoryAction";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Searchbar from "./Searchbar";
import logo from "../../../assets/images/logo.png";
import PrimaryDropDownMenu from "./PrimaryDropDownMenu";
import MyChatsModal from "../../Mychats/MyChats";
const Header = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { categories } = useSelector((state) => state.allCategories);
  const dispatch = useDispatch();

  const [togglePrimaryDropDown, setTogglePrimaryDropDown] = useState(false);
  const [mobileMenuToggle, setMobileMenuToggle] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);

  // State for controlling the MyChatsModal
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  // Ref for handling outside click to close dropdown/menu
  const dropdownRef = useRef(null);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setTogglePrimaryDropDown(false);
        setMobileMenuToggle(false);
        setCategoryMenuOpen(false);
        setShopMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef}>
      <header className="bg-green-800 fixed top-0 w-full z-50 shadow-md">
        {/* Top Utility Links (Desktop Only) */}
        <div className="hidden sm:block text-[11px] text-white py-1 border-b border-green-700">
          <div className="w-full sm:w-9/12 m-auto flex justify-end gap-5 px-4 font-medium tracking-wide">
            <span className="cursor-pointer hover:underline">
              SAVE MORE ON APP
            </span>
            <span className="cursor-pointer hover:underline">
              SELL ON MA-CART
            </span>
            <span className="cursor-pointer hover:underline">
              HELP & SUPPORT
            </span>
          </div>
        </div>

        {/* Main Header Container */}
        <div className="w-full sm:w-9/12 px-3 sm:px-4 m-auto flex flex-col sm:flex-row justify-between items-center py-2.5 sm:py-3 gap-2 sm:gap-4">
          {/* Top Row for Mobile & Standard Desktop Row */}
          <div className="w-full flex justify-between items-center">
            {/* Left Side: Mobile Menu Icon & Logo */}
            <div className="flex items-center gap-3">
              {/* Mobile Menu Button */}
              <div className="flex sm:hidden items-center text-white">
                <button
                  onClick={() => {
                    setMobileMenuToggle(!mobileMenuToggle);
                    setTogglePrimaryDropDown(false);
                  }}
                  className="focus:outline-none p-1 flex items-center"
                >
                  {mobileMenuToggle ? <CloseIcon /> : <MenuIcon />}
                  {/* <span className="text-xs ml-1 font-medium">Menu</span> */}
                </button>
              </div>

              {/* Logo */}
              <Link className="h-7 sm:h-9 flex items-center shrink-0" to="/">
                <img
                  draggable="false"
                  className="h-7 sm:h-10 w-auto object-contain"
                  src={logo}
                  alt="MA-CART"
                />
              </Link>
            </div>

            {/* Searchbar for Desktop Only */}
            <div className="hidden sm:flex flex-1 max-w-2xl mx-4">
              <Searchbar />
            </div>

            {/* Right Navigation (Wishlist, Cart, Account/Login) */}
            <div className="flex items-center gap-3 sm:gap-6 text-white shrink-0">
              {isAuthenticated === false ? (
                <div className="hidden sm:flex gap-3 font-medium text-sm text-white">
                  <Link to="/login" className="hover:underline">
                    LOGIN
                  </Link>
                  <span>|</span>
                  <Link to="/register" className="hover:underline">
                    SIGN UP
                  </Link>
                </div>
              ) : (
                /* Account Wrapper with relative positioning for dropdown */
                <div className="relative hidden sm:block">
                  <span
                    className="flex items-center font-medium gap-1 cursor-pointer hover:opacity-80"
                    onClick={() =>
                      setTogglePrimaryDropDown(!togglePrimaryDropDown)
                    }
                  >
                    {user.name && user.name.split(" ", 1)}
                    {togglePrimaryDropDown ? (
                      <ExpandLessIcon sx={{ fontSize: "16px" }} />
                    ) : (
                      <ExpandMoreIcon sx={{ fontSize: "16px" }} />
                    )}
                  </span>

                  {/* Primary DropDown Menu (Desktop - Directly under Account) */}
                  {togglePrimaryDropDown && (
                    <div className="absolute right-[60px] top-2 mt-1 z-50">
                      <PrimaryDropDownMenu
                        setTogglePrimaryDropDown={setTogglePrimaryDropDown}
                        user={user}
                        setIsChatModalOpen={setIsChatModalOpen}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative hover:opacity-85 flex items-center p-1"
              >
                <FavoriteIcon sx={{ fontSize: { xs: "24px", sm: "26px" } }} />
                {wishlistItems.length > 0 && (
                  <div className="w-4 h-4 bg-orange-500 text-white text-[9px] rounded-full absolute -top-0.5 -right-1 sm:-top-1 sm:-right-2 flex justify-center items-center font-bold">
                    {wishlistItems.length}
                  </div>
                )}
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative hover:opacity-85 flex items-center p-1"
              >
                <ShoppingCartIcon
                  sx={{ fontSize: { xs: "24px", sm: "26px" } }}
                />
                {cartItems.length > 0 && (
                  <div className="w-4 h-4 bg-orange-500 text-white text-[9px] rounded-full absolute -top-0.5 -right-1 sm:-top-1 sm:-right-2 flex justify-center items-center font-bold">
                    {cartItems.length}
                  </div>
                )}
              </Link>
            </div>
          </div>

          {/* Searchbar for Mobile Only (Alag neechay wali row mein) */}
          <div className="flex sm:hidden w-full pb-1">
            <Searchbar />
          </div>
        </div>

        {/* Primary Store Navigation */}
        <nav className="hidden sm:block bg-white text-[#24324a] border-b border-gray-100 shadow-sm">
          <div className="w-full sm:w-9/12 m-auto flex items-center gap-7 px-4 py-3 text-[12px] font-semibold uppercase whitespace-nowrap">
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => {
                  setCategoryMenuOpen(!categoryMenuOpen);
                  setShopMenuOpen(false);
                }}
                className="flex items-center gap-2 rounded-full bg-[#2bbef9] px-5 py-3 text-white hover:bg-[#18aeea] transition-colors"
                aria-expanded={categoryMenuOpen}
              >
                <MenuIcon sx={{ fontSize: 18 }} />
                All Categories
                {categoryMenuOpen ? (
                  <ExpandLessIcon sx={{ fontSize: 18 }} />
                ) : (
                  <ExpandMoreIcon sx={{ fontSize: 18 }} />
                )}
              </button>
              {categoryMenuOpen && (
                <div className="absolute left-0 top-full mt-2 z-[70] w-64 max-h-80 overflow-y-auto rounded-md border border-gray-100 bg-white p-2 normal-case shadow-xl">
                  <Link
                    to="/products"
                    onClick={() => setCategoryMenuOpen(false)}
                    className="block rounded px-3 py-2 text-sm hover:bg-sky-50 hover:text-sky-600"
                  >
                    All Products
                  </Link>
                  {(categories || []).map((category) => (
                    <Link
                      key={category._id}
                      to={`/products?category=${encodeURIComponent(category.name)}`}
                      onClick={() => setCategoryMenuOpen(false)}
                      className="block rounded px-3 py-2 text-sm hover:bg-sky-50 hover:text-sky-600"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/" className="hover:text-sky-500 transition-colors">
              Home
            </Link>
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShopMenuOpen(!shopMenuOpen);
                  setCategoryMenuOpen(false);
                }}
                className="flex items-center gap-1 hover:text-sky-500 transition-colors"
                aria-expanded={shopMenuOpen}
              >
                Shop <ExpandMoreIcon sx={{ fontSize: 16 }} />
              </button>
              {shopMenuOpen && (
                <div className="absolute left-0 top-full mt-3 z-[70] w-44 rounded-md border border-gray-100 bg-white p-2 normal-case shadow-xl">
                  <Link
                    to="/products"
                    onClick={() => setShopMenuOpen(false)}
                    className="block rounded px-3 py-2 text-sm hover:bg-sky-50 hover:text-sky-600"
                  >
                    All Products
                  </Link>
                  <Link
                    to="/products?sort=latest"
                    onClick={() => setShopMenuOpen(false)}
                    className="block rounded px-3 py-2 text-sm hover:bg-sky-50 hover:text-sky-600"
                  >
                    New Products
                  </Link>
                  <Link
                    to="/products?sort=discount"
                    onClick={() => setShopMenuOpen(false)}
                    className="block rounded px-3 py-2 text-sm hover:bg-sky-50 hover:text-sky-600"
                  >
                    Deals
                  </Link>
                </div>
              )}
            </div>
            <Link
              to={
                isAuthenticated && user?.role === "seller"
                  ? `/sellerstore/${user._id}`
                  : "/products"
              }
              className="hover:text-sky-500 transition-colors"
            >
              Store Single
            </Link>
            <Link
              to="/products?category=Bakery"
              className="hover:text-sky-500 transition-colors"
            >
              Bakery
            </Link>
            <Link
              to="/products?category=Beverages"
              className="hover:text-sky-500 transition-colors"
            >
              Beverages
            </Link>
            <Link
              to="/products?sort=latest"
              className="hover:text-sky-500 transition-colors"
            >
              Blog
            </Link>
            <Link
              to="/contact-us"
              className="hover:text-sky-500 transition-colors"
            >
              Contact
            </Link>
          </div>
        </nav>

        {/* Mobile Dropdown Menu (Drawer) */}
        {mobileMenuToggle && (
          <>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileMenuToggle(false)}
              className="sm:hidden fixed inset-0 bg-black/35 z-[55]"
            />
            <aside className="sm:hidden fixed top-0 left-0 bottom-0 w-[285px] max-w-[88vw] overflow-y-auto bg-white text-[#24324a] shadow-2xl z-[60]">
              <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
                <Link
                  to="/"
                  onClick={() => setMobileMenuToggle(false)}
                  className="h-8 flex items-center"
                >
                  <img
                    src={logo}
                    alt="MA-CART"
                    className="h-8 w-auto object-contain"
                  />
                </Link>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setMobileMenuToggle(false)}
                  className="text-gray-400 hover:text-rose-500"
                >
                  <CloseIcon sx={{ fontSize: 18 }} />
                </button>
              </div>

              <div className="px-4 py-3">
                <label className="block text-[9px] text-gray-400 mb-1">
                  Your Location
                </label>
                <select
                  className="w-full border border-gray-200 rounded px-2 py-2 text-[10px] text-sky-600 outline-none bg-white"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select a Location
                  </option>
                  <option value="karachi">Karachi</option>
                  <option value="lahore">Lahore</option>
                  <option value="islamabad">Islamabad</option>
                </select>
              </div>

              <div className="px-3">
                <button
                  type="button"
                  onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
                  className="w-full flex items-center justify-between rounded bg-[#2bbef9] px-3 py-2.5 text-[10px] font-bold uppercase text-white"
                >
                  <span className="flex items-center gap-2">
                    <MenuIcon sx={{ fontSize: 15 }} /> All Categories
                  </span>
                  {mobileCategoriesOpen ? (
                    <ExpandLessIcon sx={{ fontSize: 15 }} />
                  ) : (
                    <ExpandMoreIcon sx={{ fontSize: 15 }} />
                  )}
                </button>
                {mobileCategoriesOpen && (
                  <div className="border-x border-b border-gray-100 bg-white">
                    {(categories || []).map((category) => (
                      <Link
                        key={category._id}
                        to={`/products?category=${encodeURIComponent(category.name)}`}
                        onClick={() => setMobileMenuToggle(false)}
                        className="flex items-center justify-between border-b border-gray-100 px-3 py-2 text-[10px] hover:bg-sky-50 hover:text-sky-600"
                      >
                        <span>{category.name}</span>
                        <ExpandMoreIcon sx={{ fontSize: 13 }} />
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="px-4 pt-5">
                <p className="text-[9px] text-gray-400 mb-2">Site Navigation</p>
                <div className="divide-y divide-gray-100 border-t border-gray-100">
                  <Link
                    to="/"
                    onClick={() => setMobileMenuToggle(false)}
                    className="flex justify-between py-3 text-[10px]"
                  >
                    Home{" "}
                    <ExpandMoreIcon sx={{ fontSize: 13, color: "#aab2bd" }} />
                  </Link>
                  <Link
                    to="/products"
                    onClick={() => setMobileMenuToggle(false)}
                    className="flex justify-between py-3 text-[10px]"
                  >
                    Shop{" "}
                    <ExpandMoreIcon sx={{ fontSize: 13, color: "#aab2bd" }} />
                  </Link>
                  <Link
                    to={
                      isAuthenticated && user?.role === "seller"
                        ? `/sellerstore/${user._id}`
                        : "/products"
                    }
                    onClick={() => setMobileMenuToggle(false)}
                    className="py-3 text-[10px]"
                  >
                    Store Single
                  </Link>
                  <Link
                    to="/products?category=Bakery"
                    onClick={() => setMobileMenuToggle(false)}
                    className="py-3 text-[10px]"
                  >
                    Bakery
                  </Link>
                  <Link
                    to="/products?category=Beverages"
                    onClick={() => setMobileMenuToggle(false)}
                    className="py-3 text-[10px]"
                  >
                    Beverages
                  </Link>
                  <Link
                    to="/products?sort=latest"
                    onClick={() => setMobileMenuToggle(false)}
                    className="py-3 text-[10px]"
                  >
                    Blog
                  </Link>
                  <Link
                    to="/contact-us"
                    onClick={() => setMobileMenuToggle(false)}
                    className="py-3 text-[10px]"
                  >
                    Contact
                  </Link>
                </div>
              </div>

              <div className="mt-6 border-t border-gray-100 px-4 py-4 text-[9px] text-gray-400">
                <p>Copyright 2026 | MA-CART. All rights reserved.</p>
                <button
                  type="button"
                  className="flex w-full justify-between border-b border-gray-100 py-4 text-left text-gray-700"
                >
                  English <ExpandMoreIcon sx={{ fontSize: 13 }} />
                </button>
                <button
                  type="button"
                  className="flex w-full justify-between py-4 text-left text-gray-700"
                >
                  USD <ExpandMoreIcon sx={{ fontSize: 13 }} />
                </button>
              </div>
            </aside>
          </>
        )}

        {/* Bottom Category Row (Desktop Only) */}
        <div className="hidden sm:block text-[11px] text-white pb-2 px-4 bg-green-900/40">
          <div className="w-9/12 m-auto flex gap-3 opacity-90 font-medium overflow-x-auto whitespace-nowrap scrollbar-none">
            <span className="hover:underline cursor-pointer">
              watch for boys |
            </span>
            <span className="hover:underline cursor-pointer">makeup |</span>
            <span className="hover:underline cursor-pointer">
              kashmiri bangles |
            </span>
            <span className="hover:underline cursor-pointer">
              bags for girls |
            </span>
            <span className="hover:underline cursor-pointer">airpods</span>
          </div>
        </div>
      </header>

      {/* Spacer */}
      <div className="h-[150px] sm:h-[165px]"></div>

      {/* My Chats Modal */}
      <MyChatsModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
      />
    </div>
  );
};

export default Header;
