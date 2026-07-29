import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { clearErrors, deleteReview, getAllReviews, getAdminProducts } from '../../actions/productAction';
import Rating from '@mui/material/Rating';
import Actions from './Actions';
import { DELETE_REVIEW_RESET } from '../../constants/productConstants';
import MetaData from '../Layouts/MetaData';
import BackdropLoader from '../Layouts/BackdropLoader';

const ReviewsTable = () => {

    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const [productId, setProductId] = useState("");

    const { reviews, error } = useSelector((state) => state.reviews);
    const { products } = useSelector((state) => state.products);
    const { user } = useSelector((state) => state.user);
    const { loading, isDeleted, error: deleteError } = useSelector((state) => state.review);

    // 1. Page load hote hi saari products (Admin & Seller dono) fetch karo
    useEffect(() => {
        dispatch(getAdminProducts());
    }, [dispatch]);

    // 2. Jaise hi products mil jayein, pehli product ki ID automatically set kar do
    useEffect(() => {
        if (products && products.length > 0 && !productId) {
            setProductId(products[0]._id);
        }
    }, [products, productId]);

    // 3. Product ID milne par uske reviews fetch karo
    useEffect(() => {
        if (productId) {
            dispatch(getAllReviews(productId));
        }
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
    }, [dispatch, error, deleteError, isDeleted, productId, enqueueSnackbar]);

    const deleteReviewHandler = (id) => {
        dispatch(deleteReview(id, productId));
    }

    // Find the currently selected product object to check its ownership (Admin or Seller)
    const currentProduct = products?.find(p => p._id === productId);
    
    // Check if the product belongs to a seller or admin
    // Agar product mein 'user' field mojood hai aur woh current user se alag hai (ya role seller hai), toh status Seller hoga
    const isSellerProduct = currentProduct?.user ? true : false;
    const productStatus = isSellerProduct ? "Seller" : "Admin";

    const columns = [
        {
            field: "id",
            headerName: "Review ID",
            minWidth: 180,
            flex: 0.4,
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
            minWidth: 120,
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
            minWidth: 150,
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
            minWidth: 130,
            flex: 0.3,
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                    <Actions editRoute={"review"} deleteHandler={deleteReviewHandler} id={params.row.id} />
                );
            },
        },
    ];

    const rows = [];

    reviews && reviews.forEach((rev) => {
        rows.push({
            id: rev._id,
            rating: rev.rating,
            comment: rev.comment,
            user: rev.name,
            status: productStatus, // Yahan har review ke sath Admin ya Seller assign ho raha hai
        });
    });

    return (
        <>
            <MetaData title="Admin & Seller Reviews | Ma-Cart" />

            {loading && <BackdropLoader />}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <h1 className="text-lg font-medium uppercase">Product Reviews (Admin & Seller)</h1>
                
                {/* Product Dropdown Selector */}
                <select 
                    value={productId} 
                    onChange={(e) => setProductId(e.target.value)} 
                    className="outline-none border rounded p-2 bg-white shadow-sm w-full sm:w-72"
                >
                    <option value="">Select Product</option>
                    {products && products.map((item) => {
                        const ownerType = item.user ? "Seller" : "Admin";
                        return (
                            <option key={item._id} value={item._id}>
                                {item.name} ({ownerType})
                            </option>
                        );
                    })}
                </select>
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