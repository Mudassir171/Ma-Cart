import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { clearErrors, deleteReview, getAdminProducts } from '../../actions/productAction';
import axios from 'axios';
import Rating from '@mui/material/Rating';
import Actions from './Actions';
import { DELETE_REVIEW_RESET } from '../../constants/productConstants';
import MetaData from '../Layouts/MetaData';
import BackdropLoader from '../Layouts/BackdropLoader';

const ReviewsTable = () => {

    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const { products, error } = useSelector((state) => state.products);
    const { loading, isDeleted, error: deleteError } = useSelector((state) => state.review);

    const [allReviews, setAllReviews] = useState([]);
    const [tableLoading, setTableLoading] = useState(false);

    // 1. Page load hote hi admin/sellers ki saari products fetch karo
    useEffect(() => {
        dispatch(getAdminProducts());
    }, [dispatch]);

    // 2. Saari products ke reviews ko fetch karke ek array mein combine karo
    useEffect(() => {
        const fetchAllReviews = async () => {
            if (products && products.length > 0) {
                setTableLoading(true);
                try {
                    let loadedReviews = [];
                    for (const product of products) {
                        const { data } = await axios.get(`/api/v1/reviews?id=${product._id}`);
                        if (data && data.reviews) {
                            // Har review ke sath product ka naam aur status (Admin/Seller) attach kar do
                            const productReviews = data.reviews.map(rev => ({
                                ...rev,
                                productId: product._id,
                                productName: product.name,
                                status: product.user ? "Seller" : "Admin"
                            }));
                            loadedReviews = [...loadedReviews, ...productReviews];
                        }
                    }
                    setAllReviews(loadedReviews);
                } catch (err) {
                    enqueueSnackbar("Failed to load reviews", { variant: "error" });
                }
                setTableLoading(false);
            }
        };

        fetchAllReviews();
    }, [products, isDeleted, enqueueSnackbar]);

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
            enqueueSnackbar("Review Deleted Successfully", { variant: "success" });
            dispatch({ type: DELETE_REVIEW_RESET });
        }
    }, [dispatch, error, deleteError, isDeleted, enqueueSnackbar]);

    const deleteReviewHandler = (id, productId) => {
        dispatch(deleteReview(id, productId));
    }

    const columns = [
        {
            field: "id",
            headerName: "Review ID",
            minWidth: 180,
            flex: 0.4,
        },
        {
            field: "productName",
            headerName: "Product",
            minWidth: 180,
            flex: 0.5,
        },
        {
            field: "user",
            headerName: "User",
            minWidth: 130,
            flex: 0.4,
        },
        {
            field: "status",
            headerName: "Status",
            minWidth: 110,
            flex: 0.3,
            renderCell: (params) => {
                return (
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${params.row.status === 'Admin' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                        {params.row.status}
                    </span>
                );
            }
        },
        {
            field: "rating",
            headerName: "Rating",
            type: "number",
            minWidth: 140,
            flex: 0.3,
            align: "left",
            headerAlign: "left",
            renderCell: (params) => {
                return <Rating readOnly value={params.row.rating} size="small" precision={0.5} />
            }
        },
        {
            field: "comment",
            headerName: "Comment",
            minWidth: 200,
            flex: 0.5,
        },
        {
            field: "actions",
            headerName: "Actions",
            minWidth: 120,
            flex: 0.3,
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                    <Actions editRoute={"review"} deleteHandler={(id) => deleteReviewHandler(id, params.row.productId)} id={params.row.id} />
                );
            },
        },
    ];

    const rows = [];

    allReviews && allReviews.forEach((rev) => {
        rows.push({
            id: rev._id,
            productId: rev.productId,
            productName: rev.productName,
            rating: rev.rating,
            comment: rev.comment,
            user: rev.name,
            status: rev.status,
        });
    });

    return (
        <>
            <MetaData title="All Reviews | Flipkart" />

            {(loading || tableLoading) && <BackdropLoader />}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-lg font-medium uppercase">All Products Reviews (Admin & Seller)</h1>
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

export default ReviewsTable;