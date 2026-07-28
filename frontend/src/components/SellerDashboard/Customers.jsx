import React, { useEffect, useState } from 'react';
import Dashboard from '../Dashboard';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import GroupIcon from '@mui/icons-material/Group';
import EmailIcon from '@mui/icons-material/Email';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SearchIcon from '@mui/icons-material/Search';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const { enqueueSnackbar } = useSnackbar();

    // Backend se customers fetch karna
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const { data } = await axios.get('/api/v1/seller/customers', { withCredentials: true });
                setCustomers(data.customers);
                setLoading(false);
            } catch (error) {
                enqueueSnackbar(error.response?.data?.message || "Failed to fetch customers", { variant: "error" });
                setLoading(false);
            }
        };
        fetchCustomers();
    }, [enqueueSnackbar]);

    // Search filter logic
    const filteredCustomers = customers.filter(cust => 
        cust.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cust.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Dashboard activeTab="customers">
            <div className="flex flex-col gap-6 animate-fadeIn pb-10">
                
                {/* Header Banner with Rich Green Gradient */}
                <div className="relative overflow-hidden bg-gradient-to-r from-green-800 via-emerald-700 to-teal-800 p-6 sm:p-8 rounded-3xl shadow-xl text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-600/30 rounded-full blur-2xl pointer-events-none"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 bg-green-900/40 w-fit px-3 py-1 rounded-full text-emerald-200 text-xs font-semibold mb-2 border border-emerald-600/30">
                            <GroupIcon fontSize="small" /> Customer Management
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Your Buyers & Customers</h1>
                        <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-md">
                            Track all unique customers who have purchased items from your shop.
                        </p>
                    </div>

                    <div className="relative z-10 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 flex items-center gap-4 shadow-inner">
                        <div>
                            <p className="text-xs text-emerald-200 font-medium">Total Unique Customers</p>
                            <p className="text-2xl font-black text-white">{customers.length}</p>
                        </div>
                        <div className="p-3 bg-emerald-500/30 rounded-xl text-white border border-white/10">
                            <GroupIcon />
                        </div>
                    </div>
                </div>

                {/* Search Bar Section */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
                    <SearchIcon className="text-slate-400 ml-2" />
                    <input 
                        type="text"
                        placeholder="Search customer by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-transparent outline-none text-sm text-slate-700 placeholder-slate-400 font-medium"
                    />
                </div>

                {/* Content Section */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
                        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-slate-500 text-sm font-medium mt-4">Loading your customers...</p>
                    </div>
                ) : filteredCustomers.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl mb-3 shadow-inner">
                            <GroupIcon fontSize="large" />
                        </div>
                        <h3 className="text-base font-bold text-slate-800">No Customers Found</h3>
                        <p className="text-slate-400 text-xs mt-1">Aapke products par abhi tak koi order nahi aaya ya search match nahi hui.</p>
                    </div>
                ) : (
                    <>
                        {/* Desktop View: Table */}
                        <div className="hidden md:block bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                            <th className="p-5">Customer Name</th>
                                            <th className="p-5">Email Address</th>
                                            <th className="p-5">Joined Date</th>
                                            <th className="p-5 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-sm">
                                        {filteredCustomers.map((cust, index) => (
                                            <tr key={cust._id || index} className="hover:bg-emerald-50/30 transition-all duration-200 group">
                                                <td className="p-5 font-bold text-slate-800 flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-extrabold text-sm shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                                                        {cust.name ? cust.name.charAt(0).toUpperCase() : "C"}
                                                    </div>
                                                    <div>
                                                        <p className="text-slate-900 font-bold">{cust.name}</p>
                                                        <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">Verified Buyer</span>
                                                    </div>
                                                </td>
                                                <td className="p-5 text-slate-600 font-medium flex items-center gap-2 mt-2">
                                                    <EmailIcon fontSize="small" className="text-slate-400" />
                                                    {cust.email}
                                                </td>
                                                <td className="p-5 text-slate-500 text-xs font-semibold">
                                                    <div className="flex items-center gap-1.5 bg-slate-100 w-fit px-3 py-1.5 rounded-xl text-slate-600">
                                                        <CalendarMonthIcon fontSize="small" className="text-slate-400" />
                                                        {cust.createdAt ? new Date(cust.createdAt).toLocaleDateString() : "N/A"}
                                                    </div>
                                                </td>
                                                <td className="p-5 text-right">
                                                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl transition-colors cursor-pointer border border-emerald-100 shadow-sm">
                                                        View Details
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mobile View: Gorgeous Cards Grid */}
                        <div className="grid grid-cols-1 gap-4 md:hidden">
                            {filteredCustomers.map((cust, index) => (
                                <div key={cust._id || index} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-4 relative overflow-hidden group hover:border-emerald-200 transition-all">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-0 opacity-50 group-hover:bg-emerald-100 transition-colors"></div>
                                    
                                    <div className="flex items-center gap-3 relative z-10">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-base shadow-lg shadow-emerald-600/20">
                                            {cust.name ? cust.name.charAt(0).toUpperCase() : "C"}
                                        </div>
                                        <div>
                                            <h3 className="text-base font-extrabold text-slate-900">{cust.name}</h3>
                                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">Verified Buyer</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600 relative z-10">
                                        <div className="flex items-center gap-2 font-medium">
                                            <EmailIcon fontSize="small" className="text-emerald-600" />
                                            <span>{cust.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 font-medium">
                                            <CalendarMonthIcon fontSize="small" className="text-emerald-600" />
                                            <span>Joined: {cust.createdAt ? new Date(cust.createdAt).toLocaleDateString() : "N/A"}</span>
                                        </div>
                                    </div>

                                    <div className="pt-2 relative z-10">
                                        <button className="w-full bg-emerald-50 text-emerald-700 font-bold text-xs py-2.5 rounded-xl border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                                            View Customer Profile
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

            </div>
        </Dashboard>
    );
};

export default Customers;