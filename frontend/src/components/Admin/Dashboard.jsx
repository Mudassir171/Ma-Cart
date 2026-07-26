import { useEffect, useState } from 'react';
import Sidebar from './Sidebar/Sidebar';
import MenuIcon from '@mui/icons-material/Menu';

const Dashboard = ({ activeTab, children }) => {
    const [onMobile, setOnMobile] = useState(window.innerWidth < 600);
    const [toggleSidebar, setToggleSidebar] = useState(false);

    // Dynamically track window resize
    useEffect(() => {
        const handleResize = () => {
            setOnMobile(window.innerWidth < 600);
            if (window.innerWidth >= 600) {
                setToggleSidebar(false); // Close mobile sidebar if scaling up
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            <main className="flex min-h-screen mt-14 sm:min-w-full">
                {/* Permanent Sidebar for Desktop */}
                {!onMobile && <Sidebar activeTab={activeTab} />}

                {/* Toggleable Sidebar for Mobile */}
                {toggleSidebar && (
                    <Sidebar 
                        activeTab={activeTab} 
                        setToggleSidebar={setToggleSidebar} 
                    />
                )}

                {/* Main Content Area */}
                <div className="w-full sm:w-4/5 sm:ml-72 min-h-screen">
                    <div className="flex flex-col gap-6 sm:m-8 p-2 pb-6 overflow-hidden">
                        
                        {/* Mobile Menu Button */}
                        <button 
                            onClick={() => setToggleSidebar(true)} 
                            className="sm:hidden bg-gray-700 px-4 h-10 rounded-lg shadow text-white flex items-center justify-center gap-2 w-fit"
                        >
                            <MenuIcon />
                            <span>Admin Panel</span>
                        </button>

                        {children}
                    </div>
                </div>
            </main>
        </>
    );
};

export default Dashboard;