import React, { useState } from 'react';
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
    const { cartItems } = useSelector((state) => state.cart);
    const { wishlistItems } = useSelector((state) => state.wishlist);

    const [togglePrimaryDropDown, setTogglePrimaryDropDown] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            <header className="bg-green-800 fixed top-0 w-full z-50 shadow-md">
                
                {/* Top Utility Links (Desktop Only) */}
                <div className="hidden sm:block text-[11px] text-white py-1 bg-green-900/40 border-b border-green-700/30">
                    <div className="w-full sm:w-10/12 lg:w-9/12 m-auto flex justify-end gap-5 px-4 font-medium tracking-wide">
                        <span className="cursor-pointer hover:underline">SAVE MORE ON APP</span>
                        <span className="cursor-pointer hover:underline">SELL ON MA-CART</span>
                        <span className="cursor-pointer hover:underline">HELP & SUPPORT</span>
                    </div>
                </div>

                {/* Main Header Container */}
                <div className="w-full sm:w-10/12 lg:w-9/12 px-3 sm:px-4 m-auto flex justify-between items-center py-3 gap-2 sm:gap-4">

                    {/* Mobile Menu Toggle Button */}
                    <button 
                        className="sm:hidden text-white focus:outline-none p-1"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                    </button>

                    {/* Logo */}
                    <Link className="h-8 sm:h-9 flex items-center shrink-0" to="/">
                        <img draggable="false" className="h-7 sm:h-10 w-auto object-contain" src={logo} alt="MA-CART" />
                    </Link>

                    {/* Searchbar (Desktop & Tablet) */}
                    <div className="flex-1 max-w-2xl mx-1 sm:mx-0">
                        <Searchbar />
                    </div>

                    {/* Right Navigation (Cart, Wishlist, User/Auth) */}
                    <div className="flex items-center gap-3 sm:gap-6 relative text-white">
                        
                        {/* Wishlist */}
                        <Link to="/wishlist" className="relative hover:opacity-80 p-1">
                            <FavoriteIcon sx={{ fontSize: { xs: "22px", sm: "24px" } }} />
                            {wishlistItems.length > 0 && (
                                <div className="w-4 h-4 bg-black text-white text-[9px] rounded-full absolute -top-1 -right-1 flex justify-center items-center font-bold">
                                    {wishlistItems.length}
                                </div>
                            )}
                        </Link>

                        {/* Cart */}
                        <Link to="/cart" className="relative hover:opacity-80 p-1">
                            <ShoppingCartIcon sx={{ fontSize: { xs: "22px", sm: "24px" } }} />
                            {cartItems.length > 0 && (
                                <div className="w-4 h-4 bg-black text-white text-[9px] rounded-full absolute -top-1 -right-1 flex justify-center items-center font-bold">
                                    {cartItems.length}
                                </div>
                            )}
                        </Link>

                        {/* Auth / User Section (Desktop) */}
                        <div className="hidden sm:flex items-center">
                            {isAuthenticated === false ? (
                                <div className="flex gap-2 font-medium text-sm text-white items-center">
                                    <Link to="/login" className="hover:underline bg-green-700 px-3 py-1 rounded shadow-sm">LOGIN</Link>
                                    <span>|</span>
                                    <Link to="/register" className="hover:underline">SIGN UP</Link>
                                </div>
                            ) : (
                                <span className="flex items-center font-medium gap-1 cursor-pointer hover:opacity-80" onClick={() => setTogglePrimaryDropDown(!togglePrimaryDropDown)}>
                                    {user.name && user.name.split(" ", 1)}
                                    {togglePrimaryDropDown ? <ExpandLessIcon sx={{ fontSize: "16px" }} /> : <ExpandMoreIcon sx={{ fontSize: "16px" }} />}
                                </span>
                            )}
                        </div>

                        {togglePrimaryDropDown && (
                            <div className="absolute right-0 top-10">
                                <PrimaryDropDownMenu setTogglePrimaryDropDown={setTogglePrimaryDropDown} user={user} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Dropdown Menu (Opens when hamburger menu is clicked on small screens) */}
                {mobileMenuOpen && (
                    <div className="sm:hidden bg-green-900 px-4 py-3 border-t border-green-700 text-white flex flex-col gap-3">
                        {isAuthenticated === false ? (
                            <div className="flex gap-4 font-medium text-sm">
                                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="hover:underline bg-green-700 px-3 py-1.5 rounded text-center flex-1">LOGIN</Link>
                                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="hover:underline bg-green-700 px-3 py-1.5 rounded text-center flex-1">SIGN UP</Link>
                            </div>
                        ) : (
                            <div className="flex justify-between items-center py-1 border-b border-green-700">
                                <span className="font-medium">Hello, {user.name}</span>
                                <Link to="/account" onClick={() => setMobileMenuOpen(false)} className="text-xs underline">My Account</Link>
                            </div>
                        )}
                        <div className="flex flex-col gap-2 text-xs pt-1">
                            <span className="cursor-pointer hover:underline">SAVE MORE ON APP</span>
                            <span className="cursor-pointer hover:underline">SELL ON MA-CART</span>
                            <span className="cursor-pointer hover:underline">HELP & SUPPORT</span>
                        </div>
                    </div>
                )}

                {/* Bottom Category Row */}
                <div className="hidden sm:block text-[11px] text-white pb-2 px-4 bg-green-900/20">
                    <div className="w-9/12 m-auto flex gap-3 opacity-90 font-medium">
                        <span className="hover:underline cursor-pointer">watch for boys |</span>
                        <span className="hover:underline cursor-pointer">makeup |</span>
                        <span className="hover:underline cursor-pointer">kashmiri bangles |</span>
                        <span className="hover:underline cursor-pointer">bags for girls |</span>
                        <span className="hover:underline cursor-pointer">airpods</span>
                    </div>
                </div>
            </header>

            {/* Spacing to prevent content overlap */}
            <div className="h-16 sm:h-24"></div>
        </>
    );
};

export default Header;