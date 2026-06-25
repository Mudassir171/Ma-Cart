import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { clearErrors, getOrderDetails, updateOrder } from '../../actions/orderAction';
import { UPDATE_ORDER_RESET } from '../../constants/orderConstants';
import { formatDate } from '../../utils/functions';
import TrackStepper from '../Order/TrackStepper';
import Loading from './Loading';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import MetaData from '../Layouts/MetaData';

const UpdateOrder = () => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const params = useParams();

    const [status, setStatus] = useState("");

    const { order, error, loading } = useSelector((state) => state.orderDetails);
    const { isUpdated, error: updateError } = useSelector((state) => state.order);

    useEffect(() => {
        if (error) {
            enqueueSnackbar(error, { variant: "error" });
            dispatch(clearErrors());
        }
        if (updateError) {
            enqueueSnackbar(updateError, { variant: "error" });
            dispatch(clearErrors());
        }
        if (isUpdated) {
            enqueueSnackbar("Order Updated Successfully", { variant: "success" });
            dispatch({ type: UPDATE_ORDER_RESET });
        }
        dispatch(getOrderDetails(params.id));
    }, [dispatch, error, params.id, isUpdated, updateError, enqueueSnackbar]);

    const updateOrderSubmitHandler = (e) => {
        e.preventDefault();
        if (!status) {
            enqueueSnackbar("Please select a status", { variant: "warning" });
            return;
        }
        const formData = new FormData();
        formData.set("status", status);
        dispatch(updateOrder(params.id, formData));
    };

    return (
        <>
            <MetaData title="Admin: Update Order | Flipkart" />
            {loading ? <Loading /> : (
                <>
                    {order && order.user && order.shippingInfo && (
                        <div className="flex flex-col gap-4 p-4">
                            <Link to="/admin/orders" className="ml-1 flex items-center gap-0 font-medium text-primary-blue uppercase">
                                <ArrowBackIosIcon sx={{ fontSize: "18px" }} />Go Back
                            </Link>

                            <div className="bg-white shadow-lg rounded-lg p-8">
                                <h3 className="font-medium text-lg">Order Status: {order.orderStatus}</h3>
                                <p className="text-sm">
                                    {order.orderStatus === "Shipped" && `Shipped on ${formatDate(order.shippedAt)}`}
                                    {order.orderStatus === "Processing" && `Ordered on ${formatDate(order.createdAt)}`}
                                    {order.orderStatus === "Delivered" && `Delivered on ${formatDate(order.deliveredAt)}`}
                                </p>
                            </div>

                            {/* Status Update Form */}
                            <div className="bg-white shadow-lg rounded-lg p-8">
                                <form onSubmit={updateOrderSubmitHandler} className="flex flex-col gap-4">
                                    <h3 className="font-medium text-lg">Update Status</h3>
                                    <FormControl fullWidth>
                                        <InputLabel>Status</InputLabel>
                                        <Select 
                                            value={status} 
                                            label="Status" 
                                            onChange={(e) => setStatus(e.target.value)}
                                        >
                                            {order.orderStatus === "Processing" && <MenuItem value={"Shipped"}>Shipped</MenuItem>}
                                            {order.orderStatus === "Shipped" && <MenuItem value={"Delivered"}>Delivered</MenuItem>}
                                        </Select>
                                    </FormControl>
                                    <button type="submit" className="bg-primary-orange text-white p-2.5 rounded font-medium shadow hover:shadow-lg">
                                        Update Order Status
                                    </button>
                                </form>
                            </div>

                            {/* Items List */}
                            {order.orderItems && order.orderItems.map((item) => (
                                <div className="flex flex-col sm:flex-row min-w-full shadow-lg rounded-lg bg-white px-2 py-5" key={item.product}>
                                    <div className="flex flex-col sm:flex-row sm:w-1/2 gap-1">
                                        <img className="w-32 h-24 object-contain" src={item.image} alt={item.name} />
                                        <div className="flex flex-col">
                                            <p>{item.name}</p>
                                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <div className="sm:w-1/2">
                                        <TrackStepper
                                            activeStep={order.orderStatus === "Delivered" ? 2 : order.orderStatus === "Shipped" ? 1 : 0}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default UpdateOrder;