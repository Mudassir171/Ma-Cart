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

    return (
        <div className="min-h-screen bg-white p-4 sm:p-8 font-sans">
            <MetaData title="Analytics Dashboard" />
            {isLoading && <BackdropLoader />}

            {/* HEADER & THEME TABS */}
            <div className="bg-white border-2 border-slate-900 p-6 rounded-2xl shadow-[4px_4px_0px_0px_#0f172a] mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black uppercase text-slate-900 tracking-wider">
                        Analytics Dashboard
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                        Platform metrics styled in Royal Blue & Amber Theme.
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
                        Admin (5)
                    </button>
                    <button 
                        onClick={() => setActiveTab('seller')}
                        className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'seller' ? 'bg-amber-500 text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                        Seller (5)
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

            {/* ================= ADMIN ANALYTICS (5 METRICS) ================= */}
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

            {/* ================= SELLER ANALYTICS (5 METRICS) ================= */}
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

        </div>
    );
};

export default Analytics;