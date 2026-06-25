import { useEffect } from 'react';
// import Chart from 'chart.js/auto'
import { Doughnut, Line, Pie } from 'react-chartjs-2';
import { getAdminProducts } from '../../actions/productAction';
import { useSelector, useDispatch } from 'react-redux';
import { getAllOrders } from '../../actions/orderAction';
import MetaData from '../Layouts/MetaData';

const MainData = () => {
    const dispatch = useDispatch();

    const { products } = useSelector((state) => state.products);
    // const { orders } = useSelector((state) => state.allOrders);
    const { user } = useSelector((state) => state.user);
const { orders = [], totalCommission = 0, totalAmount = 0 } = useSelector((state) => state.allOrders) || {};    // 1. Seller ke apne products filter karein
    const sellerProducts = products?.filter(p => p.user === user._id || p.user?._id === user._id);
    
    // 2. Sirf wo orders filter karein jin mein is seller ka item hai
    const sellerOrders = orders?.filter(order => 
        order.orderItems.some(item => item.seller === user._id || item.seller?._id === user._id)
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

    // 4. Wallet Balance (Jo backend se update ho kar aa raha hai)
    let walletBalance = user.walletBalance || 0;

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const date = new Date();
    
    // 📈 Line Chart Logic: Har month mein sirf Seller ka share calculate karein
   // MainData.jsx mein lineState ko aise update karein:

const lineState = {
    labels: months,
    datasets: [
        {
            label: `Net Earning (90%) in ${date.getFullYear()}`,
            borderColor: '#4ade80',
            backgroundColor: '#4ade80',
            // Yahan paste karein:
            data: months.map((m, i) => {
                let monthlyTotal = 0;
                sellerOrders?.forEach(order => {
                    const orderDate = new Date(order.createdAt);
                    // Sirf "Delivered" orders ka paisa count karna
                    if (
                        orderDate.getMonth() === i && 
                        orderDate.getFullYear() === date.getFullYear() &&
                        order.orderStatus === "Delivered" 
                    ) {
                        order.orderItems.forEach(item => {
                            if (item.seller === user._id || item.seller?._id === user._id) {
                                monthlyTotal += (item.price * item.quantity);
                            }
                        });
                    }
                });
                return monthlyTotal * 0.90; // 10% Admin commission cut karke
            }),
        },
    ],
};

    const statuses = ['Processing', 'Shipped', 'Delivered'];

    const pieState = {
        labels: statuses,
        datasets: [
            {
                backgroundColor: ['#9333ea', '#facc15', '#4ade80'],
                hoverBackgroundColor: ['#a855f7', '#fde047', '#86efac'],
                data: statuses.map((status) => sellerOrders?.filter((item) => item.orderStatus === status).length),
            },
        ],
    };

    const doughnutState = {
        labels: ['Out of Stock', 'In Stock'],
        datasets: [
            {
                backgroundColor: ['#ef4444', '#22c55e'],
                hoverBackgroundColor: ['#dc2626', '#16a34a'],
                data: [outOfStock, (sellerProducts?.length || 0) - outOfStock],
            },
        ],
    };

    return (
        <>
            <MetaData title="Seller Dashboard | Wallet" />

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-6">
                {/* --- WALLET CARD --- */}
                <div className="flex flex-col bg-yellow-500 text-white gap-2 rounded-xl shadow-lg hover:shadow-xl p-6">
        <h4 className="text-gray-100 font-medium">Total Earning (90%)</h4>
        {/* Safe check ke saath show karein */}
        <h2 className="text-2xl font-bold">
            Rs. {totalCommission?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </h2>
      </div>

                <div className="flex flex-col bg-green-600 text-white gap-2 rounded-xl shadow-lg hover:shadow-xl p-6">
                    <h4 className="text-gray-100 font-medium">Total Items Sold</h4>
                    <h2 className="text-2xl font-bold">{sellerOrders?.length || 0}</h2>
                </div>

                <div className="flex flex-col bg-blue-500 text-white gap-2 rounded-xl shadow-lg hover:shadow-xl p-6">
                    <h4 className="text-gray-100 font-medium">My Products</h4>
                    <h2 className="text-2xl font-bold">{sellerProducts?.length || 0}</h2>
                </div>

                <div className="flex flex-col bg-red-500 text-white gap-2 rounded-xl shadow-lg hover:shadow-xl p-6">
                    <h4 className="text-gray-100 font-medium">Out of Stock</h4>
                    <h2 className="text-2xl font-bold">{outOfStock}</h2>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row justify-between gap-3 sm:gap-8 min-w-full mt-6">
                <div className="bg-white rounded-xl h-auto w-full lg:w-3/4 shadow-lg p-4">
                    <span className="font-medium uppercase text-gray-800">Earning Statistics (Monthly)</span>
                    <Line data={lineState} />
                </div>

                <div className="bg-white rounded-xl shadow-lg p-4 text-center w-full lg:w-1/4">
                    <span className="font-medium uppercase text-gray-800">Order Status</span>
                    <Pie data={pieState} />
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-8 min-w-full mb-6 mt-6">
                <div className="bg-white rounded-xl shadow-lg p-4 text-center w-full sm:w-1/2">
                    <span className="font-medium uppercase text-gray-800">Inventory Overview</span>
                    <Doughnut data={doughnutState} />
                </div>
            </div>
        </>
    );
};

export default MainData;