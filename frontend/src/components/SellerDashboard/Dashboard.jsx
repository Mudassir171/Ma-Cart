import { useEffect, useState } from "react";
import Sidebar from "./Sidebar/Sidebar";
import MenuIcon from "@mui/icons-material/Menu";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { useSelector } from "react-redux";

const Dashboard = ({ activeTab, children }) => {
  const [onMobile, setOnMobile] = useState(window.innerWidth < 768);
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const { user } = useSelector((state) => state.user); // Seller data

  // Dynamically track window resize for responsive layout switches
  useEffect(() => {
    const handleResize = () => {
      setOnMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setToggleSidebar(false); // Close mobile drawer if scaling up to desktop
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <main className="flex min-h-screen mt-14 sm:min-w-full bg-green-50 font-sans">
        {/* Permanent Sidebar for Desktop */}
        {!onMobile && <Sidebar activeTab={activeTab} />}

        {/* Toggleable Sidebar for Mobile */}
        {toggleSidebar && (
          <Sidebar activeTab={activeTab} setToggleSidebar={setToggleSidebar} />
        )}

        {/* Main Content Container */}
        <div className="w-full md:w-4/5 md:ml-[20%] min-h-screen flex flex-col">
          <div className="flex flex-col gap-6 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
            
            {/* Mobile Header Section */}
            <div className="flex md:hidden flex-col gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Overview</span>
                  <h1 className="text-lg font-extrabold text-slate-800">Seller Dashboard</h1>
                </div>
                {/* Mobile Menu Button */}
                <button 
                  onClick={() => setToggleSidebar(true)} 
                  className="bg-green-900 hover:bg-green-800 p-2.5 rounded-xl shadow-md text-white flex items-center justify-center transition-all"
                  aria-label="Open Menu"
                >
                  <MenuIcon fontSize="small" />
                </button>
              </div>

              {/* Mobile Wallet Balance Card */}
              <div className="flex items-center justify-between bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-600 text-white rounded-lg shadow-sm">
                    <AccountBalanceWalletIcon fontSize="small" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-emerald-700">Available Balance (90%)</p>
                    <p className="text-base font-bold text-emerald-900">
                      Rs. {user?.walletBalance?.toLocaleString() || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Bar for Desktop (Earnings Quick View) */}
            <div className="hidden md:flex justify-between items-center bg-white px-6 py-4 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100">
              <div>
                <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Welcome Back</span>
                <h1 className="text-xl font-extrabold text-slate-800">
                  Seller Dashboard
                </h1>
              </div>
              
              <div className="flex items-center gap-4 bg-emerald-50/60 px-5 py-2.5 rounded-xl border border-emerald-100">
                <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-sm">
                  <AccountBalanceWalletIcon fontSize="small" />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs font-semibold text-emerald-700">
                    Available Balance (90%)
                  </span>
                  <span className="text-lg font-extrabold text-emerald-900">
                    Rs. {user?.walletBalance?.toLocaleString() || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Dynamic Content Area */}
            <div className="flex-1 w-full bg-transparent">
              {children}
            </div>
            
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;