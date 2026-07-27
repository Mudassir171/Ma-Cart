import { useEffect } from 'react';
import { Doughnut, Line, Pie } from 'react-chartjs-2';
import { getAdminProducts } from '../../actions/productAction';
import { useSelector, useDispatch } from 'react-redux';
import { getAllOrders } from '../../actions/orderAction';
import MetaData from '../Layouts/MetaData';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const MainData = () => {
    const dispatch = useDispatch();

    const { products } = useSelector((state) => state.products);
    const { user } = useSelector((state) => state.user);
    const { orders = [], totalCommission = 0 } = useSelector((state) => state.allOrders) || {}; 

    // 1. Filter seller's own products
    const sellerProducts = products?.filter(p => p.user === user?._id || p.user?._id === user?._id);
    
    // 2. Filter orders containing this seller's items
    const sellerOrders = orders?.filter(order => 
        order.orderItems.some(item => item.seller === user?._id || item.seller?._id === user?._id)
    );

    // 3. Stock Calculation
    let outOfStock = 0;
    sellerProducts?.forEach((item) => {
        if (item.stock <= 0) {
            outOfStock += 1;
        }
    });

    useEffect(() => {
        dispatch(getAdminProducts());
        dispatch(getAllOrders());
    }, [dispatch]);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const date = new Date();
    
    // 📈 Line Chart Logic
    const lineState = {
        labels: months,
        datasets: [
            {
                label: `Net Earning (90%) in ${date.getFullYear()}`,
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                pointBackgroundColor: '#6366f1',
                data: months.map((m, i) => {
                    let monthlyTotal = 0;
                    sellerOrders?.forEach(order => {
                        const orderDate = new Date(order.createdAt);
                        if (
                            orderDate.getMonth() === i && 
                            orderDate.getFullYear() === date.getFullYear() &&
                            orderDate.orderStatus === "Delivered" 
                        ) {
                            order.orderItems.forEach(item => {
                                if (item.seller === user?._id || item.seller?._id === user?._id) {
                                    monthlyTotal += (item.price * item.quantity);
                                }
                            });
                        }
                    });
                    return monthlyTotal * 0.90;
                }),
            },
        ],
    };

    const statuses = ['Processing', 'Shipped', 'Delivered'];

    const pieState = {
        labels: statuses,
        datasets: [
            {
                backgroundColor: ['#8b5cf6', '#eab308', '#22c55e'],
                hoverBackgroundColor: ['#7c3aed', '#ca8a04', '#16a34a'],
                borderWidth: 0,
                data: statuses.map((status) => sellerOrders?.filter((item) => item.orderStatus === status).length),
            },
        ],
    };

    const doughnutState = {
        labels: ['Out of Stock', 'In Stock'],
        datasets: [
            {
                backgroundColor: ['#ef4444', '#10b981'],
                hoverBackgroundColor: ['#dc2626', '#059669'],
                borderWidth: 0,
                data: [outOfStock, (sellerProducts?.length || 0) - outOfStock],
            },
        ],
    };

    return (
        <>
            <MetaData title="Seller Dashboard | Overview" />

            {/* --- STATS CARDS GRID --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                
                {/* Wallet Card */}
                <div className="relative overflow-hidden bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-2xl shadow-xl p-6 flex justify-between items-center transform transition hover:-translate-y-1">
                    <div className="flex flex-col gap-1 z-10">
                        <span className="text-amber-100 text-sm font-medium tracking-wide">Total Earning (90%)</span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold">
                            Rs. {totalCommission?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </h2>
                    </div>
                    <div className="bg-white/20 p-3 rounded-xl backdrop-blur-md">
                        <AccountBalanceWalletIcon className="text-white text-3xl" />
                    </div>
                </div>

                {/* Items Sold Card */}
                <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-2xl shadow-xl p-6 flex justify-between items-center transform transition hover:-translate-y-1">
                    <div className="flex flex-col gap-1 z-10">
                        <span className="text-emerald-100 text-sm font-medium tracking-wide">Total Orders Handled</span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold">{sellerOrders?.length || 0}</h2>
                    </div>
                    <div className="bg-white/20 p-3 rounded-xl backdrop-blur-md">
                        <ShoppingBagIcon className="text-white text-3xl" />
                    </div>
                </div>

                {/* My Products Card */}
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl shadow-xl p-6 flex justify-between items-center transform transition hover:-translate-y-1">
                    <div className="flex flex-col gap-1 z-10">
                        <span className="text-blue-100 text-sm font-medium tracking-wide">My Products</span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold">{sellerProducts?.length || 0}</h2>
                    </div>
                    <div className="bg-white/20 p-3 rounded-xl backdrop-blur-md">
                        <Inventory2Icon className="text-white text-3xl" />
                    </div>
                </div>

                {/* Out of Stock Card */}
                <div className="relative overflow-hidden bg-gradient-to-br from-rose-500 to-red-600 text-white rounded-2xl shadow-xl p-6 flex justify-between items-center transform transition hover:-translate-y-1">
                    <div className="flex flex-col gap-1 z-10">
                        <span className="text-rose-100 text-sm font-medium tracking-wide">Out of Stock</span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold">{outOfStock}</h2>
                    </div>
                    <div className="bg-white/20 p-3 rounded-xl backdrop-blur-md">
                        <WarningAmberIcon className="text-white text-3xl" />
                    </div>
                </div>
            </div>

            {/* --- CHARTS SECTION: LINE & PIE --- */}
            <div className="flex flex-col lg:flex-row gap-6 mt-6">
                
                {/* Line Chart */}
                <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-6 w-full lg:w-3/4 border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <span className="font-bold text-gray-700 tracking-wide text-base sm:text-lg">Earning Statistics (Monthly)</span>
                        <span className="text-xs font-semibold px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full">Live Analytics</span>
                    </div>
                    <div className="w-full h-full flex items-center justify-center">
                        <Line data={lineState} />
                    </div>
                </div>

                {/* Pie Chart */}
                <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-6 w-full lg:w-1/4 border border-gray-100 flex flex-col items-center justify-between">
                    <span className="font-bold text-gray-700 tracking-wide text-base sm:text-lg mb-2">Order Status</span>
                    <div className="w-full max-w-[240px] my-auto">
                        <Pie data={pieState} />
                    </div>
                </div>
            </div>

            {/* --- CHARTS SECTION: INVENTORY --- */}
            <div className="flex flex-col sm:flex-row gap-6 mt-6 mb-6">
                <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-6 w-full sm:w-1/2 border border-gray-100 flex flex-col items-center">
                    <span className="font-bold text-gray-700 tracking-wide text-base sm:text-lg mb-4">Inventory Overview</span>
                    <div className="w-full max-w-[220px]">
                        <Doughnut data={doughnutState} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default MainData;