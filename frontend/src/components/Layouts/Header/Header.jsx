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
    const { cartItems } = useSelector(state => state.cart);
    const { wishlistItems } = useSelector((state) => state.wishlist);

    const [togglePrimaryDropDown, setTogglePrimaryDropDown] = useState(false);

    return (
        <>
            <header className="bg-green-800  fixed top-0 w-full z-50 shadow-md">
                {/* Top Utility Links */ }
                <div className="hidden sm:block text-[11px] text-white py-1">
                    <div className="w-full sm:w-9/12 m-auto flex justify-end gap-5 px-4 font-medium tracking-wide">
                        <span className="cursor-pointer hover:underline">SAVE MORE ON APP</span>
                        <span className="cursor-pointer hover:underline">SELL ON MA-CART</span>
                        <span className="cursor-pointer hover:underline">HELP & SUPPORT</span>
                    </div>
                </div>

                {/* Main Header Container */ }
                <div className="w-full sm:w-9/12 px-2 sm:px-4 m-auto flex justify-between items-center py-3 gap-4">

                    {/* Logo */ }
                    <Link className="h-9 flex items-center shrink-0" to="/">
                        <img draggable="false" className="h-8 sm:h-10 w-auto object-contain" src={ logo } alt="MA-CART" />
                    </Link>

                    {/* Searchbar */ }
                    <div className="flex-1 max-w-2xl">
                        <Searchbar />
                    </div>

                    {/* Right Navigation */ }
                    <div className="flex items-center gap-4 sm:gap-6 relative text-white">
                        { isAuthenticated === false ? (
                            <div className="flex gap-3 font-medium text-sm text-white">
                                <Link to="/login" className="hover:underline">LOGIN</Link>
                                <span>|</span>
                                <Link to="/register" className="hover:underline">SIGN UP</Link>
                            </div>
                        ) : (
                            <span className="flex items-center font-medium gap-1 cursor-pointer hover:opacity-80" onClick={ () => setTogglePrimaryDropDown(!togglePrimaryDropDown) }>
                                { user.name && user.name.split(" ", 1) }
                                { togglePrimaryDropDown ? <ExpandLessIcon sx={ { fontSize: "16px" } } /> : <ExpandMoreIcon sx={ { fontSize: "16px" } } /> }
                            </span>
                        ) }

                        { togglePrimaryDropDown && <PrimaryDropDownMenu setTogglePrimaryDropDown={ setTogglePrimaryDropDown } user={ user } /> }

                        {/* Wishlist */ }
                        <Link to="/wishlist" className="relative hover:opacity-80">
                            <FavoriteIcon />
                            { wishlistItems.length > 0 && (
                                <div className="w-4 h-4 bg-black text-[9px] rounded-full absolute -top-1 -right-2 flex justify-center items-center font-bold">
                                    { wishlistItems.length }
                                </div>
                            ) }
                        </Link>

                        {/* Cart */ }
                        <Link to="/cart" className="relative hover:opacity-80">
                            <ShoppingCartIcon />
                            { cartItems.length > 0 && (
                                <div className="w-4 h-4 bg-black text-[9px] rounded-full absolute -top-1 -right-2 flex justify-center items-center font-bold">
                                    { cartItems.length }
                                </div>
                            ) }
                        </Link>
                    </div>
                </div>

                {/* Bottom Category Row */ }
                <div className="hidden sm:block text-[11px] text-white pb-2 px-4">
                    <div className="w-9/12 m-auto flex gap-3 opacity-90 font-medium">
                        <span className="hover:underline cursor-pointer">watch for boys |</span>
                        <span className="hover:underline cursor-pointer">makeup |</span>
                        <span className="hover:underline cursor-pointer">kashmiri bangles |</span>
                        <span className="hover:underline cursor-pointer">bags for girls |</span>
                        <span className="hover:underline cursor-pointer">airpods</span>
                    </div>
                </div>
            </header>
            <div className="h-20 md:h-20"></div>
        </>
    );
};

export default Header;