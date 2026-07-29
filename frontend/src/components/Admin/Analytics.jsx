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
    const { users, loading: userLoading } = useSelector((state) => state.allUsers || { users: [] });
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

    // --- CHART DATA CONFIGURATIONS (Matching Image Aesthetics: Red & Green Palette) ---
    
    // 1. Widget Production (Pie Chart)
    const pieData = {
        labels: ['Widget 1', 'Widget 2', 'Widget 3', 'Widget 4', 'Widget 5', 'Widget 6'],
        datasets: [{
            data: [15, 30, 35, 10, 5, 5],
            backgroundColor: ['#ef4444', '#22c55e', '#3b82f6', '#a855f7', '#1e293b', '#10b981'],
            borderWidth: 1
        }]
    };

    // 2. Widget Counts (Bar Chart)
    const barData = {
        labels: ['Widget 1', 'Widget 2', 'Widget 3', 'Widget 4', 'Widget 5', 'Widget 6'],
        datasets: [
            {
                label: 'Total',
                data: [5, 20, 36, 10, 10, 20],
                backgroundColor: '#ef4444',
            },
            {
                label: 'Other',
                data: [12, 17, 28, 22, 8, 31],
                backgroundColor: '#22c55e',
            }
        ]
    };

    // 3. Sales and Maintenance (Line Chart)
    const lineData = {
        labels: ['12-31-15', '12-31-16', '12-31-17', '12-31-18', '12-31-19', '12-31-20'],
        datasets: [
            {
                label: 'Sales Total',
                data: [10000, 35000, 60000, 85000, 110000, 135000],
                borderColor: '#ef4444',
                backgroundColor: '#ef4444',
                tension: 0.1
            },
            {
                label: 'Maintenance Total',
                data: [8000, 28000, 50000, 72000, 95000, 120000],
                borderColor: '#22c55e',
                backgroundColor: '#22c55e',
                tension: 0.1
            }
        ]
    };

    // 4. Widget Orders (Horizontal Bar Chart)
    const horizontalBarData = {
        labels: ['Widget 1', 'Widget 2', 'Widget 3', 'Widget 4', 'Widget 5', 'Widget 6'],
        datasets: [
            {
                label: 'Total',
                data: [4, 20, 36, 12, 8, 20],
                backgroundColor: '#ef4444',
            },
            {
                label: 'Other',
                data: [11, 16, 28, 21, 10, 31],
                backgroundColor: '#22c55e',
            }
        ]
    };

    // 5. Sales and Renewals (Scatter Chart)
    const scatterData = {
        datasets: [
            {
                label: 'Sale Total',
                data: [{x: 20, y: 20000}, {x: 40, y: 70000}, {x: 65, y: 30000}, {x: 120, y: 135000}, {x: 180, y: 60000}],
                backgroundColor: '#ef4444',
            },
            {
                label: 'Renewal Potential',
                data: [{x: 15, y: 10000}, {x: 35, y: 55000}, {x: 70, y: 15000}, {x: 125, y: 120000}, {x: 185, y: 58000}],
                backgroundColor: '#22c55e',
            }
        ]
    };

    // 6. Widget Sales Projections (Radar Chart)
    const radarData = {
        labels: ['Widget 2', 'Widget 3', 'Widget 4', 'Widget 5', 'Widget 6'],
        datasets: [
            {
                label: 'Total',
                data: [65, 59, 90, 81, 56],
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                borderColor: '#ef4444',
                pointBackgroundColor: '#ef4444',
            },
            {
                label: 'Other',
                data: [28, 48, 40, 19, 96],
                backgroundColor: 'rgba(34, 197, 94, 0.2)',
                borderColor: '#22c55e',
                pointBackgroundColor: '#22c55e',
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
                        Platform metrics & interactive visual graphs styled identically to corporate dashboard standards.
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
                        <h2>Admin Analytics (5 Key Metrics)</h2>
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
                        <h2>Seller Analytics (5 Key Metrics)</h2>
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

            {/* ================= CHARTS GRID (Matching Reference Layout & Color Scheme) ================= */}
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 1. Widget Production (Pie) */}
                <div className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] flex flex-col">
                    <h3 className="text-xs font-black uppercase text-slate-900 mb-4 tracking-wider text-center">Widget Production</h3>
                    <div className="relative h-64 w-full flex items-center justify-center">
                        <Pie data={pieData} options={chartOptions} />
                    </div>
                </div>

                {/* 2. Widget Counts (Bar) */}
                <div className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] flex flex-col">
                    <h3 className="text-xs font-black uppercase text-slate-900 mb-4 tracking-wider text-center">Widget Counts</h3>
                    <div className="relative h-64 w-full flex items-center justify-center">
                        <Bar data={barData} options={chartOptions} />
                    </div>
                </div>

                {/* 3. Sales and Maintenance (Line) */}
                <div className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] flex flex-col">
                    <h3 className="text-xs font-black uppercase text-slate-900 mb-4 tracking-wider text-center">Sales and Maintenance</h3>
                    <div className="relative h-64 w-full flex items-center justify-center">
                        <Line data={lineData} options={chartOptions} />
                    </div>
                </div>

                {/* 4. Widget Orders (Horizontal Bar) */}
                <div className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] flex flex-col">
                    <h3 className="text-xs font-black uppercase text-slate-900 mb-4 tracking-wider text-center">Widget Orders</h3>
                    <div className="relative h-64 w-full flex items-center justify-center">
                        <Bar data={horizontalBarData} options={{ ...chartOptions, indexAxis: 'y' }} />
                    </div>
                </div>

                {/* 5. Sales and Renewals (Scatter) */}
                <div className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] flex flex-col">
                    <h3 className="text-xs font-black uppercase text-slate-900 mb-4 tracking-wider text-center">Sales and Renewals</h3>
                    <div className="relative h-64 w-full flex items-center justify-center">
                        <Scatter data={scatterData} options={chartOptions} />
                    </div>
                </div>

                {/* 6. Widget Sales Projections (Radar) */}
                <div className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] flex flex-col">
                    <h3 className="text-xs font-black uppercase text-slate-900 mb-4 tracking-wider text-center">Widget Sales Projections</h3>
                    <div className="relative h-64 w-full flex items-center justify-center">
                        <Radar data={radarData} options={chartOptions} />
                    </div>
                </div>

            </div>

        </div>
    );
};

export default Analytics;