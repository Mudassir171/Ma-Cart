import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Searchbar from './Searchbar';
import logo from '../../../assets/images/logo.png';
import PrimaryDropDownMenu from './PrimaryDropDownMenu';

const Header = () => {
    const { isAuthenticated, user } = useSelector((state) => state.user);
    const { cartItems } = useSelector(state => state.cart);
    const { wishlistItems } = useSelector((state) => state.wishlist);

    const [togglePrimaryDropDown, setTogglePrimaryDropDown] = useState(false);
    const [mobileMenuToggle, setMobileMenuToggle] = useState(false);

    // Ref for handling outside click to close dropdown/menu
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setTogglePrimaryDropDown(false);
                setMobileMenuToggle(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div ref={dropdownRef}>
            <header className="bg-green-800 fixed top-0 w-full z-50 shadow-md">
                {/* Top Utility Links (Desktop Only) */}
                <div className="hidden sm:block text-[11px] text-white py-1 border-b border-green-700">
                    <div className="w-full sm:w-9/12 m-auto flex justify-end gap-5 px-4 font-medium tracking-wide">
                        <span className="cursor-pointer hover:underline">SAVE MORE ON APP</span>
                        <span className="cursor-pointer hover:underline">SELL ON MA-CART</span>
                        <span className="cursor-pointer hover:underline">HELP & SUPPORT</span>
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
                                    <span className="text-xs ml-1 font-medium">Menu</span>
                                </button>
                            </div>

                            {/* Logo */}
                            <Link className="h-7 sm:h-9 flex items-center shrink-0" to="/">
                                <img draggable="false" className="h-7 sm:h-10 w-auto object-contain" src={logo} alt="MA-CART" />
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
                                    <Link to="/login" className="hover:underline">LOGIN</Link>
                                    <span>|</span>
                                    <Link to="/register" className="hover:underline">SIGN UP</Link>
                                </div>
                            ) : (
                                /* Account Wrapper with relative positioning for dropdown */
                                <div className="relative hidden sm:block">
                                    <span 
                                        className="flex items-center font-medium gap-1 cursor-pointer hover:opacity-80" 
                                        onClick={() => setTogglePrimaryDropDown(!togglePrimaryDropDown)}
                                    >
                                        {user.name && user.name.split(" ", 1)}
                                        {togglePrimaryDropDown ? <ExpandLessIcon sx={{ fontSize: "16px" }} /> : <ExpandMoreIcon sx={{ fontSize: "16px" }} />}
                                    </span>

                                    {/* Primary DropDown Menu (Desktop - Directly under Account) */}
                                    {togglePrimaryDropDown && (
                                        <div className="absolute right-1 top-5 mt-1 z-50">
                                            <PrimaryDropDownMenu setTogglePrimaryDropDown={setTogglePrimaryDropDown} user={user} />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Wishlist */}
                            <Link to="/wishlist" className="relative hover:opacity-85 flex items-center p-1">
                                <FavoriteIcon sx={{ fontSize: { xs: '24px', sm: '26px' } }} />
                                {wishlistItems.length > 0 && (
                                    <div className="w-4 h-4 bg-orange-500 text-white text-[9px] rounded-full absolute -top-0.5 -right-1 sm:-top-1 sm:-right-2 flex justify-center items-center font-bold">
                                        {wishlistItems.length}
                                    </div>
                                )}
                            </Link>

                            {/* Cart */}
                            <Link to="/cart" className="relative hover:opacity-85 flex items-center p-1">
                                <ShoppingCartIcon sx={{ fontSize: { xs: '24px', sm: '26px' } }} />
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

                {/* Mobile Dropdown Menu (Drawer) */}
                {mobileMenuToggle && (
                    <div className="sm:hidden absolute top-full left-0 w-full bg-green-900 text-white px-4 py-4 space-y-3 border-t border-green-700 shadow-xl z-50">
                        {isAuthenticated === false ? (
                            <div className="flex gap-4 font-semibold text-sm pb-3 border-b border-green-700">
                                <Link to="/login" onClick={() => setMobileMenuToggle(false)} className="hover:underline">LOGIN</Link>
                                <span>/</span>
                                <Link to="/register" onClick={() => setMobileMenuToggle(false)} className="hover:underline">SIGN UP</Link>
                            </div>
                        ) : (
                            <div className="pb-3 border-b border-green-700">
                                <div 
                                    className="font-medium flex justify-between items-center cursor-pointer"
                                    onClick={() => setTogglePrimaryDropDown(!togglePrimaryDropDown)}
                                >
                                    <div>
                                        <p className="text-xs text-green-300">Hello,</p>
                                        <p className="text-sm font-bold">{user.name}</p>
                                    </div>
                                    <span className="text-xs bg-green-800 px-2.5 py-1 rounded flex items-center gap-1">
                                        Account {togglePrimaryDropDown ? <ExpandLessIcon sx={{ fontSize: "14px" }} /> : <ExpandMoreIcon sx={{ fontSize: "14px" }} />}
                                    </span>
                                </div>

                                {/* Mobile Primary DropDown Menu */}
                                {togglePrimaryDropDown && (
                                    <div className="mt-3 bg-white text-black rounded shadow-lg overflow-hidden">
                                        <PrimaryDropDownMenu setTogglePrimaryDropDown={setTogglePrimaryDropDown} user={user} />
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="flex flex-col space-y-2.5 text-xs font-medium pt-1">
                            <span className="cursor-pointer hover:text-green-300">SAVE MORE ON APP</span>
                            <span className="cursor-pointer hover:text-green-300">SELL ON MA-CART</span>
                            <span className="cursor-pointer hover:text-green-300">HELP & SUPPORT</span>
                        </div>
                    </div>
                )}

                {/* Bottom Category Row (Desktop Only) */}
                <div className="hidden sm:block text-[11px] text-white pb-2 px-4 bg-green-900/40">
                    <div className="w-9/12 m-auto flex gap-3 opacity-90 font-medium overflow-x-auto whitespace-nowrap scrollbar-none">
                        <span className="hover:underline cursor-pointer">watch for boys |</span>
                        <span className="hover:underline cursor-pointer">makeup |</span>
                        <span className="hover:underline cursor-pointer">kashmiri bangles |</span>
                        <span className="hover:underline cursor-pointer">bags for girls |</span>
                        <span className="hover:underline cursor-pointer">airpods</span>
                    </div>
                </div>
            </header>

            {/* Spacer */}
            <div className="h-20 sm:h-20"></div>
        </div>
    );
};

export default Header;