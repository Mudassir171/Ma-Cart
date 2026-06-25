import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useSelector, useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import MetaData from '../Layouts/MetaData';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const WithdrawalTable = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [withdrawals, setWithdrawals] = useState([]);
    const [loading, setLoading] = useState(true);

    // Saari requests fetch karne ka function
    const fetchWithdrawals = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/v1/admin/withdrawals');
            setWithdrawals(data.withdrawals);
            setLoading(false);
        } catch (error) {
            enqueueSnackbar(error.response.data.message, { variant: "error" });
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWithdrawals();
    }, []);

    // Status Update (Approve/Reject) handler
    const updateStatusHandler = async (id, status) => {
        try {
            const config = { headers: { "Content-Type": "application/json" } };
            const { data } = await axios.put(`/api/v1/admin/withdrawal/${id}`, { status }, config);
            
            enqueueSnackbar(data.message, { variant: "success" });
            fetchWithdrawals(); // Table refresh karein
        } catch (error) {
            enqueueSnackbar(error.response.data.message, { variant: "error" });
        }
    };

    const columns = [
        { field: "id", headerName: "Request ID", minWidth: 200, flex: 0.8 },
        {
            field: "seller",
            headerName: "Shop Name",
            minWidth: 150,
            flex: 0.7,
            renderCell: (params) => params.row.seller?.shopName || "N/A",
        },
        {
            field: "amount",
            headerName: "Amount (₹)",
            type: "number",
            minWidth: 120,
            flex: 0.5,
            renderCell: (params) => `₹${params.row.amount.toLocaleString()}`,
        },
        { field: "method", headerName: "Method", minWidth: 120, flex: 0.5 },
        { field: "details", headerName: "Account Details", minWidth: 250, flex: 1 },
        {
            field: "status",
            headerName: "Status",
            minWidth: 130,
            flex: 0.5,
            renderCell: (params) => (
                <span className={`font-medium ${params.row.status === "Approved" ? "text-green-600" : params.row.status === "Rejected" ? "text-red-600" : "text-orange-500"}`}>
                    {params.row.status}
                </span>
            ),
        },
        {
            field: "actions",
            headerName: "Actions",
            minWidth: 150,
            flex: 0.6,
            sortable: false,
            renderCell: (params) => (
                params.row.status === "Pending" ? (
                    <div className="flex gap-2">
                        <button
                            onClick={() => updateStatusHandler(params.row.id, "Approved")}
                            className="bg-green-100 text-green-700 p-2 rounded-full hover:bg-green-200"
                            title="Approve"
                        >
                            <CheckIcon fontSize="small" />
                        </button>
                        <button
                            onClick={() => updateStatusHandler(params.row.id, "Rejected")}
                            className="bg-red-100 text-red-700 p-2 rounded-full hover:bg-red-200"
                            title="Reject"
                        >
                            <CloseIcon fontSize="small" />
                        </button>
                    </div>
                ) : <span className="text-gray-400 text-xs">No Actions</span>
            ),
        },
    ];

    const rows = withdrawals.map((item) => ({
        id: item._id,
        seller: item.seller,
        amount: item.amount,
        method: item.paymentMethod,
        details: item.paymentDetails,
        status: item.status,
    }));

    return (
        <>
            <MetaData title="Admin - Payout Requests" />
            <div className="p-4 sm:p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 uppercase tracking-wider">Seller Payout Requests</h1>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        disableSelectionOnClick
                        autoHeight
                        loading={loading}
                        sx={{
                            border: 'none',
                            '& .MuiDataGrid-columnHeaders': { backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' },
                            '& .MuiDataGrid-cell': { borderBottom: '1px solid #f1f5f9' },
                        }}
                    />
                </div>
            </div>
        </>
    );
};

export default WithdrawalTable;