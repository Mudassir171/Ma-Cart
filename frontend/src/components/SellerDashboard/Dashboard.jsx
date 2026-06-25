import { useEffect, useState } from 'react';
import Sidebar from './Sidebar/Sidebar';
import MenuIcon from '@mui/icons-material/Menu';
import { useSelector } from 'react-redux';

const Dashboard = ({ activeTab, children }) => {

    const [onMobile, setOnMobile] = useState(false);
    const [toggleSidebar, setToggleSidebar] = useState(false);
    const { user } = useSelector((state) => state.user); // Seller ka data lene ke liye

    useEffect(() => {
        if (window.innerWidth < 600) {
            setOnMobile(true);
        }
    }, [])

    return (
        <>
            <main className="flex min-h-screen mt-14 sm:min-w-full bg-gray-50">

                {!onMobile && <Sidebar activeTab={activeTab} />}
                {toggleSidebar && <Sidebar activeTab={activeTab} setToggleSidebar={setToggleSidebar}/>}

                <div className="w-full sm:w-4/5 sm:ml-[20%] min-h-screen">
                    <div className="flex flex-col gap-6 sm:m-8 p-2 pb-6 overflow-hidden">
                        
                        {/* Mobile Menu Button */}
                        <div className="flex items-center justify-between sm:hidden">
                             <button onClick={() => setToggleSidebar(true)} className="bg-gray-700 w-10 h-10 rounded-full shadow text-white flex items-center justify-center">
                                <MenuIcon />
                             </button>
                             <h1 className="text-xl font-bold text-gray-800">Seller Panel</h1>
                        </div>

                        {/* Top Bar for Earnings Quick View */}
                        <div className="hidden sm:flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border-b">
                            <h1 className="text-2xl font-bold text-gray-800">Seller Dashboard</h1>
                            <div className="flex flex-col items-end">
                                <span className="text-sm text-gray-500 font-medium">Available Balance (90%)</span>
                                <span className="text-xl font-bold text-green-600">Rs. {user?.walletBalance?.toLocaleString()}</span>
                            </div>
                        </div>

                        {children}
                    </div>
                </div>
            </main>
        </>
    );
};

export default Dashboard;