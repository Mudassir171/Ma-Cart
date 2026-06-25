import { useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { Link } from 'react-router-dom';
import { clearErrors, deleteProduct, getAdminProducts } from '../../actions/productAction';
import Rating from '@mui/material/Rating';
import { DELETE_PRODUCT_RESET } from '../../constants/productConstants';
// import Actions from './Actions';
import MetaData from '../Layouts/MetaData';
import BackdropLoader from '../Layouts/BackdropLoader';
import { updateProductStatus } from '../../actions/productAction';
// Purana import shayad aisa tha:
// import Actions from './Actions'; 

// Naya import aisa hoga:
import Actions from '../Shared/Actions';


const ProductTable = () => {

    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const { products, error } = useSelector((state) => state.products);
    const { loading, isDeleted, isUpdated, error: deleteError } = useSelector((state) => state.product);

    const updateStatusHandler = (id, status) => {
        dispatch(updateProductStatus(id, { isApproved: status }));
    };
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
        if (isUpdated) {
            enqueueSnackbar("Product Status Updated", { variant: "success" });
            dispatch({ type: "UPDATE_PRODUCT_STATUS_RESET" }); // Ensure karein ye constant aapke constants file mein ho
            dispatch(getAdminProducts());
        }
        dispatch(getAdminProducts());
    }, [dispatch, error, deleteError, isDeleted, isUpdated, enqueueSnackbar]);

    const deleteProductHandler = (id) => {
        dispatch(deleteProduct(id));
    }

    const columns = [
        {
            field: "id",
            headerName: "Product ID",
            minWidth: 100,
            flex: 0.5,
        },
        {
            field: "isApproved",
            headerName: "Status",
            minWidth: 100,
            renderCell: (params) => (
                <span className={ params.row.isApproved ? "text-green-600 font-bold" : "text-red-600 font-bold" }>
                    { params.row.isApproved ? "Approved" : "Pending" }
                </span>
            ),
        },
        {
            field: "name",
            headerName: "Name",
            minWidth: 200,
            flex: 1,
            renderCell: (params) => {
                return (
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full">
                            <img draggable="false" src={ params.row.image } alt={ params.row.name } className="w-full h-full rounded-full object-cover" />
                        </div>
                        { params.row.name }
                    </div>
                )
            },
        },
        // Admin wali file mein columns ke andar ye add karein
        {
            field: "owner",
            headerName: "Added By",
            minWidth: 100,
            flex: 0.2,
            renderCell: (params) => {
                // Agar backend se product ke sath user populate ho kar aa raha hai
                return (
                    <span>
                        { params.row.ownerRole === 'admin' ? "Admin" : "Seller" }
                    </span>
                );
            },
        },
        {
            field: "category",
            headerName: "Category",
            minWidth: 100,
            flex: 0.1,
        },
        {
            field: "stock",
            headerName: "Stock",
            type: "number",
            headerAlign: "left",
            align: "left",
            minWidth: 70,
            flex: 0.1,
            renderCell: (params) => {
                return (
                    <>
                        {
                            params.row.stock < 10 ? (
                                <span className="font-medium text-red-700 rounded-full bg-red-200 p-1 w-6 h-6 flex items-center justify-center">{ params.row.stock }</span>
                            ) : (
                                <span className="">{ params.row.stock }</span>
                            )
                        }
                    </>
                )
            },
        },
        {
            field: "price",
            headerName: "Price",
            type: "number",
            minWidth: 100,
            headerAlign: "left",
            align: "left",
            flex: 0.2,
            renderCell: (params) => {
                return (
                    <span>₹{ params.row.price.toLocaleString() }</span>
                );
            },
        },
        {
            field: "cprice",
            headerName: "Cutted Price",
            type: "number",
            minWidth: 100,
            headerAlign: "left",
            align: "left",
            flex: 0.2,
            renderCell: (params) => {
                return (
                    <span>₹{ params.row.cprice.toLocaleString() }</span>
                );
            },
        },
        {
            field: "rating",
            headerName: "Rating",
            type: "number",
            minWidth: 100,
            flex: 0.1,
            align: "left",
            headerAlign: "left",
            renderCell: (params) => {
                return <Rating readOnly value={ params.row.rating } size="small" precision={ 0.5 } />
            }
        },
      
        // ProductTable.jsx mein 'actions' column ka part:
        {
    field: "actions",
    headerName: "Actions",
    minWidth: 200, // Size thoda badha diya taake saare buttons fit aa jayein
    flex: 0.4,
    sortable: false,
    renderCell: (params) => (
        <Actions
            id={params.row.id}
            name={params.row.name} // <--- Yeh zaroori hai dialog mein name dikhane ke liye
            editRoute="update-product" // Yahan apne route ka naam check kar lein
            deleteHandler={deleteProductHandler}
            updateStatusHandler={updateStatusHandler}
            isSeller={false} // Agar admin panel hai to false
        />
    ),
},
        


    ];

    const rows = [];


    products && products.forEach((item) => {
        rows.unshift({
            id: item._id,
            isApproved: item.isApproved,
            name: item.name,
            image: item.images[0].url,
            category: item.category,
            stock: item.stock,
            price: item.price,
            cprice: item.cuttedPrice,
            rating: item.ratings,
            // Yahan se data utha rahe hain jo ab backend se populate ho kar aa raha hai
            ownerRole: item.user?.role || "seller",
        });
    });
    return (
        <>
            <MetaData title="Admin Products | Flipkart" />

            { loading && <BackdropLoader /> }

            <div className="flex justify-between items-center">
                <h1 className="text-lg font-medium uppercase">products</h1>
                <Link to="/admin/new_product" className="py-2 px-4 rounded shadow font-medium text-white bg-primary-blue hover:shadow-lg">New Product</Link>
            </div>
            <div className="bg-white rounded-xl shadow-lg w-full" style={ { height: 470 } }>

                <DataGrid
                    rows={ rows }
                    columns={ columns }
                    pageSize={ 10 }
                    disableSelectIconOnClick
                    sx={ {
                        boxShadow: 0,
                        border: 0,
                    } }
                />
            </div>
        </>
    );
};

export default ProductTable;