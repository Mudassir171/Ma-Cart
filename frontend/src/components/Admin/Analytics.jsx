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
    TrendingUp,
    AdminPanelSettings,
    Assessment,
    CheckCircle,
    Cancel,
    LocalShipping,
    HourglassEmpty,
    Warning,
    Category
} from '@mui/icons-material';

const Analytics = () => {
    const dispatch = useDispatch();

    const { products, loading: productLoading } = useSelector((state) => state.products);
    const { orders, loading: orderLoading } = useSelector((state) => state.allOrders || { orders: [] });
    const { users, loading: userLoading } = useSelector((state) => state.allUsers || { users: [] });
    const { user } = useSelector((state) => state.user);

    const [activeTab, setActiveTab] = useState('combined'); // 'combined', 'admin', 'seller'

    useEffect(() => {
        dispatch(getAdminProducts());
        dispatch(getAllOrders());
        dispatch(getAllUsers());
    }, [dispatch]);

    // --- 1. SELLER CALCULATIONS (5 Metrics) ---
    const sellerProducts = products?.filter(p => p.user && (p.user === user?._id || p.user?._id === user?._id)) || [];
    const totalSellerProducts = sellerProducts.length;
    const sellerOutOfStock = sellerProducts.filter(p => p.stock === 0).length;
    
    const sellerOrders = orders?.filter(order => 
        order.orderItems?.some(item => item.seller === user?._id || item.seller?._id === user?._id)
    ) || [];
    const totalSellerOrders = sellerOrders.length;
    const totalSellerRevenue = sellerOrders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);
    const sellerDeliveredOrders = sellerOrders.filter(o => o.orderStatus === 'Delivered').length;

    // --- 2. ADMIN CALCULATIONS (5 Metrics) ---
    const adminProducts = products?.filter(p => !p.user || p.user === user?._id) || [];
    const totalAdminProducts = adminProducts.length;
    const adminOutOfStock = adminProducts.filter(p => p.stock === 0).length;
    
    const totalAdminOrders = orders?.length || 0;
    const totalAdminRevenue = orders?.reduce((acc, order) => acc + (order.totalPrice || 0), 0) || 0;
    const pendingAdminOrders = orders?.filter(o => o.orderStatus === 'Processing').length || 0;

    // --- 3. COMBINED PLATFORM CALCULATIONS ---
    const totalProducts = products?.length || 0;
    const totalOrders = orders?.length || 0;
    const totalUsers = users?.length || 0;
    const sellersList = users?.filter(u => u.role === 'seller') || [];
    const totalSellers = sellersList.length;
    const totalPlatformRevenue = totalAdminRevenue;
    const outOfStockGlobal = products?.filter(p => p.stock === 0).length || 0;

    const isLoading = productLoading || orderLoading || userLoading;

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <MetaData title="Advanced Analytics | Dashboard" />

            {isLoading && <BackdropLoader />}

            {/* HEADER & TABS */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black uppercase text-gray-800 tracking-wide">
                        Analytics Dashboard
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                        Detailed 5-metric breakdown for Admin, Sellers, and Combined platform.
                    </p>
                </div>
                
                <div className="flex bg-gray-100 p-1.5 rounded-xl gap-1 w-full sm:w-auto overflow-x-auto">
                    <button 
                        onClick={() => setActiveTab('combined')}
                        className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${activeTab === 'combined' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                    >
                        Combined Overview
                    </button>
                    <button 
                        onClick={() => setActiveTab('admin')}
                        className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${activeTab === 'admin' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                    >
                        Admin Analytics (5)
                    </button>
                    <button 
                        onClick={() => setActiveTab('seller')}
                        className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${activeTab === 'seller' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                    >
                        Seller Analytics (5)
                    </button>
                </div>
            </div>

            {/* ================= COMBINED OVERVIEW ================= */}
            {activeTab === 'combined' && (
                <div className="space-y-6">
                    <div className="flex items-center gap-2 text-gray-700 font-bold px-1">
                        <Assessment />
                        <h2>Total Platform Summary</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold uppercase text-gray-400">Total Revenue</p>
                                <h3 className="text-xl font-black text-gray-800 mt-1">₹{totalPlatformRevenue.toLocaleString()}</h3>
                            </div>
                            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><AttachMoney /></div>
                        </div>

                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold uppercase text-gray-400">Total Orders</p>
                                <h3 className="text-xl font-black text-gray-800 mt-1">{totalOrders}</h3>
                            </div>
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><ShoppingCart /></div>
                        </div>

                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold uppercase text-gray-400">Total Products</p>
                                <h3 className="text-xl font-black text-gray-800 mt-1">{totalProducts}</h3>
                            </div>
                            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center"><Inventory2 /></div>
                        </div>

                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold uppercase text-gray-400">Total Users</p>
                                <h3 className="text-xl font-black text-gray-800 mt-1">{totalUsers}</h3>
                            </div>
                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><Group /></div>
                        </div>

                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold uppercase text-gray-400">Out of Stock</p>
                                <h3 className="text-xl font-black text-red-600 mt-1">{outOfStockGlobal}</h3>
                            </div>
                            <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center"><Warning /></div>
                        </div>
                    </div>
                </div>
            )}

            {/* ================= ADMIN ANALYTICS (5 METRICS) ================= */}
            {activeTab === 'admin' && (
                <div className="space-y-6">
                    <div className="flex items-center gap-2 text-indigo-700 font-bold px-1">
                        <AdminPanelSettings />
                        <h2>Admin Analytics (5 Key Metrics)</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        {/* 1 */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-indigo-50 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold uppercase text-gray-400">System Revenue</p>
                                <h3 className="text-xl font-black text-gray-800 mt-1">₹{totalAdminRevenue.toLocaleString()}</h3>
                            </div>
                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><AttachMoney /></div>
                        </div>
                        {/* 2 */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-indigo-50 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold uppercase text-gray-400">Total System Orders</p>
                                <h3 className="text-xl font-black text-gray-800 mt-1">{totalAdminOrders}</h3>
                            </div>
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><ShoppingCart /></div>
                        </div>
                        {/* 3 */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-indigo-50 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold uppercase text-gray-400">Admin Products</p>
                                <h3 className="text-xl font-black text-gray-800 mt-1">{totalAdminProducts}</h3>
                            </div>
                            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center"><Inventory2 /></div>
                        </div>
                        {/* 4 */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-indigo-50 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold uppercase text-gray-400">Pending Orders</p>
                                <h3 className="text-xl font-black text-amber-600 mt-1">{pendingAdminOrders}</h3>
                            </div>
                            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center"><HourglassEmpty /></div>
                        </div>
                        {/* 5 */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-indigo-50 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold uppercase text-gray-400">Registered Sellers</p>
                                <h3 className="text-xl font-black text-indigo-600 mt-1">{totalSellers}</h3>
                            </div>
                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><Storefront /></div>
                        </div>
                    </div>
                </div>
            )}

            {/* ================= SELLER ANALYTICS (5 METRICS) ================= */}
            {activeTab === 'seller' && (
                <div className="space-y-6">
                    <div className="flex items-center gap-2 text-amber-700 font-bold px-1">
                        <Storefront />
                        <h2>Seller Analytics (5 Key Metrics)</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        {/* 1 */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-amber-50 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold uppercase text-gray-400">Seller Revenue</p>
                                <h3 className="text-xl font-black text-gray-800 mt-1">₹{totalSellerRevenue.toLocaleString()}</h3>
                            </div>
                            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center"><AttachMoney /></div>
                        </div>
                        {/* 2 */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-amber-50 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold uppercase text-gray-400">Orders Received</p>
                                <h3 className="text-xl font-black text-gray-800 mt-1">{totalSellerOrders}</h3>
                            </div>
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><ShoppingCart /></div>
                        </div>
                        {/* 3 */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-amber-50 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold uppercase text-gray-400">Products Listed</p>
                                <h3 className="text-xl font-black text-gray-800 mt-1">{totalSellerProducts}</h3>
                            </div>
                            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center"><Category /></div>
                        </div>
                        {/* 4 */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-amber-50 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold uppercase text-gray-400">Delivered Orders</p>
                                <h3 className="text-xl font-black text-emerald-600 mt-1">{sellerDeliveredOrders}</h3>
                            </div>
                            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><CheckCircle /></div>
                        </div>
                        {/* 5 */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-amber-50 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold uppercase text-gray-400">Out of Stock Items</p>
                                <h3 className="text-xl font-black text-red-600 mt-1">{sellerOutOfStock}</h3>
                            </div>
                            <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center"><Warning /></div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Analytics;