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
    const { cartItems } = useSelector(state => state.cart);
    const { wishlistItems } = useSelector((state) => state.wishlist);

    const [togglePrimaryDropDown, setTogglePrimaryDropDown] = useState(false);
    const [mobileMenuToggle, setMobileMenuToggle] = useState(false);

    return (
        <>
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
                <div className="w-full sm:w-9/12 px-3 sm:px-4 m-auto flex justify-between items-center py-2.5 sm:py-3 gap-2 sm:gap-4 relative">

                    {/* Mobile Menu Icon */}
                    <div className="flex sm:hidden items-center text-white mr-1">
                        <button onClick={() => setMobileMenuToggle(!mobileMenuToggle)} className="focus:outline-none">
                            {mobileMenuToggle ? <CloseIcon /> : <MenuIcon />}
                        </button>
                    </div>

                    {/* Logo */}
                    <Link className="h-8 sm:h-9 flex items-center shrink-0" to="/">
                        <img draggable="false" className="h-7 sm:h-10 w-auto object-contain" src={logo} alt="MA-CART" />
                    </Link>

                    {/* Searchbar */}
                    <div className="flex-1 max-w-2xl mx-1 sm:mx-0">
                        <Searchbar />
                    </div>

                    {/* Right Navigation */}
                    <div className="flex items-center gap-3 sm:gap-6 text-white">
                        {isAuthenticated === false ? (
                            <div className="hidden sm:flex gap-3 font-medium text-sm text-white">
                                <Link to="/login" className="hover:underline">LOGIN</Link>
                                <span>|</span>
                                <Link to="/register" className="hover:underline">SIGN UP</Link>
                            </div>
                        ) : (
                            <span 
                                className="hidden sm:flex items-center font-medium gap-1 cursor-pointer hover:opacity-80" 
                                onClick={() => setTogglePrimaryDropDown(!togglePrimaryDropDown)}
                            >
                                {user.name && user.name.split(" ", 1)}
                                {togglePrimaryDropDown ? <ExpandLessIcon sx={{ fontSize: "16px" }} /> : <ExpandMoreIcon sx={{ fontSize: "16px" }} />}
                            </span>
                        )}

                        {/* Wishlist */}
                        <Link to="/wishlist" className="relative hover:opacity-85 flex items-center">
                            <FavoriteIcon sx={{ fontSize: { xs: '24px', sm: '26px' } }} />
                            {wishlistItems.length > 0 && (
                                <div className="w-4 h-4 bg-orange-500 text-white text-[9px] rounded-full absolute -top-1 -right-2 flex justify-center items-center font-bold">
                                    {wishlistItems.length}
                                </div>
                            )}
                        </Link>

                        {/* Cart */}
                        <Link to="/cart" className="relative hover:opacity-85 flex items-center">
                            <ShoppingCartIcon sx={{ fontSize: { xs: '24px', sm: '26px' } }} />
                            {cartItems.length > 0 && (
                                <div className="w-4 h-4 bg-orange-500 text-white text-[9px] rounded-full absolute -top-1 -right-2 flex justify-center items-center font-bold">
                                    {cartItems.length}
                                </div>
                            )}
                        </Link>
                    </div>

                    {/* Primary DropDown Menu (Desktop) */}
                    {togglePrimaryDropDown && (
                        <PrimaryDropDownMenu setTogglePrimaryDropDown={setTogglePrimaryDropDown} user={user} />
                    )}
                </div>

                {/* Mobile Dropdown / Drawer Menu */}
                {mobileMenuToggle && (
                    <div className="sm:hidden bg-green-900 text-white px-4 py-4 space-y-3 border-t border-green-700 animate-fadeIn">
                        {isAuthenticated === false ? (
                            <div className="flex gap-4 font-semibold text-sm pb-2 border-b border-green-700">
                                <Link to="/login" onClick={() => setMobileMenuToggle(false)} className="hover:underline">LOGIN</Link>
                                <span>/</span>
                                <Link to="/register" onClick={() => setMobileMenuToggle(false)} className="hover:underline">SIGN UP</Link>
                            </div>
                        ) : (
                            <div 
                                className="pb-2 border-b border-green-700 font-medium flex justify-between items-center cursor-pointer"
                                onClick={() => {
                                    setTogglePrimaryDropDown(!togglePrimaryDropDown);
                                    setMobileMenuToggle(false);
                                }}
                            >
                                <div>
                                    <p className="text-xs text-green-300">Hello,</p>
                                    <p className="text-sm font-bold">{user.name}</p>
                                </div>
                                <span className="text-xs bg-green-800 px-2 py-1 rounded flex items-center gap-1">
                                    Menu {togglePrimaryDropDown ? <ExpandLessIcon sx={{ fontSize: "14px" }} /> : <ExpandMoreIcon sx={{ fontSize: "14px" }} />}
                                </span>
                            </div>
                        )}
                        <div className="flex flex-col space-y-2 text-xs font-medium">
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
            <div className="h-14 sm:h-20"></div>
        </>
    );
};

export default Header;