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
          <div className="sm:hidden absolute top-full left-0 w-full bg-green-900 text-white px-4 py-4 space-y-3 border-t border-green-700 shadow-xl z-50">
            {isAuthenticated === false ? (
              <div className="flex gap-4 font-semibold text-sm pb-3 border-b border-green-700">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuToggle(false)}
                  className="hover:underline"
                >
                  LOGIN
                </Link>
                <span>/</span>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuToggle(false)}
                  className="hover:underline"
                >
                  SIGN UP
                </Link>
              </div>
            ) : (
              <div className="pb-3 border-b border-green-700 relative overflow-visible">
                <div
                  className="font-medium flex justify-between items-center cursor-pointer"
                  onClick={() =>
                    setTogglePrimaryDropDown(!togglePrimaryDropDown)
                  }
                >
                  <div>
                    <p className="text-xs text-green-300">Hello,</p>
                    <p className="text-sm font-bold">{user.name}</p>
                  </div>
                  <span className="text-xs bg-green-800 px-2.5 py-1 rounded flex items-center gap-1">
                    Account{" "}
                    {togglePrimaryDropDown ? (
                      <ExpandLessIcon sx={{ fontSize: "14px" }} />
                    ) : (
                      <ExpandMoreIcon sx={{ fontSize: "14px" }} />
                    )}
                  </span>
                </div>

                {/* Mobile Primary DropDown Menu - Right Aligned */}
                {togglePrimaryDropDown && (
                  <div className="absolute right-0 sm:right-0 mt-2 w-48 bg-white text-black rounded-xl shadow-2xl z-[9999] border border-gray-100">
                    <PrimaryDropDownMenu
                      setTogglePrimaryDropDown={setTogglePrimaryDropDown}
                      user={user}
                      setIsChatModalOpen={setIsChatModalOpen}
                    />
                  </div>
                )}
              </div>
            )}
            <div className="flex flex-col space-y-2.5 text-xs font-medium pt-1">
              <Link
                to="/"
                onClick={() => setMobileMenuToggle(false)}
                className="hover:text-green-300"
              >
                HOME
              </Link>
              <Link
                to="/products"
                onClick={() => setMobileMenuToggle(false)}
                className="hover:text-green-300"
              >
                SHOP
              </Link>
              <Link
                to={
                  isAuthenticated && user?.role === "seller"
                    ? `/sellerstore/${user._id}`
                    : "/products"
                }
                onClick={() => setMobileMenuToggle(false)}
                className="hover:text-green-300"
              >
                STORE SINGLE
              </Link>
              <Link
                to="/products?category=Bakery"
                onClick={() => setMobileMenuToggle(false)}
                className="hover:text-green-300"
              >
                BAKERY
              </Link>
              <Link
                to="/products?category=Beverages"
                onClick={() => setMobileMenuToggle(false)}
                className="hover:text-green-300"
              >
                BEVERAGES
              </Link>
              <Link
                to="/contact-us"
                onClick={() => setMobileMenuToggle(false)}
                className="hover:text-green-300"
              >
                CONTACT
              </Link>
              <div className="border-t border-green-700 pt-2">
                <p className="mb-1 text-green-300">CATEGORIES</p>
                {(categories || []).slice(0, 8).map((category) => (
                  <Link
                    key={category._id}
                    to={`/products?category=${encodeURIComponent(category.name)}`}
                    onClick={() => setMobileMenuToggle(false)}
                    className="block py-1 hover:text-green-300"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
              <span className="cursor-pointer hover:text-green-300">
                SAVE MORE ON APP
              </span>
              <span className="cursor-pointer hover:text-green-300">
                SELL ON MA-CART
              </span>
              <span className="cursor-pointer hover:text-green-300">
                HELP & SUPPORT
              </span>
            </div>
          </div>
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
