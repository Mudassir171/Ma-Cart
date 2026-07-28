import React, { useEffect, useState } from 'react';
// import Dashboard from './Dashboard';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

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
            <div className="flex flex-col gap-6 animate-fadeIn pb-10 bg-gray-50 p-2 sm:p-4 rounded-3xl">
                
                {/* Header Banner - Green-800 & White */}
                <div className="relative overflow-hidden bg-green-800 p-6 sm:p-8 rounded-3xl shadow-xl text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-green-700">
                    <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-green-700/40 rounded-full blur-2xl pointer-events-none"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 bg-green-900/60 w-fit px-3 py-1 rounded-full text-green-200 text-xs font-semibold mb-2 border border-green-600/50">
                            <AnalyticsIcon fontSize="small" /> Multi-Color Metrics Overview
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">Analytics Dashboard</h1>
                        <p className="text-green-100 text-xs sm:text-sm mt-1 max-w-md">
                            Real-time store performance tracked across revenue, orders, and dynamic status rates.
                        </p>
                    </div>

                    <div className="relative z-10 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 flex items-center gap-4 shadow-inner">
                        <div>
                            <p className="text-xs text-green-200 font-medium">Status</p>
                            <p className="text-lg font-bold text-white flex items-center gap-1">
                                <TrendingUpIcon fontSize="small" className="text-yellow-400" /> Active
                            </p>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-gray-200">
                        <div className="w-10 h-10 border-4 border-green-800 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-500 text-sm font-medium mt-4">Loading stats...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        
                        {/* 1. Total Revenue Card (Green-800 Theme) */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 flex flex-col justify-between relative overflow-hidden group hover:border-green-800 transition-all">
                            <div className="flex items-center justify-between">
                                <div className="w-12 h-12 rounded-2xl bg-green-800 text-white flex items-center justify-center text-lg shadow-md">
                                    <AttachMoneyIcon />
                                </div>
                                <span className="text-[11px] font-bold text-green-800 bg-green-50 px-3 py-1 rounded-full border border-green-200">Revenue</span>
                            </div>
                            <div className="mt-6">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Earnings</p>
                                <h3 className="text-3xl font-black text-gray-900 mt-1">${analytics.totalRevenue.toFixed(2)}</h3>
                                <p className="text-xs text-gray-500 mt-1">Total accumulated sales.</p>
                            </div>
                        </div>

                        {/* 2. Total Orders Card (Blue Theme) */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 flex flex-col justify-between relative overflow-hidden group hover:border-blue-600 transition-all">
                            <div className="flex items-center justify-between">
                                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-lg shadow-md">
                                    <ShoppingBagIcon />
                                </div>
                                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">Orders</span>
                            </div>
                            <div className="mt-6">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Orders</p>
                                <h3 className="text-3xl font-black text-gray-900 mt-1">{analytics.totalOrders}</h3>
                                <p className="text-xs text-gray-500 mt-1">Successfully registered orders.</p>
                            </div>
                        </div>

                        {/* 3. Total Products Card (Gray & White Modern Theme) */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 flex flex-col justify-between relative overflow-hidden group hover:border-gray-800 transition-all">
                            <div className="flex items-center justify-between">
                                <div className="w-12 h-12 rounded-2xl bg-gray-800 text-white flex items-center justify-center text-lg shadow-md">
                                    <Inventory2Icon />
                                </div>
                                <span className="text-[11px] font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">Products</span>
                            </div>
                            <div className="mt-6">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Store Inventory</p>
                                <h3 className="text-3xl font-black text-gray-900 mt-1">{analytics.productsCount} Items</h3>
                                <p className="text-xs text-gray-500 mt-1">Active products listed.</p>
                            </div>
                        </div>

                        {/* 4. Cart Abandonment Rate (Yellow Theme) */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 flex flex-col justify-between relative overflow-hidden group hover:border-yellow-500 transition-all">
                            <div className="flex items-center justify-between">
                                <div className="w-12 h-12 rounded-2xl bg-yellow-500 text-white flex items-center justify-center text-lg shadow-md">
                                    <DonutLargeIcon />
                                </div>
                                <span className="text-[11px] font-bold text-yellow-700 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">Warning</span>
                            </div>
                            <div className="mt-6">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Cart Abandonment Rate</p>
                                <h3 className="text-3xl font-black text-gray-900 mt-1">54%</h3>
                                <p className="text-xs text-gray-500 mt-1">Users left items in cart.</p>
                            </div>
                        </div>

                        {/* 5. Return & Refund Rate (Red Theme) */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 flex flex-col justify-between relative overflow-hidden group hover:border-red-600 transition-all">
                            <div className="flex items-center justify-between">
                                <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center text-lg shadow-md">
                                    <WarningAmberIcon />
                                </div>
                                <span className="text-[11px] font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">Alert</span>
                            </div>
                            <div className="mt-6">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Return & Refund Rate</p>
                                <h3 className="text-3xl font-black text-gray-900 mt-1">15%</h3>
                                <p className="text-xs text-gray-500 mt-1">Processed product returns.</p>
                            </div>
                        </div>

                        {/* 6. Shipping & Delivery Rate (Green-800 & White Card) */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 flex flex-col justify-between relative overflow-hidden group hover:border-green-800 transition-all">
                            <div className="flex items-center justify-between">
                                <div className="w-12 h-12 rounded-2xl bg-green-700 text-white flex items-center justify-center text-lg shadow-md">
                                    <LocalShippingIcon />
                                </div>
                                <span className="text-[11px] font-bold text-green-800 bg-green-50 px-3 py-1 rounded-full border border-green-200">Logistics</span>
                            </div>
                            <div className="mt-6">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Delivery Success Rate</p>
                                <h3 className="text-3xl font-black text-gray-900 mt-1">92%</h3>
                                <p className="text-xs text-gray-500 mt-1">On-time delivered orders.</p>
                            </div>
                        </div>

                    </div>
                )}

            </div>
    );
};

export default Analytics;