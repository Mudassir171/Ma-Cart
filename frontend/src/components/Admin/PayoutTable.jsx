import { useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { getAdminPayouts, updatePayoutStatus } from '../../actions/payoutAction';
import { UPDATE_PAYOUT_RESET } from '../../constants/payoutConstants';
import MetaData from '../Layouts/MetaData';
import BackdropLoader from '../Layouts/BackdropLoader';

const PayoutsTable = () => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const { payouts, error, loading } = useSelector((state) => state.payouts || { payouts: [] });
    const { isUpdated, message, error: updateError, loading: updateLoading } = useSelector((state) => state.payout || {});

    useEffect(() => {
        dispatch(getAdminPayouts());

        if (error) {
            enqueueSnackbar(error, { variant: "error" });
        }
        if (updateError) {
            enqueueSnackbar(updateError, { variant: "error" });
        }
        if (isUpdated) {
            enqueueSnackbar(message || "Payout Status Updated Successfully", { variant: "success" });
            dispatch({ type: UPDATE_PAYOUT_RESET });
            dispatch(getAdminPayouts());
        }
    }, [dispatch, error, updateError, isUpdated, message, enqueueSnackbar]);

    const handleStatusChange = (id, status) => {
        dispatch(updatePayoutStatus(id, status));
    };

    const columns = [
        {
            field: "id",
            headerName: "Payout ID",
            minWidth: 150,
            flex: 0.3,
        },
        {
            field: "sellerName",
            headerName: "Seller Name",
            minWidth: 160,
            flex: 0.4,
        },
        {
            field: "amount",
            headerName: "Amount",
            minWidth: 130,
            flex: 0.3,
        },
        {
            field: "status",
            headerName: "Status",
            minWidth: 130,
            flex: 0.3,
            renderCell: (params) => {
                const status = params.row.status;
                let colorClass = "bg-amber-100 text-amber-700";
                if (status === "Approved") colorClass = "bg-green-100 text-green-700";
                if (status === "Rejected") colorClass = "bg-red-100 text-red-700";

                return (
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${colorClass}`}>
                        {status}
                    </span>
                );
            }
        },
        {
            field: "createdAt",
            headerName: "Requested Date",
            minWidth: 150,
            flex: 0.3,
        },
        {
            field: "action",
            headerName: "Actions",
            minWidth: 180,
            flex: 0.4,
            sortable: false,
            renderCell: (params) => {
                return (
                    params.row.status === 'Pending' ? (
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleStatusChange(params.row.id, "Approved")}
                                className="bg-green-600 text-white px-2.5 py-1 rounded text-xs font-semibold hover:bg-emerald-700 transition"
                            >
                                Approve
                            </button>
                            <button
                                onClick={() => handleStatusChange(params.row.id, "Rejected")}
                                className="bg-red-600 text-white px-2.5 py-1 rounded text-xs font-semibold hover:bg-rose-700 transition"
                            >
                                Reject
                            </button>
                        </div>
                    ) : (
                        <span className="text-slate-400 text-xs font-medium">Processed</span>
                    )
                );
            }
        },
    ];

    const rows = [];
    payouts && payouts.forEach((item) => {
        rows.push({
            id: item._id,
            sellerName: item.seller?.name || "N/A",
            amount: `₹${item.amount}`,
            status: item.status,
            createdAt: item.createdAt ? item.createdAt.substring(0, 10) : "",
        });
    });

    return (
        <>
            <MetaData title="Admin Payouts Management" />

            {(loading || updateLoading) && <BackdropLoader />}
            
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-lg font-medium uppercase">Seller Payout Requests</h1>
            </div>

            <div className="bg-white rounded-xl shadow-lg w-full" style={{ height: 450 }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    disableSelectIconOnClick
                    sx={{
                        boxShadow: 0,
                        border: 0,
                    }}
                />
            </div>
        </>
    );
};

export default PayoutsTable;