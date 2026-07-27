import React from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import OfflineBoltIcon from '@mui/icons-material/OfflineBolt';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatIcon from '@mui/icons-material/Chat';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { logoutUser } from '../../../actions/userAction';

const PrimaryDropDownMenu = ({ setTogglePrimaryDropDown, user }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const { wishlistItems } = useSelector((state) => state.wishlist);

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate("/login");
        enqueueSnackbar("Logout Successfully", { variant: "success" });
        setTogglePrimaryDropDown(false);
    };

    const navs = [
        {
            title: "Supercoin Zone",
            icon: <OfflineBoltIcon sx={{ fontSize: "18px" }} />,
            redirect: "/",
        },
        {
            title: "Flipkart Plus Zone",
            icon: <AddCircleIcon sx={{ fontSize: "18px" }} />,
            redirect: "/",
        },
        {
            title: "Orders",
            icon: <ShoppingBagIcon sx={{ fontSize: "18px" }} />,
            redirect: "/orders",
        },
        {
            title: "Wishlist",
            icon: <FavoriteIcon sx={{ fontSize: "18px" }} />,
            redirect: "/wishlist",
        },
        {
            title: "My Chats",
            icon: <ChatIcon sx={{ fontSize: "18px" }} />,
            redirect: "/",
        },
        {
            title: "Coupons",
            icon: <ConfirmationNumberIcon sx={{ fontSize: "18px" }} />,
            redirect: "/",
        },
        {
            title: "Gift Cards",
            icon: <AccountBalanceWalletIcon sx={{ fontSize: "18px" }} />,
            redirect: "/",
        },
        {
            title: "Notifications",
            icon: <NotificationsIcon sx={{ fontSize: "18px" }} />,
            redirect: "/notifications",
        },
    ];

    return (
        <div className="absolute w-64 -left-24 sm:-left-28 ml-2 top-10 bg-emerald-900 text-white shadow-[0_15px_50px_-10px_rgba(0,0,0,0.3)] rounded-2xl flex flex-col text-sm z-50 border border-emerald-700/50 overflow-hidden py-2 backdrop-blur-md">

            {/* --- USER WELCOME HEADER --- */}
            <div className="px-4 py-3 mx-2 mt-1 mb-2 bg-emerald-800/80 rounded-xl border border-emerald-700/50 flex flex-col">
                <span className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider">Signed in as</span>
                <span className="text-xs font-bold text-white truncate">{user?.name || "User"}</span>
            </div>

            {/* --- ADMIN DASHBOARD --- */}
            {user.role === "admin" && (
                <Link 
                    onClick={() => setTogglePrimaryDropDown(false)}
                    className="px-4 py-2.5 mx-2 rounded-xl flex gap-3 items-center hover:bg-emerald-800 hover:text-emerald-200 transition-all font-medium text-emerald-100 group" 
                    to="/admin/dashboard"
                >
                    <span className="text-emerald-400 group-hover:scale-110 transition-transform"><DashboardIcon sx={{ fontSize: "18px" }} /></span>
                    Admin Dashboard
                </Link>
            )}

            {/* --- SELLER DASHBOARD (Approved) --- */}
            {user.role === "seller" && user.status === "approved" && (
                <Link 
                    onClick={() => setTogglePrimaryDropDown(false)}
                    className="px-4 py-2.5 mx-2 rounded-xl flex gap-3 items-center hover:bg-emerald-800 hover:text-emerald-200 transition-all font-medium text-emerald-100 group" 
                    to="/seller/dashboard"
                >
                    <span className="text-emerald-400 group-hover:scale-110 transition-transform"><StorefrontIcon sx={{ fontSize: "18px" }} /></span>
                    Seller Dashboard
                </Link>
            )}

            {/* --- PENDING STATUS --- */}
            {user.role === "seller" && user.status === "pending" && (
                <div className="px-4 py-2.5 mx-2 rounded-xl flex gap-3 items-center bg-amber-500/20 text-amber-200 font-medium text-xs border border-amber-500/30">
                    <span className="text-amber-400"><StorefrontIcon sx={{ fontSize: "18px" }} /></span>
                    Approval Pending...
                </div>
            )}

            {/* --- BECOME A SELLER --- */}
            {user.role === "user" && (
                <Link 
                    onClick={() => setTogglePrimaryDropDown(false)}
                    className="px-4 py-2.5 mx-2 rounded-xl flex gap-3 items-center bg-amber-500 hover:bg-amber-600 transition-all text-white font-semibold shadow-md mb-1" 
                    to="/become-seller"
                >
                    <span className="text-white"><StorefrontIcon sx={{ fontSize: "18px" }} /></span>
                    <span>Become a Seller</span>
                </Link>
            )}

            {/* --- MY PROFILE --- */}
            <Link 
                onClick={() => setTogglePrimaryDropDown(false)}
                className="px-4 py-2.5 mx-2 rounded-xl flex gap-3 items-center hover:bg-emerald-800 hover:text-emerald-200 transition-all font-medium text-emerald-100 group" 
                to="/account"
            >
                <span className="text-emerald-300 group-hover:scale-110 transition-transform"><AccountCircleIcon sx={{ fontSize: "18px" }} /></span>
                My Profile
            </Link>

            <div className="my-1.5 border-t border-emerald-800 mx-3"></div>

            {/* --- DYNAMIC NAVS --- */}
            <div className="max-h-60 overflow-y-auto space-y-0.5 px-2 custom-scrollbar">
                {navs.map((item, i) => {
                    const { title, icon, redirect } = item;

                    return (
                        <React.Fragment key={i}>
                            {title === "Wishlist" ? (
                                <Link 
                                    onClick={() => setTogglePrimaryDropDown(false)}
                                    className="px-3 py-2.5 rounded-xl flex gap-3 items-center hover:bg-emerald-800 hover:text-white transition-all font-medium text-emerald-200 group" 
                                    to={redirect}
                                >
                                    <span className="text-rose-400 group-hover:scale-110 transition-transform">{icon}</span>
                                    <span className="flex-1">{title}</span>
                                    <span className="bg-emerald-800 text-[11px] font-bold px-2 py-0.5 text-emerald-200 rounded-full border border-emerald-700">
                                        {wishlistItems.length}
                                    </span>
                                </Link>
                            ) : (
                                <Link 
                                    onClick={() => setTogglePrimaryDropDown(false)}
                                    className="px-3 py-2.5 rounded-xl flex gap-3 items-center hover:bg-emerald-800 hover:text-white transition-all font-medium text-emerald-200 group" 
                                    to={redirect}
                                >
                                    <span className="text-emerald-400 group-hover:text-white group-hover:scale-110 transition-transform">{icon}</span>
                                    {title}
                                </Link>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>

            <div className="my-1.5 border-t border-emerald-800 mx-3"></div>

            {/* --- LOGOUT --- */}
            <div 
                className="px-4 py-2.5 mx-2 rounded-xl flex gap-3 items-center hover:bg-rose-500/20 hover:text-rose-200 text-rose-300 transition-all font-semibold cursor-pointer group mb-1" 
                onClick={handleLogout}
            >
                <span className="group-hover:scale-110 transition-transform"><PowerSettingsNewIcon sx={{ fontSize: "18px" }} /></span>
                Logout
            </div>

            {/* --- ARROW DESIGN --- */}
            <div className="absolute right-1/2 -top-1.5 transform translate-x-1/2">
                <div className="w-3 h-3 bg-emerald-900 rotate-45 border-t border-l border-emerald-700/50 shadow-[-2px_-2px_3px_rgba(0,0,0,0.1)]"></div>
            </div>
        </div>
    );
};

export default PrimaryDropDownMenu;