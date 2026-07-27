import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import InventoryIcon from '@mui/icons-material/Inventory';
import GroupIcon from '@mui/icons-material/Group';
import ReviewsIcon from '@mui/icons-material/Reviews';
import AddBoxIcon from '@mui/icons-material/AddBox';
import LogoutIcon from '@mui/icons-material/Logout';
import PayoutIcon from '@mui/icons-material/AccountBalanceWallet';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import CloseIcon from '@mui/icons-material/Close';
import Avatar from '@mui/material/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import './Sidebar.css';
import { useSnackbar } from 'notistack';
import { logoutUser } from '../../../actions/userAction';

const navMenu = [
    { icon: <EqualizerIcon />, label: "Dashboard", ref: "/admin/dashboard" },
    { icon: <ShoppingBagIcon />, label: "Orders", ref: "/admin/orders" },
    { icon: <InventoryIcon />, label: "Products", ref: "/admin/products" },
    { icon: <AddBoxIcon />, label: "Add Product", ref: "/admin/new_product" },
    { icon: <InventoryIcon />, label: "Categories", ref: "/admin/categories" },
    { icon: <AddBoxIcon />, label: "Add Category", ref: "/admin/new_category" },
    { icon: <GroupIcon />, label: "Users", ref: "/admin/users" },
    { icon: <GroupIcon />, label: "Pending Sellers", ref: "/admin/sellers" },
    { icon: <GroupIcon />, label: "All Sellers", ref: "/admin/all_seller" },
    { icon: <ReviewsIcon />, label: "Reviews", ref: "/admin/reviews" },
    { icon: <PayoutIcon />, label: "Payouts", ref: "/admin/payouts" },
    { icon: <AccountBoxIcon />, label: "My Profile", ref: "/account" },
    { icon: <LogoutIcon />, label: "Logout" },
];

const Sidebar = ({ activeTab, setToggleSidebar }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const { user } = useSelector((state) => state.user);

    const handleLogout = () => {
        dispatch(logoutUser());
        enqueueSnackbar("Logout Successfully", { variant: "success" });
        navigate("/login");
    };

    return (
        <aside className="sidebar z-20 sm:z-0 block min-h-screen fixed left-0 top-[60px] bottom-0 w-[85%] sm:w-1/5 bg-gray-800 text-white overflow-y-auto overflow-x-hidden border-r border-gray-700/50 shadow-2xl transition-all duration-300">
            
            {/* User Profile Card Header */}
            <div className="sticky top-0 z-20 bg-gray-800/95 backdrop-blur-md pt-4 pb-3 px-3.5 border-b border-gray-700/60 shadow-md">
                <div className="flex items-center gap-3 bg-gray-700/60 p-3 rounded-2xl border border-gray-600/40 shadow-inner">
                    <Avatar 
                        alt="Avatar" 
                        src={user?.avatar?.url} 
                        className="border-2 border-indigo-400 shadow-md"
                    />
                    <div className="flex flex-col gap-0.5 overflow-hidden">
                        <span className="font-semibold text-base text-gray-100 truncate">{user?.name}</span>
                        <span className="text-gray-400 text-xs truncate">{user?.email}</span>
                    </div>
                    {/* Close button for mobile */}
                    <button 
                        onClick={() => setToggleSidebar(false)} 
                        className="sm:hidden bg-gray-800/80 hover:bg-red-500/20 hover:text-red-400 text-gray-300 ml-auto rounded-full w-9 h-9 flex items-center justify-center transition-all duration-200"
                        aria-label="Close Sidebar"
                    >
                        <CloseIcon fontSize="small" />
                    </button>
                </div>
            </div>

            {/* Navigation Menu List */}
            <div className="flex flex-col w-full gap-1.5 py-4 px-3">
                {navMenu.map((item, index) => {
                    const { icon, label, ref } = item;
                    const isActive = activeTab === index;

                    return (
                        <React.Fragment key={index}>
                            {label === "Logout" ? (
                                <button 
                                    onClick={handleLogout} 
                                    className="group relative flex gap-3.5 items-center py-3 px-4 font-medium w-full text-left rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 mt-2 border border-transparent hover:border-red-500/20"
                                >
                                    <span className="transition-transform duration-200 group-hover:scale-110">{icon}</span>
                                    <span className="text-sm tracking-wide">{label}</span>
                                </button>
                            ) : (
                                <Link 
                                    to={ref} 
                                    onClick={() => setToggleSidebar && setToggleSidebar(false)}
                                    className={`group relative flex gap-3.5 items-center py-3 px-4 font-medium rounded-xl transition-all duration-200 ${
                                        isActive 
                                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-semibold" 
                                            : "text-gray-300 hover:bg-gray-700/60 hover:text-white hover:translate-x-1"
                                    }`}
                                >
                                    {/* Active glowing indicator pill on the left */}
                                    {isActive && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-white rounded-r-full shadow-sm" />
                                    )}
                                    <span className={`transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-white" : "text-gray-400 group-hover:text-indigo-400"}`}>
                                        {icon}
                                    </span>
                                    <span className="text-sm tracking-wide">{label}</span>
                                </Link>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </aside>
    );
};

export default Sidebar;