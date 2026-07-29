import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminProducts } from '../../actions/productAction';
import { getAllOrders } from '../../actions/orderAction';
import { getAllUsers } from '../../actions/userAction';
import MetaData from '../Layouts/MetaData';
import BackdropLoader from '../Layouts/BackdropLoader';
import { 
    ResponsiveContainer, 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    Tooltip, 
    PieChart, 
    Pie, 
    Cell, 
    BarChart, 
    Bar 
} from 'recharts';

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
    const totalProducts = products?.length || 0;
    const totalOrders = orders?.length || 0;
    const totalUsers = users?.length || 0;
    const totalRevenue = orders?.reduce((acc, order) => acc + (order.totalPrice || 0), 0) || 0;
    const deliveredOrders = orders?.filter(o => o.orderStatus === 'Delivered').length || 0;
    const returnOrders = orders?.filter(o => o.orderStatus === 'Returned' || o.orderStatus === 'Cancelled').length || 0;

    // Dummy data for charts to match the dashboard look
    const profitData = [
        { month: 'Oct 2021', profit: 29000 },
        { month: 'Nov 2021', profit: 29200 },
        { month: 'Dec 2021', profit: 29050 },
        { month: 'Jan 2022', profit: 29300 },
        { month: 'Feb 2022', profit: 29750 },
        { month: 'Mar 2022', profit: 30200 },
    ];

    const trafficData = [
        { name: 'SEO', value: 89.3, color: '#22c55e' },
        { name: 'Facebook', value: 6.7, color: '#4ade80' },
        { name: 'Instagram', value: 4.0, color: '#86efac' },
    ];

    const marketingData = [
        { month: 'Oct 2021', spent: 3800 },
        { month: 'Nov 2021', spent: 2600 },
        { month: 'Dec 2021', spent: 1800 },
        { month: 'Jan 2022', spent: 2500 },
        { month: 'Feb 2022', spent: 2550 },
        { month: 'Mar 2022', spent: 3900 },
    ];

    const isLoading = productLoading || orderLoading || userLoading;

    return (
        <div className="min-h-screen bg-slate-100 p-4 sm:p-6 font-sans">
            <MetaData title="E-Commerce Dashboard" />
            {isLoading && <BackdropLoader />}

            {/* TOP HEADER & TABS */}
            <div className="bg-white border border-slate-300 p-4 rounded-lg shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <h1 className="text-xl font-bold uppercase text-slate-800 tracking-wide">
                    E-Commerce Dashboard
                </h1>
                
                <div className="flex bg-slate-100 p-1 rounded-md border border-slate-200 gap-1">
                    <button 
                        onClick={() => setActiveTab('combined')}
                        className={`px-4 py-1.5 rounded text-xs font-semibold transition-all ${activeTab === 'combined' ? 'bg-emerald-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                        Combined
                    </button>
                    <button 
                        onClick={() => setActiveTab('admin')}
                        className={`px-4 py-1.5 rounded text-xs font-semibold transition-all ${activeTab === 'admin' ? 'bg-emerald-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                        Admin
                    </button>
                    <button 
                        onClick={() => setActiveTab('seller')}
                        className={`px-4 py-1.5 rounded text-xs font-semibold transition-all ${activeTab === 'seller' ? 'bg-emerald-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                        Seller
                    </button>
                </div>
            </div>

            {/* DASHBOARD GRID LAYOUT */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* COLUMN 1: Metric Cards */}
                <div className="space-y-6">
                    <div className="bg-white border border-slate-300 p-5 rounded-lg shadow-sm text-center">
                        <p className="text-xs font-bold text-slate-500 uppercase">Shopping Cart Abandonment Rate</p>
                        <h3 className="text-3xl font-bold text-emerald-600 mt-2">54%</h3>
                    </div>

                    <div className="bg-white border border-slate-300 p-5 rounded-lg shadow-sm text-center">
                        <p className="text-xs font-bold text-slate-500 uppercase">Subscription Rate</p>
                        <div className="w-24 h-24 mx-auto mt-2 rounded-full border-4 border-slate-200 border-t-emerald-500 flex items-center justify-center">
                            <span className="text-lg font-bold text-slate-700">10%</span>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-300 p-5 rounded-lg shadow-sm text-center">
                        <p className="text-xs font-bold text-slate-500 uppercase">Average Order Value</p>
                        <h3 className="text-3xl font-bold text-emerald-600 mt-2">
                            ₹{totalOrders ? Math.round(totalRevenue / totalOrders) : 20}
                        </h3>
                    </div>

                    <div className="bg-white border border-slate-300 p-5 rounded-lg shadow-sm text-center">
                        <p className="text-xs font-bold text-slate-500 uppercase">Return and Refund Rate</p>
                        <h3 className="text-3xl font-bold text-emerald-600 mt-2">
                            {totalOrders ? Math.round((returnOrders / totalOrders) * 100) : 15}%
                        </h3>
                    </div>
                </div>

                {/* COLUMN 2 & 3: Charts & Visuals */}
                <div className="md:col-span-2 space-y-6">
                    
                    {/* Row 1: Traffic Sources & Profit Chart */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="bg-white border border-slate-300 p-4 rounded-lg shadow-sm">
                            <p className="text-xs font-bold text-slate-600 mb-2">Major Traffic Sources</p>
                            <div className="h-48 flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={trafficData} dataKey="value" nameKey="name" outerRadius={60} fill="#22c55e" label>
                                            {trafficData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-300 p-4 rounded-lg shadow-sm">
                            <p className="text-xs font-bold text-slate-600 mb-2">Last 6 Months Profit</p>
                            <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={profitData}>
                                        <XAxis dataKey="month" stroke="#888888" fontSize={10} />
                                        <YAxis stroke="#888888" fontSize={10} domain={['dataMin - 200', 'dataMax + 200']} />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="profit" stroke="#22c55e" fill="#dcfce7" strokeWidth={2} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Row 2: Marketing Expenses & Orders Growth */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="bg-white border border-slate-300 p-4 rounded-lg shadow-sm">
                            <p className="text-xs font-bold text-slate-600 mb-2">Money Spent for Marketing and Advertising</p>
                            <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={marketingData}>
                                        <XAxis dataKey="month" stroke="#888888" fontSize={10} />
                                        <YAxis stroke="#888888" fontSize={10} />
                                        <Tooltip />
                                        <Bar dataKey="spent" fill="#22c55e" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-300 p-4 rounded-lg shadow-sm">
                            <p className="text-xs font-bold text-slate-600 mb-2">Last 6 Months Orders</p>
                            <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={profitData}>
                                        <XAxis dataKey="month" stroke="#888888" fontSize={10} />
                                        <YAxis stroke="#888888" fontSize={10} />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="profit" stroke="#16a34a" fill="#f0fdf4" strokeWidth={2} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default Analytics;