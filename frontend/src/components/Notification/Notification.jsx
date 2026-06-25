import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import MetaData from '../Layouts/MetaData';
import MinCategory from '../Layouts/MinCategory';
import Sidebar from '../User/Sidebar';

// MUI Icons Import
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const Notification = () => {
    const dispatch = useDispatch();
    const { notifications } = useSelector((state) => state.notifications || { notifications: [] });
    
    const [activeTab, setActiveTab] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    const clearAll = () => {
        if(window.confirm("Delete all notifications?")) {
            dispatch({ type: "CLEAR_NOTIFICATIONS" });
        }
    };

    const deleteHandler = (id) => {
        dispatch({ type: "DELETE_NOTIFICATION", payload: id });
    };

    const filteredNotifications = notifications.filter(item => {
        const matchesTab = activeTab === "all" || item.type === activeTab;
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             item.message.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <>
            <MetaData title="MA-CART | Intelligence Center" />
            <MinCategory />
            
            <main className="w-full bg-green-900 min-h-screen pb-10">
                <div className="flex flex-col lg:flex-row gap-6 sm:w-11/12 m-auto py-8">
                    
                    <Sidebar activeTab={"notifications"} />

                    <div className="flex-1">
                        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                            
                            {/* HEADER SECTION */}
                            <div className="p-8 bg-gradient-to-br from-[#1e3a8a] via-[#2563eb] to-[#3b82f6] text-white">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <NotificationsActiveIcon fontSize="large" />
                                            <h1 className="text-3xl font-extrabold tracking-tight">Activity Center</h1>
                                        </div>
                                        <p className="text-green-100 opacity-90">Real-time updates for MA-CART</p>
                                    </div>
                                    <div className="flex gap-3">
                                        {notifications.length > 0 && (
                                            <button onClick={clearAll} className="px-5 py-2.5 bg-green-500/20 hover:bg-green-500/40 border border-green-400/30 rounded-xl text-sm font-bold backdrop-blur-md transition-all flex items-center gap-2">
                                                <ClearAllIcon fontSize="small" />
                                                Clear All
                                            </button>
                                        )}
                                        <div className="px-5 py-2.5 bg-white text-green-700 rounded-xl text-sm font-extrabold shadow-lg">
                                            {notifications.length} Total
                                        </div>
                                    </div>
                                </div>

                                {/* SEARCH BAR */}
                                <div className="mt-8 relative">
                                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-green-300" />
                                    <input 
                                        type="text" 
                                        placeholder="Find a specific notification..." 
                                        className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-green-200 outline-none focus:bg-white/20 transition-all backdrop-blur-sm"
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* TABS */}
                            <div className="flex border-b px-8 py-2 bg-gray-50/50 overflow-x-auto">
                                {["all", "order", "offer", "payment"].map((tab) => (
                                    <button 
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-6 py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${activeTab === tab ? 'border-green-600 text-green-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            {/* NOTIFICATION LIST */}
                            <div className="p-6 min-h-[400px]">
                                {filteredNotifications.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-gray-300">
                                        <NotificationsOffIcon sx={{ fontSize: 80, opacity: 0.3 }} />
                                        <h3 className="text-xl font-bold mt-4">Inbox is Empty</h3>
                                        <p className="text-sm">We'll notify you when something happens!</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-4">
                                        {filteredNotifications.map((item) => (
                                            <div 
                                                key={item.id}
                                                className={`group flex items-center gap-5 p-5 rounded-2xl border transition-all hover:shadow-lg hover:-translate-y-1 ${!item.isRead ? 'bg-gradient-to-r from-green-50/50 to-white border-green-100' : 'bg-white border-gray-100'}`}
                                            >
                                                {/* Icon with Color Logic */}
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${item.type === 'order' ? 'bg-green-50 text-green-600' : 'bg-green-50 text-green-600'}`}>
                                                    {item.type === 'order' ? <LocalShippingIcon /> : <LocalOfferIcon />}
                                                </div>

                                                <div className="flex-1">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <h4 className="font-bold text-gray-800 text-lg tracking-tight">{item.title}</h4>
                                                        <span className="text-[10px] font-bold text-green-500 uppercase tracking-tighter">{item.createdAt.split(',')[0]}</span>
                                                    </div>
                                                    <p className="text-gray-500 text-sm italic line-clamp-2 leading-snug">"{item.message}"</p>
                                                </div>

                                                {/* DELETE ACTION */}
                                                <div className="flex items-center gap-2">
                                                    <button 
                                                        onClick={() => deleteHandler(item.id)}
                                                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                        title="Delete"
                                                    >
                                                        <DeleteOutlineIcon />
                                                    </button>
                                                    <ArrowForwardIosIcon className="text-gray-200 group-hover:text-blue-500 transition-colors" sx={{ fontSize: 14 }} />
                                                </div>
                                            </div>
                                        )).reverse()}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Notification;