import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminProducts } from '../../actions/productAction';
import { getAllOrders } from '../../actions/orderAction';
import { getAllUsers } from '../../actions/userAction';
import MetaData from '../Layouts/MetaData';
import BackdropLoader from '../Layouts/BackdropLoader';
import { 
    Inventory2, 
    ShoppingCart, 
    Group, 
    Storefront, 
    AttachMoney, 
    Assessment,
    AdminPanelSettings,
    CheckCircle,
    Warning,
    Category,
    HourglassEmpty
} from '@mui/icons-material';

// Chart.js imports
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Pie, Bar, Line, Scatter, Radar } from 'react-chartjs-2';

ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend,
    Filler
);

const Analytics = () => {
    const dispatch = useDispatch();

    const { products, loading: productLoading } = useSelector((state) => state.products);
    const { orders, loading: orderLoading } = useSelector((state) => state.allOrders || { orders: [] });
    const { users, loading: userLoading } = useSelector((state) => state.users || { users: [] });
    const { user } = useSelector((state) => state.user);

    const [activeTab, setActiveTab] = useState('combined');

    useEffect(() => {
        dispatch(getAdminProducts());
        dispatch(getAllOrders());
        dispatch(getAllUsers());
    }, [dispatch]);

    // --- CALCULATIONS ---
    const sellerProducts = products?.filter(p => p.user && (p.user === user?._id || p.user?._id === user?._id)) || [];
    const totalSellerProducts = sellerProducts.length;
    const sellerOutOfStock = sellerProducts.filter(p => p.stock === 0).length;
    
    const sellerOrders = orders?.filter(order => 
        order.orderItems?.some(item => item.seller === user?._id || item.seller?._id === user?._id)
    ) || [];
    const totalSellerOrders = sellerOrders.length;
    const totalSellerRevenue = sellerOrders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);
    const sellerDeliveredOrders = sellerOrders.filter(o => o.orderStatus === 'Delivered').length;

    const adminProducts = products?.filter(p => !p.user || p.user === user?._id) || [];
    const totalAdminProducts = adminProducts.length;
    const totalAdminOrders = orders?.length || 0;
    const totalAdminRevenue = orders?.reduce((acc, order) => acc + (order.totalPrice || 0), 0) || 0;
    const pendingAdminOrders = orders?.filter(o => o.orderStatus === 'Processing').length || 0;

    const totalProducts = products?.length || 0;
    const totalOrders = orders?.length || 0;
    const totalUsers = users?.length || 0;
    const sellersList = users?.filter(u => u.role === 'seller') || [];
    const totalSellers = sellersList.length;
    const totalPlatformRevenue = totalAdminRevenue;
    const outOfStockGlobal = products?.filter(p => p.stock === 0).length || 0;

    const isLoading = productLoading || orderLoading || userLoading;

    // --- LIVE DYNAMIC CHART DATA CONFIGURATIONS ---

    // 1. Product Categories Distribution (Pie Chart) - Live Categories se data
    const categoryCounts = products?.reduce((acc, product) => {
        const cat = product.category || 'Uncategorized';
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
    }, {}) || {};

    const pieData = {
        labels: Object.keys(categoryCounts).length > 0 ? Object.keys(categoryCounts) : ['No Categories'],
        datasets: [{
            data: Object.keys(categoryCounts).length > 0 ? Object.values(categoryCounts) : [1],
            backgroundColor: ['#ef4444', '#22c55e', '#3b82f6', '#a855f7', '#1e293b', '#10b981', '#f59e0b'],
            borderWidth: 1
        }]
    };

    // 2. Stock Status Overview (Bar Chart) - In Stock vs Out of Stock
    const inStockCount = products?.filter(p => p.stock > 0).length || 0;
    const barData = {
        labels: ['Products Stock Status'],
        datasets: [
            {
                label: 'In Stock',
                data: [inStockCount],
                backgroundColor: '#22c55e',
            },
            {
                label: 'Out of Stock',
                data: [outOfStockGlobal],
                backgroundColor: '#ef4444',
            }
        ]
    };

    // 3. Monthly Revenue Trend (Line Chart) - Orders createdAt ke mutabiq
    const monthlyRevenue = orders?.reduce((acc, order) => {
        if (!order.createdAt) return acc;
        const month = new Date(order.createdAt).toLocaleString('default', { month: 'short', year: '2-digit' });
        acc[month] = (acc[month] || 0) + (order.totalPrice || 0);
        return acc;
    }, {}) || {};

    const sortedMonths = Object.keys(monthlyRevenue).sort((a, b) => new Date(a) - new Date(b));
    const lineData = {
        labels: sortedMonths.length > 0 ? sortedMonths : ['No Data'],
        datasets: [
            {
                label: 'Revenue Total (₹)',
                data: sortedMonths.length > 0 ? sortedMonths.map(m => monthlyRevenue[m]) : [0],
                borderColor: '#ef4444',
                backgroundColor: '#ef4444',
                tension: 0.1
            }
        ]
    };

    // 4. Order Status Breakdown (Horizontal Bar Chart)
    const processingOrders = orders?.filter(o => o.orderStatus === 'Processing').length || 0;
    const shippedOrders = orders?.filter(o => o.orderStatus === 'Shipped').length || 0;
    const deliveredOrdersCount = orders?.filter(o => o.orderStatus === 'Delivered').length || 0;

    const horizontalBarData = {
        labels: ['Processing', 'Shipped', 'Delivered'],
        datasets: [
            {
                label: 'Orders Count',
                data: [processingOrders, shippedOrders, deliveredOrdersCount],
                backgroundColor: ['#f59e0b', '#3b82f6', '#22c55e'],
            }
        ]
    };

    // 5. User Roles Distribution (Scatter / Bar alternative - Using Scatter with live user metrics)
    const scatterData = {
        datasets: [
            {
                label: 'Users Activity Metrics',
                data: users?.map((u, index) => ({ x: index + 1, y: u.role === 'admin' ? 100 : u.role === 'seller' ? 50 : 10 })) || [],
                backgroundColor: '#3b82f6',
            }
        ]
    };

    // 6. Platform Entities Overview (Radar Chart)
    const radarData = {
        labels: ['Products', 'Orders', 'Users', 'Sellers', 'Out of Stock'],
        datasets: [
            {
                label: 'Platform Metrics Overview',
                data: [totalProducts, totalOrders, totalUsers, totalSellers, outOfStockGlobal],
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                borderColor: '#3b82f6',
                pointBackgroundColor: '#3b82f6',
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10 } } }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-8 font-sans">
            <MetaData title="Analytics Dashboard" />
            {isLoading && <BackdropLoader />}

            {/* HEADER & THEME TABS */}
            <div className="bg-white border-2 border-slate-900 p-6 rounded-2xl shadow-[4px_4px_0px_0px_#0f172a] mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black uppercase text-slate-900 tracking-wider">
                        Analytics Dashboard
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                        Live platform metrics & interactive visual graphs synced with your database backend.
                    </p>
                </div>
                
                <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200 gap-1 w-full sm:w-auto">
                    <button 
                        onClick={() => setActiveTab('combined')}
                        className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'combined' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                        Combined
                    </button>
                    <button 
                        onClick={() => setActiveTab('admin')}
                        className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'admin' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                        Admin ({totalAdminProducts})
                    </button>
                    <button 
                        onClick={() => setActiveTab('seller')}
                        className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'seller' ? 'bg-amber-500 text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                        Seller ({totalSellerProducts})
                    </button>
                </div>
            </div>

            {/* ================= COMBINED ================= */}
            {activeTab === 'combined' && (
                <div className="space-y-6">
                    <div className="flex items-center gap-2 text-slate-900 font-extrabold px-1 text-base uppercase tracking-wide">
                        <Assessment className="text-blue-600" />
                        <h2>Total Platform Summary</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
                        <div className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black uppercase text-slate-400">Total Revenue</p>
                                <h3 className="text-xl font-black text-slate-900 mt-1">₹{totalPlatformRevenue.toLocaleString()}</h3>
                            </div>
                            <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold shadow"><AttachMoney /></div>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black uppercase text-slate-400">Total Orders</p>
                                <h3 className="text-xl font-black text-slate-900 mt-1">{totalOrders}</h3>
                            </div>
                            <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold shadow"><ShoppingCart /></div>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black uppercase text-slate-400">Total Products</p>
                                <h3 className="text-xl font-black text-slate-900 mt-1">{totalProducts}</h3>
                            </div>
                            <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold shadow"><Inventory2 /></div>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black uppercase text-slate-400">Total Users</p>
                                <h3 className="text-xl font-black text-slate-900 mt-1">{totalUsers}</h3>
                            </div>
                            <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold shadow"><Group /></div>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black uppercase text-slate-400">Out of Stock</p>
                                <h3 className="text-xl font-black text-amber-600 mt-1">{outOfStockGlobal}</h3>
                            </div>
                            <div className="w-12 h-12 bg-amber-500 text-slate-900 rounded-xl flex items-center justify-center font-bold shadow"><Warning /></div>
                        </div>
                    </div>
                </div>
            )}

            {/* ================= ADMIN ANALYTICS ================= */}
            {activeTab === 'admin' && (
                <div className="space-y-6">
                    <div className="flex items-center gap-2 text-slate-900 font-extrabold px-1 text-base uppercase tracking-wide">
                        <AdminPanelSettings className="text-blue-600" />
                        <h2>Admin Analytics</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
                        <div className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black uppercase text-slate-400">System Revenue</p>
                                <h3 className="text-xl font-black text-slate-900 mt-1">₹{totalAdminRevenue.toLocaleString()}</h3>
                            </div>
                            <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold shadow"><AttachMoney /></div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black uppercase text-slate-400">System Orders</p>
                                <h3 className="text-xl font-black text-slate-900 mt-1">{totalAdminOrders}</h3>
                            </div>
                            <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold shadow"><ShoppingCart /></div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black uppercase text-slate-400">Admin Products</p>
                                <h3 className="text-xl font-black text-slate-900 mt-1">{totalAdminProducts}</h3>
                            </div>
                            <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold shadow"><Inventory2 /></div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black uppercase text-slate-400">Pending Orders</p>
                                <h3 className="text-xl font-black text-amber-600 mt-1">{pendingAdminOrders}</h3>
                            </div>
                            <div className="w-12 h-12 bg-amber-500 text-slate-900 rounded-xl flex items-center justify-center font-bold shadow"><HourglassEmpty /></div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black uppercase text-slate-400">Sellers Count</p>
                                <h3 className="text-xl font-black text-blue-600 mt-1">{totalSellers}</h3>
                            </div>
                            <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold shadow"><Storefront /></div>
                        </div>
                    </div>
                </div>
            )}

            {/* ================= SELLER ANALYTICS ================= */}
            {activeTab === 'seller' && (
                <div className="space-y-6">
                    <div className="flex items-center gap-2 text-slate-900 font-extrabold px-1 text-base uppercase tracking-wide">
                        <Storefront className="text-amber-500" />
                        <h2>Seller Analytics</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
                        <div className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black uppercase text-slate-400">Seller Revenue</p>
                                <h3 className="text-xl font-black text-slate-900 mt-1">₹{totalSellerRevenue.toLocaleString()}</h3>
                            </div>
                            <div className="w-12 h-12 bg-amber-500 text-slate-900 rounded-xl flex items-center justify-center font-bold shadow"><AttachMoney /></div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black uppercase text-slate-400">Orders Received</p>
                                <h3 className="text-xl font-black text-slate-900 mt-1">{totalSellerOrders}</h3>
                            </div>
                            <div className="w-12 h-12 bg-amber-500 text-slate-900 rounded-xl flex items-center justify-center font-bold shadow"><ShoppingCart /></div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black uppercase text-slate-400">Products Listed</p>
                                <h3 className="text-xl font-black text-slate-900 mt-1">{totalSellerProducts}</h3>
                            </div>
                            <div className="w-12 h-12 bg-amber-500 text-slate-900 rounded-xl flex items-center justify-center font-bold shadow"><Category /></div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black uppercase text-slate-400">Delivered Orders</p>
                                <h3 className="text-xl font-black text-blue-600 mt-1">{sellerDeliveredOrders}</h3>
                            </div>
                            <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold shadow"><CheckCircle /></div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black uppercase text-slate-400">Out of Stock</p>
                                <h3 className="text-xl font-black text-amber-600 mt-1">{sellerOutOfStock}</h3>
                            </div>
                            <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold shadow"><Warning /></div>
                        </div>
                    </div>
                </div>
            )}

            {/* ================= LIVE CHARTS GRID ================= */}
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 1. Category Distribution (Pie) */}
                <div className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] flex flex-col">
                    <h3 className="text-xs font-black uppercase text-slate-900 mb-4 tracking-wider text-center">Product Categories</h3>
                    <div className="relative h-64 w-full flex items-center justify-center">
                        <Pie data={pieData} options={chartOptions} />
                    </div>
                </div>

                {/* 2. Stock Counts (Bar) */}
                <div className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] flex flex-col">
                    <h3 className="text-xs font-black uppercase text-slate-900 mb-4 tracking-wider text-center">Inventory Stock Status</h3>
                    <div className="relative h-64 w-full flex items-center justify-center">
                        <Bar data={barData} options={chartOptions} />
                    </div>
                </div>

                {/* 3. Monthly Revenue Trend (Line) */}
                <div className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] flex flex-col">
                    <h3 className="text-xs font-black uppercase text-slate-900 mb-4 tracking-wider text-center">Revenue Trend (Monthly)</h3>
                    <div className="relative h-64 w-full flex items-center justify-center">
                        <Line data={lineData} options={chartOptions} />
                    </div>
                </div>

                {/* 4. Order Status Breakdown (Horizontal Bar) */}
                <div className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] flex flex-col">
                    <h3 className="text-xs font-black uppercase text-slate-900 mb-4 tracking-wider text-center">Orders Status Breakdown</h3>
                    <div className="relative h-64 w-full flex items-center justify-center">
                        <Bar data={horizontalBarData} options={{ ...chartOptions, indexAxis: 'y' }} />
                    </div>
                </div>

                {/* 5. User Activity (Scatter) */}
                <div className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] flex flex-col">
                    <h3 className="text-xs font-black uppercase text-slate-900 mb-4 tracking-wider text-center">User Activity Scatter</h3>
                    <div className="relative h-64 w-full flex items-center justify-center">
                        <Scatter data={scatterData} options={chartOptions} />
                    </div>
                </div>

                {/* 6. Platform Overview (Radar) */}
                <div className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] flex flex-col">
                    <h3 className="text-xs font-black uppercase text-slate-900 mb-4 tracking-wider text-center">Platform Entities Overview</h3>
                    <div className="relative h-64 w-full flex items-center justify-center">
                        <Radar data={radarData} options={chartOptions} />
                    </div>
                </div>

            </div>

        </div>
    );
};

export default Analytics;