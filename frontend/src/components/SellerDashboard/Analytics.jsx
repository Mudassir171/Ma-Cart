import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import ShowChartIcon from '@mui/icons-material/ShowChart';

const Analytics = () => {
    const [analytics, setAnalytics] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        productsCount: 0,
    });
    const [loading, setLoading] = useState(true);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const { data } = await axios.get('/api/v1/seller/analytics', { withCredentials: true });
                setAnalytics(data);
                setLoading(false);
            } catch (error) {
                enqueueSnackbar(error.response?.data?.message || "Failed to fetch analytics", { variant: "error" });
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, [enqueueSnackbar]);

    return (
            <div className="flex flex-col gap-6 animate-fadeIn pb-10">
                
                {/* Header Banner */}
                <div className="relative overflow-hidden bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 p-6 sm:p-8 rounded-3xl shadow-xl text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-600/30 rounded-full blur-2xl pointer-events-none"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 bg-emerald-900/40 w-fit px-3 py-1 rounded-full text-emerald-200 text-xs font-semibold mb-2 border border-emerald-600/30">
                            <AnalyticsIcon fontSize="small" /> Business Performance
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Analytics Dashboard</h1>
                        <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-md">
                            Comprehensive overview of your store's growth, revenue, and customer metrics.
                        </p>
                    </div>

                    <div className="relative z-10 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 flex items-center gap-4 shadow-inner">
                        <div>
                            <p className="text-xs text-emerald-200 font-medium">Performance Status</p>
                            <p className="text-lg font-bold text-white flex items-center gap-1">
                                <TrendingUpIcon fontSize="small" className="text-emerald-400" /> Optimal & Live
                            </p>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
                        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-slate-500 text-sm font-medium mt-4">Loading dashboard metrics...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Left Column: Small Metrics Cards */}
                        <div className="flex flex-col gap-6">
                            
                            {/* Shopping Cart / Conversion Style Card */}
                            <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden group hover:border-emerald-200 transition-all">
                                <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    <span>Shopping Cart Abandonment</span>
                                    <DonutLargeIcon className="text-emerald-600" fontSize="small" />
                                </div>
                                <div className="mt-3 flex items-baseline gap-2">
                                    <h3 className="text-3xl font-black text-slate-900">54%</h3>
                                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Stable</span>
                                </div>
                            </div>

                            {/* Average Order Value Card */}
                            <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden group hover:border-emerald-200 transition-all">
                                <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    <span>Average Order Value</span>
                                    <AttachMoneyIcon className="text-emerald-600" fontSize="small" />
                                </div>
                                <div className="mt-3 flex items-baseline gap-2">
                                    <h3 className="text-3xl font-black text-slate-900">${(analytics.totalRevenue / (analytics.totalOrders || 1)).toFixed(2)}</h3>
                                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Avg</span>
                                </div>
                            </div>

                            {/* Return and Refund Rate Card */}
                            <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden group hover:border-emerald-200 transition-all">
                                <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    <span>Return & Refund Rate</span>
                                    <ShowChartIcon className="text-emerald-600" fontSize="small" />
                                </div>
                                <div className="mt-3 flex items-baseline gap-2">
                                    <h3 className="text-3xl font-black text-slate-900">15%</h3>
                                    <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">Low Risk</span>
                                </div>
                            </div>

                        </div>

                        {/* Right / Center Columns: Main Core Statistics */}
                        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            
                            {/* Total Revenue Card */}
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden group hover:border-emerald-200 transition-all">
                                <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-50 rounded-bl-full -z-0 opacity-50 group-hover:bg-emerald-100 transition-colors"></div>
                                <div className="flex items-center justify-between relative z-10">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center text-lg shadow-lg shadow-emerald-600/20">
                                        <AttachMoneyIcon />
                                    </div>
                                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">Live Revenue</span>
                                </div>
                                <div className="mt-6 relative z-10">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Earnings</p>
                                    <h3 className="text-3xl font-black text-slate-900 mt-1">${analytics.totalRevenue.toFixed(2)}</h3>
                                    <p className="text-xs text-slate-500 mt-1">Accumulated from all delivered & processed items.</p>
                                </div>
                            </div>

                            {/* Total Orders Card */}
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden group hover:border-emerald-200 transition-all">
                                <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-50 rounded-bl-full -z-0 opacity-50 group-hover:bg-emerald-100 transition-colors"></div>
                                <div className="flex items-center justify-between relative z-10">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center text-lg shadow-lg shadow-teal-600/20">
                                        <ShoppingBagIcon />
                                    </div>
                                    <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">Orders Overview</span>
                                </div>
                                <div className="mt-6 relative z-10">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Orders</p>
                                    <h3 className="text-3xl font-black text-slate-900 mt-1">{analytics.totalOrders}</h3>
                                    <p className="text-xs text-slate-500 mt-1">Total customer transactions registered.</p>
                                </div>
                            </div>

                            {/* Total Products Card */}
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden group hover:border-emerald-200 transition-all sm:col-span-2">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-0 opacity-50 group-hover:bg-emerald-100 transition-colors"></div>
                                <div className="flex items-center justify-between relative z-10">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-700 to-teal-600 text-white flex items-center justify-center text-lg shadow-lg shadow-emerald-700/20">
                                        <Inventory2Icon />
                                    </div>
                                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">Inventory Status</span>
                                </div>
                                <div className="mt-6 relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Products in Store</p>
                                        <h3 className="text-3xl font-black text-slate-900 mt-1">{analytics.productsCount} Items</h3>
                                    </div>
                                    <button 
                                        onClick={() => window.location.href = '/seller/products'}
                                        className="bg-emerald-600 text-white text-xs font-bold px-5 py-3 rounded-2xl shadow-md shadow-emerald-600/30 hover:bg-emerald-700 transition-all"
                                    >
                                        Manage Inventory
                                    </button>
                                </div>
                            </div>

                        </div>

                    </div>
                )}

            </div>
    );
};

export default Analytics;