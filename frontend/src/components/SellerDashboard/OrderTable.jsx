import { useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { clearErrors, deleteOrder, getAllOrders } from '../../actions/orderAction';
import { DELETE_ORDER_RESET } from '../../constants/orderConstants';
import Actions from './Actions';
import { formatDate } from '../../utils/functions';
import MetaData from '../Layouts/MetaData';
import BackdropLoader from '../Layouts/BackdropLoader';
import ImageIcon from '@mui/icons-material/Image'; // Receipt dekhne ke liye icon

const OrderTable = () => {

    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const { orders, error } = useSelector((state) => state.allOrders);
    const { loading, isDeleted, error: deleteError } = useSelector((state) => state.order);

    useEffect(() => {
        if (error) {
            enqueueSnackbar(error, { variant: "error" });
            dispatch(clearErrors());
        }
        if (deleteError) {
            enqueueSnackbar(deleteError, { variant: "error" });
            dispatch(clearErrors());
        }
        if (isDeleted) {
            enqueueSnackbar("Deleted Successfully", { variant: "success" });
            dispatch({ type: DELETE_ORDER_RESET });
        }
        dispatch(getAllOrders());
    }, [dispatch, error, deleteError, isDeleted, enqueueSnackbar]);

    const deleteOrderHandler = (id) => {
        dispatch(deleteOrder(id));
    }

    const columns = [
        {
            field: "id",
            headerName: "Order ID",
            minWidth: 200,
            flex: 1,
        },
        {
            field: "status",
            headerName: "Status",
            minWidth: 150,
            flex: 0.2,
            renderCell: (params) => {
                return (
                    <>
                        {
                            params.row.status === "Delivered" ? (
                                <span className="text-sm bg-green-100 p-1 px-2 font-medium rounded-full text-green-800">{params.row.status}</span>
                            ) : params.row.status === "Shipped" ? (
                                <span className="text-sm bg-yellow-100 p-1 px-2 font-medium rounded-full text-yellow-800">{params.row.status}</span>
                            ) : params.row.status === "Pending Approval" ? (
                                <span className="text-sm bg-orange-100 p-1 px-2 font-medium rounded-full text-orange-800">Pending</span>
                            ) : (
                                <span className="text-sm bg-purple-100 p-1 px-2 font-medium rounded-full text-purple-800">{params.row.status}</span>
                            )
                        }
                    </>
                )
            },
        },
        {
            field: "method",
            headerName: "Method",
            minWidth: 120,
            flex: 0.2,
            renderCell: (params) => {
                return (
                    <span className="font-medium uppercase text-gray-600 text-xs">
                        {params.row.method}
                    </span>
                );
            }
        },
        {
            field: "receipt",
            headerName: "Receipt",
            minWidth: 100,
            flex: 0.2,
            renderCell: (params) => {
                return (
                    params.row.receipt ? (
                        <a href={params.row.receipt} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-500 hover:text-blue-700 font-medium">
                            <ImageIcon fontSize="small" /> View
                        </a>
                    ) : <span className="text-gray-400">No Image</span>
                );
            }
        },
        {
            field: "itemsQty",
            headerName: "Items Qty",
            type: "number",
            minWidth: 100,
            flex: 0.1,
        },
        {
            field: "amount",
            headerName: "Amount",
            type: "number",
            minWidth: 150,
            flex: 0.2,
            renderCell: (params) => {
                return (
                    <span className="font-semibold text-gray-700">₹{params.row.amount.toLocaleString()}</span>
                );
            },
        },
        {
            field: "orderOn",
            headerName: "Order On",
            minWidth: 150,
            flex: 0.4,
        },
        {
            field: "actions",
            headerName: "Actions",
            minWidth: 100,
            flex: 0.3,
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                    <Actions editRoute={"order"} deleteHandler={deleteOrderHandler} id={params.row.id} />
                );
            },
        },
    ];

    const rows = [];

    orders && orders.forEach((order) => {
        rows.unshift({
            id: order._id,
            itemsQty: order.orderItems.length,
            amount: order.totalPrice,
            orderOn: formatDate(order.createdAt),
            status: order.orderStatus,
            method: order.paymentInfo?.method || "N/A", // Payment Method (EasyPaisa/JazzCash/Card)
            receipt: order.paymentInfo?.screenshot?.url || null, // Cloudinary link
        });
    });

    return (
        <>
            <MetaData title="Admin Orders | Flipkart" />

            {loading && <BackdropLoader />}

            <div className="flex justify-between items-center mb-4">
                <h1 className="text-lg font-medium uppercase text-gray-800">Manage Orders</h1>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg w-full" style={{ height: 470 }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    disableSelectIconOnClick
                    sx={{
                        boxShadow: 0,
                        border: 0,
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: '#f3f4f6',
                            color: '#374151',
                            fontWeight: 'bold',
                        },
                    }}
                />
            </div>
        </>
    );
};

export default OrderTable;