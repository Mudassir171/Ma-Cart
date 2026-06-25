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
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Approved Sellers List</h2>
            <table className="min-w-full bg-white border">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="py-2 px-4 border">Shop Name</th>
                        <th className="py-2 px-4 border">Email</th>
                        <th className="py-2 px-4 border">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {sellers.map((seller) => (
                        <tr key={seller._id} className="text-center border-b">
                            <td className="py-2 px-4">{seller.shopName}</td>
                            <td className="py-2 px-4">{seller.email}</td>
                            <td className="py-2 px-4 text-green-600 font-semibold">{seller.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AllSellers;