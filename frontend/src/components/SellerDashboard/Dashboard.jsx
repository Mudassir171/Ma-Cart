import { useEffect, useState } from "react";
import Sidebar from "./Sidebar/Sidebar";
import MenuIcon from "@mui/icons-material/Menu";
import { useSelector } from "react-redux";

const Dashboard = ({ activeTab, children }) => {
  const [onMobile, setOnMobile] = useState(window.innerWidth < 600);
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const { user } = useSelector((state) => state.user); // Seller data

  // Dynamically track window resize for responsive layout switches
  useEffect(() => {
    const handleResize = () => {
      setOnMobile(window.innerWidth < 600);
      if (window.innerWidth >= 600) {
        setToggleSidebar(false); // Close mobile drawer if scaling up to desktop
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <main className="flex min-h-screen mt-14 sm:min-w-full bg-gray-50">
        {/* Permanent Sidebar for Desktop */}
        {!onMobile && <Sidebar activeTab={activeTab} />}

        {/* Toggleable Sidebar for Mobile */}
        {toggleSidebar && (
          <Sidebar activeTab={activeTab} setToggleSidebar={setToggleSidebar} />
        )}

        {/* Main Content Container */}
        <div className="w-full sm:w-4/5 sm:ml-[20%] min-h-screen">
          <div className="flex flex-col gap-6 sm:m-8 p-2 pb-6 overflow-hidden">
            <h1 className="text-xl font-bold text-gray-800">Seller Panel</h1>

            {/* Mobile Menu & Panel Title */}
            <div className="flex flex-col gap-6 sm:m-8 p-2 pb-6 overflow-hidden">
                                   
                                   {/* Mobile Menu Button */}
                                   <button 
                                       onClick={() => setToggleSidebar(true)} 
                                       className="sm:hidden bg-gray-700 px-4 h-10 rounded-lg shadow text-white flex items-center justify-center gap-2 w-fit"
                                   >
                                       <MenuIcon />
                                       <span>Seller Panel</span>
                                   </button>
           
                               </div>

            {/* Top Bar for Desktop (Earnings Quick View) */}
            <div className="hidden sm:flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border-b">
              <h1 className="text-2xl font-bold text-gray-800">
                Seller Dashboard
              </h1>
              <div className="flex flex-col items-end">
                <span className="text-sm text-gray-500 font-medium">
                  Available Balance (90%)
                </span>
                <span className="text-xl font-bold text-green-600">
                  Rs. {user?.walletBalance?.toLocaleString() || 0}
                </span>
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
