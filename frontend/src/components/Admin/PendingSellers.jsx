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

   // PendingSellers.jsx ke andar yahan paste karein:

const approveHandler = async (id) => {
    try {
        await axios.put(`/api/v1/admin/approve-seller/${id}`);
        setSellers(sellers.filter((s) => s._id !== id));
        enqueueSnackbar("Seller Approved Successfully", { variant: "success" });
    } catch (error) {
        // Error message jo backend se aayega wo dikhayenge
        enqueueSnackbar(error.response?.data?.message || "Failed to approve", { variant: "error" });
    }
};

   const rejectHandler = async (id) => {
    // Pehle confirmation lein
    if (window.confirm("Are you sure you want to reject this seller?")) {
        try {
            await axios.delete(`/api/v1/admin/reject-seller/${id}`);
            // List se remove karein
            setSellers(sellers.filter((s) => s._id !== id));
            // Success notification
            enqueueSnackbar("Seller Rejected Successfully", { variant: "success" });
        } catch (error) {
            // Error notification
            enqueueSnackbar(error.response?.data?.message || "Failed to reject", { variant: "error" });
        }
    }
};

    if (loading) return <div className="text-center mt-20 text-xl font-semibold text-blue-600">Loading requests...</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Seller Approval Requests</h2>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
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
                            <tr><td colSpan="4" className="py-10 text-center text-gray-500">No pending requests found.</td></tr>
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