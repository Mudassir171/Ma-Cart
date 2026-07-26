import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar/Sidebar';
import MenuIcon from '@mui/icons-material/Menu';

const Dashboard = ({ activeTab, children }) => {
    const [onMobile, setOnMobile] = useState(false);
    const [toggleSidebar, setToggleSidebar] = useState(false);

    // Screen resize ko track karne ke liye taaki mobile view real-time update ho
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setOnMobile(true);
            } else {
                setOnMobile(false);
                setToggleSidebar(false); // Badi screen par toggle close kardein
            }
        };

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-50 overflow-x-hidden">
            {/* Desktop Sidebar */}
            {!onMobile && (
                <div className="fixed inset-y-0 left-0 z-30">
                    <Sidebar activeTab={activeTab} />
                </div>
            )}

            {/* Mobile Sidebar Drawer with Backdrop Animation */}
            {onMobile && (
                <>
                    {/* Backdrop */}
                    <div 
                        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
                            toggleSidebar ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                        }`}
                        onClick={() => setToggleSidebar(false)}
                    />

                    {/* Sliding Sidebar */}
                    <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${
                        toggleSidebar ? 'translate-x-0' : '-translate-x-full'
                    }`}>
                        <Sidebar activeTab={activeTab} setToggleSidebar={setToggleSidebar} />
                    </div>
                </>
            )}

            {/* Main Content Area */}
            <div className="w-full sm:pl-72 flex flex-col min-h-screen transition-all duration-300">
                {/* Top bar / Header for Mobile Menu Button */}
                <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 sm:hidden flex items-center shadow-sm">
                    <button 
                        onClick={() => setToggleSidebar(true)} 
                        className="bg-gray-800 hover:bg-gray-900 text-white w-10 h-10 rounded-xl shadow-md flex items-center justify-center transition-transform active:scale-95"
                        aria-label="Open Menu"
                    >
                        <MenuIcon />
                    </button>
                    <span className="ml-3 font-bold text-gray-800 text-lg">Admin Panel</span>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 sm:p-8">
                    <div className="max-w-7xl mx-auto animate-fadeIn">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;