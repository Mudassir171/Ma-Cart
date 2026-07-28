import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

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
                            <AnalyticsIcon fontSize="small" /> Business Insights
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Analytics & Performance</h1>
                        <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-md">
                            Monitor your shop's revenue, order growth, and product stats in real-time.
                        </p>
                    </div>

                    <div className="relative z-10 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 flex items-center gap-4 shadow-inner">
                        <div>
                            <p className="text-xs text-emerald-200 font-medium">Growth Status</p>
                            <p className="text-lg font-bold text-white flex items-center gap-1">
                                <TrendingUpIcon fontSize="small" className="text-emerald-400" /> Active & Live
                            </p>
                        </div>
                    </div>
                </div>

                {/* Loading or Stats Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
                        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-slate-500 text-sm font-medium mt-4">Loading analytics data...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        
                        {/* Total Revenue Card */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 relative overflow-hidden group hover:border-emerald-200 transition-all">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-0 opacity-50 group-hover:bg-emerald-100 transition-colors"></div>
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center text-xl shadow-lg shadow-emerald-600/20 relative z-10">
                                <AttachMoneyIcon />
                            </div>
                            <div className="relative z-10">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Revenue</p>
                                <h3 className="text-2xl font-black text-slate-900 mt-1">${analytics.totalRevenue.toFixed(2)}</h3>
                                <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md mt-1 inline-block">+10% from last month</span>
                            </div>
                        </div>

                        {/* Total Orders Card */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 relative overflow-hidden group hover:border-emerald-200 transition-all">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-0 opacity-50 group-hover:bg-emerald-100 transition-colors"></div>
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center text-xl shadow-lg shadow-teal-600/20 relative z-10">
                                <ShoppingBagIcon />
                            </div>
                            <div className="relative z-10">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Orders</p>
                                <h3 className="text-2xl font-black text-slate-900 mt-1">{analytics.totalOrders}</h3>
                                <span className="text-[11px] font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md mt-1 inline-block">Processed Orders</span>
                            </div>
                        </div>

                        {/* Total Products Card */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 relative overflow-hidden group hover:border-emerald-200 transition-all sm:col-span-2 lg:col-span-1">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-0 opacity-50 group-hover:bg-emerald-100 transition-colors"></div>
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-700 to-teal-600 text-white flex items-center justify-center text-xl shadow-lg shadow-emerald-700/20 relative z-10">
                                <Inventory2Icon />
                            </div>
                            <div className="relative z-10">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Products</p>
                                <h3 className="text-2xl font-black text-slate-900 mt-1">{analytics.productsCount}</h3>
                                <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md mt-1 inline-block">Active in Store</span>
                            </div>
                        </div>

                    </div>
                )}

            </div>
    );
};

export default Analytics;