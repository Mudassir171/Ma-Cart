import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Searchbar from './Searchbar';
import logo from '../../../assets/images/logo.png';
import PrimaryDropDownMenu from './PrimaryDropDownMenu';

const Header = () => {
    const { isAuthenticated, user } = useSelector((state) => state.user);
    const { cartItems } = useSelector((state) => state.cart);
    const { wishlistItems } = useSelector((state) => state.wishlist);

    const [togglePrimaryDropDown, setTogglePrimaryDropDown] = useState(false);

    return (
        <>
            <header className="bg-gradient-to-r from-emerald-900 via-green-800 to-emerald-950 fixed top-0 w-full z-50 shadow-xl border-b border-emerald-700/40 backdrop-blur-md">
                
                {/* Top Utility Links */}
                <div className="hidden sm:block text-[11px] text-emerald-100/80 py-1.5 bg-emerald-950/40 border-b border-emerald-800/30">
                    <div className="w-full sm:w-10/12 lg:w-9/12 m-auto flex justify-end gap-6 px-4 font-medium tracking-wider">
                        <span className="cursor-pointer hover:text-white transition-colors duration-200">SAVE MORE ON APP</span>
                        <span className="cursor-pointer hover:text-white transition-colors duration-200">SELL ON MA-CART</span>
                        <span className="cursor-pointer hover:text-white transition-colors duration-200">HELP & SUPPORT</span>
                    </div>
                </div>

                {/* Main Header Container */}
                <div className="w-full sm:w-10/12 lg:w-9/12 px-3 sm:px-4 m-auto flex justify-between items-center py-3.5 gap-4">

                    {/* Logo */}
                    <Link className="h-10 flex items-center shrink-0 group" to="/">
                        <img 
                            draggable="false" 
                            className="h-9 sm:h-11 w-auto object-contain transform group-hover:scale-105 transition-transform duration-300" 
                            src={logo} 
                            alt="MA-CART" 
                        />
                    </Link>

                    {/* Searchbar */}
                    <div className="flex-1 max-w-2xl">
                        <Searchbar />
                    </div>

                    {/* Right Navigation */}
                    <div className="flex items-center gap-5 sm:gap-7 relative text-white">
                        {isAuthenticated === false ? (
                            <div className="flex items-center gap-3 font-semibold text-xs sm:text-sm text-white">
                                <Link 
                                    to="/login" 
                                    className="px-3 py-1.5 rounded-lg bg-emerald-700/50 hover:bg-emerald-700 transition-all shadow-sm border border-emerald-600/50"
                                >
                                    LOGIN
                                </Link>
                                <span className="text-emerald-400">/</span>
                                <Link 
                                    to="/register" 
                                    className="hover:text-emerald-200 transition-colors"
                                >
                                    SIGN UP
                                </Link>
                            </div>
                        ) : (
                            <div 
                                className="flex items-center font-medium gap-1.5 cursor-pointer bg-emerald-900/60 hover:bg-emerald-700/50 px-3 py-1.5 rounded-full border border-emerald-600/40 transition-all shadow-inner"
                                onClick={() => setTogglePrimaryDropDown(!togglePrimaryDropDown)}
                            >
                                <span className="truncate max-w-[100px] text-sm">
                                    {user.name && user.name.split(" ", 1)}
                                </span>
                                {togglePrimaryDropDown ? <ExpandLessIcon sx={{ fontSize: "18px" }} /> : <ExpandMoreIcon sx={{ fontSize: "18px" }} />}
                            </div>
                        )}

                        {togglePrimaryDropDown && (
                            <div className="absolute right-0 top-12">
                                <PrimaryDropDownMenu setTogglePrimaryDropDown={setTogglePrimaryDropDown} user={user} />
                            </div>
                        )}

                        {/* Wishlist */}
                        <Link to="/wishlist" className="relative p-2 rounded-full hover:bg-emerald-700/40 transition-all text-emerald-100 hover:text-white">
                            <FavoriteIcon sx={{ fontSize: "24px" }} />
                            {wishlistItems.length > 0 && (
                                <div className="w-5 h-5 bg-amber-400 text-slate-950 text-[10px] rounded-full absolute -top-0.5 -right-0.5 flex justify-center items-center font-extrabold shadow-md animate-pulse">
                                    {wishlistItems.length}
                                </div>
                            )}
                        </Link>

                        {/* Cart */}
                        <Link to="/cart" className="relative p-2 rounded-full hover:bg-emerald-700/40 transition-all text-emerald-100 hover:text-white">
                            <ShoppingCartIcon sx={{ fontSize: "24px" }} />
                            {cartItems.length > 0 && (
                                <div className="w-5 h-5 bg-amber-400 text-slate-950 text-[10px] rounded-full absolute -top-0.5 -right-0.5 flex justify-center items-center font-extrabold shadow-md animate-pulse">
                                    {cartItems.length}
                                </div>
                            )}
                        </Link>
                    </div>
                </div>

                {/* Bottom Category Row */}
                <div className="hidden sm:block text-[11px] text-emerald-100/90 pb-2.5 px-4 bg-emerald-950/20">
                    <div className="w-10/12 lg:w-9/12 m-auto flex flex-wrap gap-4 font-medium tracking-wide">
                        <span className="hover:text-amber-300 hover:underline cursor-pointer transition-colors">watch for boys</span>
                        <span className="text-emerald-600">|</span>
                        <span className="hover:text-amber-300 hover:underline cursor-pointer transition-colors">makeup</span>
                        <span className="text-emerald-600">|</span>
                        <span className="hover:text-amber-300 hover:underline cursor-pointer transition-colors">kashmiri bangles</span>
                        <span className="text-emerald-600">|</span>
                        <span className="hover:text-amber-300 hover:underline cursor-pointer transition-colors">bags for girls</span>
                        <span className="text-emerald-600">|</span>
                        <span className="hover:text-amber-300 hover:underline cursor-pointer transition-colors">airpods</span>
                    </div>
                </div>
            </header>
            
            {/* Spacing placeholder to prevent content hiding under fixed header */}
            <div className="h-24 sm:h-28"></div>
        </>
    );
};

export default Header;