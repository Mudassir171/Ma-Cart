import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const AllSellers = () => {
    const [sellers, setSellers] = useState([]);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const fetchSellers = async () => {
            try {
                const { data } = await axios.get("/api/v1/admin/all-sellers");
                setSellers(data.sellers);
            } catch (error) {
                enqueueSnackbar("Failed to load sellers", { variant: "error" });
            }
        };
        fetchSellers();
    }, [enqueueSnackbar]);

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Approved Sellers List</h2>
            
            {/* Mobile View: Cards Layout (Visible on small screens, hidden on md and up) */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {sellers.map((seller) => (
                    <div key={seller._id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                            <span className="font-semibold text-gray-900 text-lg">{seller.shopName}</span>
                            <span className="text-green-600 font-semibold text-sm bg-green-50 px-2 py-1 rounded">
                                {seller.status}
                            </span>
                        </div>
                        <div className="text-gray-600 text-sm">
                            <span className="font-medium text-gray-500">Email:</span> {seller.email}
                        </div>
                    </div>
                ))}
                {sellers.length === 0 && (
                    <p className="text-center text-gray-500 py-4">No sellers found.</p>
                )}
            </div>

            {/* Desktop View: Table Layout (Hidden on small screens, visible on md and up) */}
            <div className="hidden md:block overflow-x-auto shadow rounded-lg border border-gray-200">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700 text-left">
                            <th className="py-3 px-4 border-b">Shop Name</th>
                            <th className="py-3 px-4 border-b">Email</th>
                            <th className="py-3 px-4 border-b">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sellers.map((seller) => (
                            <tr key={seller._id} className="border-b hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-800 font-medium">{seller.shopName}</td>
                                <td className="py-3 px-4 text-gray-600">{seller.email}</td>
                                <td className="py-3 px-4 text-green-600 font-semibold">{seller.status}</td>
                            </tr>
                        ))}
                        {sellers.length === 0 && (
                            <tr>
                                <td colSpan="3" className="text-center py-4 text-gray-500">No sellers found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllSellers;