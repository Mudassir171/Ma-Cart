import { useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { Link } from 'react-router-dom';
import { getAdminProducts, clearErrors, deleteProduct } from '../../actions/productAction';
import { DELETE_PRODUCT_RESET } from '../../constants/productConstants';
// import Actions from '../Admin/Actions'; // Purana Actions component use kar sakte hain
import MetaData from '../Layouts/MetaData';
import BackdropLoader from '../Layouts/BackdropLoader';
// Naya import:
import Actions from '../Shared/Actions';

const ProductTable = () => {

    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const { loading, error, products } = useSelector((state) => state.products);
    const { user } = useSelector((state) => state.user);
    const { error: deleteError, isDeleted } = useSelector((state) => state.product);

    // --- SELLER FILTER LOGIC ---
    // Sirf wo products filter karein jo is seller ki hain
    const sellerProducts = products?.filter(p => p.user === user._id || p.user?._id === user._id);

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
            enqueueSnackbar("Product Deleted Successfully", { variant: "success" });
            dispatch({ type: DELETE_PRODUCT_RESET });
        }
        dispatch(getAdminProducts());
    }, [dispatch, error, deleteError, isDeleted, enqueueSnackbar]);

    const deleteProductHandler = (id) => {
        dispatch(deleteProduct(id));
    }

    const columns = [
        { field: "id", headerName: "Product ID", minWidth: 200, flex: 0.5 },
        {
            field: "name",
            headerName: "Name",
            minWidth: 200,
            flex: 1,
            renderCell: (params) => {
                return (
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full">
                            <img className="w-full h-full rounded-full object-cover" src={params.row.image} alt={params.row.name} />
                        </div>
                        {params.row.name}
                    </div>
                )
            },
        },
        {
            field: "category",
            headerName: "Category",
            minWidth: 100,
            flex: 0.3,
        },
        {
            field: "stock",
            headerName: "Stock",
            type: "number",
            minWidth: 80,
            flex: 0.2,
            renderCell: (params) => {
                return (
                    <span className={params.row.stock < 10 ? "text-red-500 font-medium" : "text-green-500"}>
                        {params.row.stock}
                    </span>
                )
            }
        },
        {
            field: "price",
            headerName: "Price",
            type: "number",
            minWidth: 100,
            flex: 0.2,
            renderCell: (params) => {
                return <span>₹{params.row.price.toLocaleString()}</span>
            }
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
                    // Edit link ko bhi /seller/ mein change kiya hai
                    <Actions 
                    editRoute={"seller/update-product"} 
                    deleteHandler={deleteProductHandler}
                     id={params.row.id} />
                );
            },
        },
    ];

    const rows = [];

    sellerProducts && sellerProducts.forEach((item) => {
        rows.push({
            id: item._id,
            name: item.name,
            image: item.images[0].url,
            category: item.category,
            stock: item.stock,
            price: item.price,
        });
    });

    return (
        <>
            <MetaData title="My Products | Seller" />

            {loading && <BackdropLoader />}

            <div className="flex justify-between items-center">
                <h1 className="text-lg font-medium uppercase text-gray-800">My Products</h1>
                <Link to="/seller/new_product" className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded shadow font-medium">Add New Product</Link>
            </div>

            <div className="bg-white rounded-xl shadow-lg w-full" style={{ height: 470 }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    disableSelectionOnClick
                    sx={{
                        boxShadow: 0,
                        border: 0,
                    }}
                />
            </div>
        </>
    );
};

export default ProductTable;