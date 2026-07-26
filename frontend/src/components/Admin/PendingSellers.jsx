import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";

const PendingSellers = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPendingSellers = async () => {
        try {
            const { data } = await axios.get("/api/v1/admin/pending-sellers");
            setSellers(data.sellers);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching sellers:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingSellers();
    }, []);

    const approveHandler = async (id) => {
        try {
            await axios.put(`/api/v1/admin/approve-seller/${id}`);
            setSellers(sellers.filter((s) => s._id !== id));
            enqueueSnackbar("Seller Approved Successfully", { variant: "success" });
        } catch (error) {
            enqueueSnackbar(error.response?.data?.message || "Failed to approve", { variant: "error" });
        }
    };

    const rejectHandler = async (id) => {
        if (window.confirm("Are you sure you want to reject this seller?")) {
            try {
                await axios.delete(`/api/v1/admin/reject-seller/${id}`);
                setSellers(sellers.filter((s) => s._id !== id));
                enqueueSnackbar("Seller Rejected Successfully", { variant: "success" });
            } catch (error) {
                enqueueSnackbar(error.response?.data?.message || "Failed to reject", { variant: "error" });
            }
        }
    };

    if (loading) return <div className="text-center mt-20 text-xl font-semibold text-blue-600">Loading requests...</div>;

    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">Seller Approval Requests</h2>
            
            {/* Mobile View: Cards Layout (Visible on small screens, hidden on md and up) */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {sellers.length === 0 ? (
                    <p className="text-center text-gray-500 py-8 bg-white rounded-xl shadow border border-gray-100">
                        No pending requests found.
                    </p>
                ) : (
                    sellers.map((seller) => (
                        <div key={seller._id} className="bg-white p-4 rounded-xl shadow-md border border-gray-200 flex flex-col gap-3">
                            <div>
                                <span className="text-xs text-gray-400 uppercase font-semibold">Shop Name</span>
                                <h3 className="text-lg font-bold text-gray-900">{seller.shopName}</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                    <span className="text-gray-400 block text-xs">Owner</span>
                                    <span className="font-medium text-gray-700">{seller.name}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400 block text-xs">Email</span>
                                    <span className="font-medium text-gray-700 truncate block">{seller.email}</span>
                                </div>
                            </div>
                            <div className="flex gap-2 pt-2 border-t border-gray-100">
                                <button 
                                    onClick={() => approveHandler(seller._id)}
                                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-lg shadow text-sm font-semibold transition"
                                >
                                    Approve
                                </button>
                                <button 
                                    onClick={() => rejectHandler(seller._id)}
                                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg shadow text-sm font-semibold transition"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Desktop View: Table Layout (Hidden on small screens, visible on md and up) */}
            <div className="hidden md:block bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-4 px-6 font-semibold">Shop Name</th>
                            <th className="py-4 px-6 font-semibold">Owner</th>
                            <th className="py-4 px-6 font-semibold">Email</th>
                            <th className="py-4 px-6 font-semibold text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700 text-sm font-medium">
                        {sellers.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="py-10 text-center text-gray-500">No pending requests found.</td>
                            </tr>
                        ) : (
                            sellers.map((seller) => (
                                <tr key={seller._id} className="border-b border-gray-200 hover:bg-blue-50 transition duration-200">
                                    <td className="py-4 px-6">{seller.shopName}</td>
                                    <td className="py-4 px-6">{seller.name}</td>
                                    <td className="py-4 px-6">{seller.email}</td>
                                    <td className="py-4 px-6 flex justify-center gap-3">
                                        <button 
                                            onClick={() => approveHandler(seller._id)}
                                            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg shadow-md transition transform hover:scale-105"
                                        >
                                            Approve
                                        </button>
                                        <button 
                                            onClick={() => rejectHandler(seller._id)}
                                            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow-md transition transform hover:scale-105"
                                        >
                                            Reject
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody> 
                </table>
            </div>
        </div>
    );
};

export default PendingSellers;