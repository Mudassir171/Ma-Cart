import { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { Link } from "react-router-dom";
import {
  getAdminProducts,
  clearErrors,
  deleteProduct,
} from "../../actions/productAction";
import { DELETE_PRODUCT_RESET } from "../../constants/productConstants";
import MetaData from "../Layouts/MetaData";
import BackdropLoader from "../Layouts/BackdropLoader";
import Actions from "../Shared/Actions";

const ProductTable = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { loading, error, products } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.user);
  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.product,
  );

  // --- SELLER FILTER LOGIC ---
  const sellerProducts = products?.filter(
    (p) => p.user === user?._id || p.user?._id === user?._id,
  );

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
  };

  const columns = [
    { field: "id", headerName: "Product ID", minWidth: 180, flex: 0.5 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => {
        return (
          <div className="flex items-center gap-3 py-1">
            <div className="w-10 h-10 rounded-full flex-shrink-0 border border-gray-200 overflow-hidden bg-gray-50 shadow-sm">
              <img
                className="w-full h-full object-cover"
                src={params.row.image}
                alt={params.row.name}
              />
            </div>
            <span className="truncate font-semibold text-gray-800 text-xs sm:text-sm">
              {params.row.name}
            </span>
          </div>
        );
      },
    },
    {
      field: "category",
      headerName: "Category",
      minWidth: 120,
      flex: 0.3,
      renderCell: (params) => (
        <span className="text-gray-600 text-xs font-medium">
          {params.row.category}
        </span>
      ),
    },
    // --- 🎨 COLORS COLUMN ---
    {
      field: "colors",
      headerName: "Colors",
      minWidth: 130,
      flex: 0.4,
      renderCell: (params) => {
        return (
          <div className="flex flex-wrap gap-1 py-1 items-center">
            {params.row.colors && params.row.colors.length > 0 ? (
              params.row.colors.map((c, i) => (
                <span
                  key={i}
                  className="bg-purple-100 text-purple-700 text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-bold border border-purple-200"
                >
                  {c}
                </span>
              ))
            ) : (
              <span className="text-gray-400 text-xs italic">N/A</span>
            )}
          </div>
        );
      },
    },
    // --- 📏 SIZES COLUMN ---
    {
      field: "sizes",
      headerName: "Sizes",
      minWidth: 130,
      flex: 0.4,
      renderCell: (params) => {
        return (
          <div className="flex flex-wrap gap-1 py-1 items-center">
            {params.row.sizes && params.row.sizes.length > 0 ? (
              params.row.sizes.map((s, i) => (
                <span
                  key={i}
                  className="bg-indigo-100 text-indigo-700 text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-bold border border-indigo-200"
                >
                  {s}
                </span>
              ))
            ) : (
              <span className="text-gray-400 text-xs italic">N/A</span>
            )}
          </div>
        );
      },
    },
    {
      field: "stock",
      headerName: "Stock",
      type: "number",
      minWidth: 90,
      flex: 0.2,
      renderCell: (params) => {
        return (
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-bold ${params.row.stock < 10 ? "bg-red-50 text-red-600 border border-red-200" : "bg-green-50 text-green-600 border border-green-200"}`}
          >
            {params.row.stock}
          </span>
        );
      },
    },
    {
      field: "price",
      headerName: "Price",
      type: "number",
      minWidth: 100,
      flex: 0.2,
      renderCell: (params) => {
        return (
          <span className="font-bold text-gray-700 text-xs sm:text-sm">
            ₹{params.row.price.toLocaleString()}
          </span>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 110,
      flex: 0.3,
      sortable: false,
      renderCell: (params) => {
        return (
          <Actions
            editRoute={"seller/update-product"}
            deleteHandler={deleteProductHandler}
            id={params.row.id}
          />
        );
      },
    },
  ];

  const rows = [];

  sellerProducts &&
    sellerProducts.forEach((item) => {
      rows.push({
        id: item._id,
        name: item.name,
        image: item.images && item.images[0] ? item.images[0].url : "",
        category: item.category,
        colors: item.colors,
        sizes: item.sizes,
        stock: item.stock,
        price: item.price,
      });
    });

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      <MetaData title="My Products | Seller" />

      {loading && <BackdropLoader />}

      {/* TOP HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black uppercase text-gray-800 tracking-wide">
            My Products
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
            Manage your inventory, prices, colors, and stock levels
            effortlessly.
          </p>
        </div>
        <Link
          to="/seller/new_products"
          className="w-full sm:w-auto text-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2.5 px-5 rounded-xl shadow-md font-bold text-xs sm:text-sm tracking-wider uppercase transition-all"
        >
          + Add New Product
        </Link>
      </div>

      {/* DATA GRID CONTAINER */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden w-full">
        <div style={{ height: 500, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 20, 50]}
            disableSelectionOnClick
            sx={{
              border: 0,
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f9fafb",
                color: "#374151",
                fontWeight: "bold",
                fontSize: "12px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid #f3f4f6",
                fontSize: "13px",
                color: "#4b5563",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#f9fafb",
              },
              "& .MuiTablePagination-root": {
                fontSize: "12px",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductTable;
