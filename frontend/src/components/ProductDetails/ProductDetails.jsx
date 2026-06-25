import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
// Removed ReactImageMagnify import
import {
  clearErrors,
  getProductDetails,
  getSimilarProducts,
  newReview,
} from "../../actions/productAction";
import { NextBtn, PreviousBtn } from "../Home/Banner/Banner";
import ProductSlider from "../Home/ProductSlider/ProductSlider";
import Loader from "../Layouts/Loader";
import StarIcon from "@mui/icons-material/Star";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PaymentsIcon from "@mui/icons-material/Payments";
import ReplayIcon from "@mui/icons-material/Replay";
import GppGoodIcon from "@mui/icons-material/GppGood";
import ShareIcon from "@mui/icons-material/Share";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Rating,
  TextField,
} from "@mui/material";
import { NEW_REVIEW_RESET } from "../../constants/productConstants";
import { addItemsToCart } from "../../actions/cartAction";
import { getDeliveryDate, getDiscount } from "../../utils/functions";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../actions/wishlistAction";
import MinCategory from "../Layouts/MinCategory";
import MetaData from "../Layouts/MetaData";
import Products from "../Products/Products";

const ProductDetails = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const params = useParams();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");

  const { product, loading, error } = useSelector(
    (state) => state.productDetails,
  );
  const { success, error: reviewError } = useSelector(
    (state) => state.newReview,
  );
  const { wishlistItems } = useSelector((state) => state.wishlist);

  const productId = params.id;
  const isOutOfStock = product?.stock <= 0;
  const itemInWishlist = wishlistItems.some((i) => i.product === productId);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out this amazing product: ${product.name}`,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      enqueueSnackbar("Product link copied to clipboard!", { variant: "info" });
    }
  };

  const addToWishlistHandler = () => {
    if (itemInWishlist) {
      dispatch(removeFromWishlist(productId));
      enqueueSnackbar("Removed from Wishlist", { variant: "info" });
    } else {
      dispatch(addToWishlist(productId));
      enqueueSnackbar("Added to Wishlist", { variant: "success" });
    }
  };

  const addToCartHandler = () => {
    if (isOutOfStock) {
      enqueueSnackbar("Product is Out of Stock", { variant: "error" });
      return;
    }
    dispatch(addItemsToCart(productId, quantity));
    enqueueSnackbar("Added to Cart Successfully", { variant: "success" });
  };

  const reviewSubmitHandler = () => {
    const formData = new FormData();
    formData.set("rating", rating);
    formData.set("comment", comment);
    formData.set("productId", productId);
    dispatch(newReview(formData));
    setOpen(false);
  };

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }
    if (reviewError) {
      enqueueSnackbar(reviewError, { variant: "error" });
      dispatch(clearErrors());
    }
    if (success) {
      enqueueSnackbar("Review Submitted Successfully", { variant: "success" });
      dispatch({ type: NEW_REVIEW_RESET });
    }
    dispatch(getProductDetails(productId));
  }, [dispatch, productId, error, reviewError, success, enqueueSnackbar]);

  useEffect(() => {
    if (product?.images?.length > 0) {
      setMainImage(product.images[0].url);
    }
    if (product?.category) {
      dispatch(getSimilarProducts(product.category));
    }
  }, [dispatch, product]);

  return (
    <>
      {loading || !product ? (
        <Loader />
      ) : (
        <div className="bg-[#eff0f5] min-h-screen pb-10">
          <MetaData title={product.name} />
          <MinCategory />

          {/* --- BREADCRUMBS SECTION --- */}
          <div className="max-w-[1200px] mx-auto px-2 pt-3">
            <div className="flex items-center gap-1 text-[12px] text-gray-500">
              <Link to="/" className="hover:text-primary-blue">
                Home
              </Link>
              <span className="text-gray-400 font-light mx-1">{">"}</span>
              <Link to="/products" className="hover:text-primary-blue">
                Products
              </Link>
              <span className="text-gray-400 font-light mx-1">{">"}</span>
              {product.category && (
                <>
                  <Link
                    to={`/products?category=${product.category}`}
                    className="hover:text-primary-blue capitalize"
                  >
                    {product.category}
                  </Link>
                  <span className="text-gray-400 font-light mx-1">{">"}</span>
                </>
              )}

              <span className="text-gray-400 truncate max-w-[200px] sm:max-w-none">
                {product.name}
              </span>
            </div>
          </div>
          {/* --- END BREADCRUMBS --- */}

          <main className="max-w-[1200px] mx-auto py-4 px-2">
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
              <div className="flex-1 bg-white shadow-sm flex flex-col md:flex-row">
                {/* --- LEFT SIDE: IMAGES & THUMBNAILS --- */}
                <div className="w-full md:w-[45%] p-4 border-r border-gray-100 flex flex-col z-6">
                  {/* Updated: Standard Image Display instead of Zoom */}
                  <div className=" border border-gray-100 rounded w-full h-[300px] sm:h-[400px] mx-auto overflow-hidden flex items-center justify-center z-6">
                    <img
                      src={
                        mainImage || (product.images && product.images[0]?.url)
                      }
                      alt={product.name}
                      className="w-full h-full object-contain z-6"
                    />
                  </div>

                  {/* Thumbnails */}
                  <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                    {product.images?.map((item, i) => (
                      <div
                        key={i}
                        onMouseEnter={() => setMainImage(item.url)}
                        className={`w-16 h-16 sm:w-20 sm:h-20 border-2 cursor-pointer rounded overflow-hidden flex-shrink-0 transition-all ${mainImage === item.url ? "border-[#f57224]" : "border-gray-200"}`}
                      >
                        <img
                          className="w-full h-full object-contain bg-white"
                          src={item.url}
                          alt={`thumb-${i}`}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-6 px-4">
                    <button
                      onClick={handleShare}
                      className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-all font-bold text-xs"
                    >
                      <ShareIcon fontSize="small" /> SHARE
                    </button>
                    <button
                      onClick={addToWishlistHandler}
                      className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-all font-bold text-xs"
                    >
                      <FavoriteBorderIcon
                        fontSize="small"
                        className={itemInWishlist ? "text-red-500" : ""}
                      />{" "}
                      WISHLIST
                    </button>
                  </div>
                </div>

                {/* --- CENTER SIDE: PRODUCT INFO --- */}
                <div className="flex-1 p-5">
                  <h1 className="text-xl font-normal text-gray-800 mb-2">
                    {product.name}
                  </h1>

                  <div className="flex items-center gap-4 mb-4 border-b border-gray-50 pb-4">
                    <div className="flex items-center">
                      <Rating
                        value={product.ratings}
                        readOnly
                        size="small"
                        precision={0.5}
                      />
                      <span className="text-[#1a9cb7] text-xs ml-2 hover:underline cursor-pointer">
                        {product.numOfReviews} Ratings
                      </span>
                    </div>
                  </div>

                  <div className="mb-3">
                    {isOutOfStock ? (
                      <div className="flex items-center gap-1 text-red-600 font-bold text-[13px] uppercase animate-pulse">
                        <ErrorOutlineIcon sx={{ fontSize: "18px" }} /> Out of
                        Stock
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-green-600 font-bold text-[13px] uppercase">
                        <CheckCircleOutlineIcon sx={{ fontSize: "18px" }} /> In
                        Stock
                      </div>
                    )}
                  </div>

                  <div className="mb-6">
                    <span className="text-[#f57224] text-3xl font-medium tracking-tight">
                      Rs. {product.price?.toLocaleString()}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-gray-400 line-through text-sm">
                        Rs. {product.cuttedPrice?.toLocaleString()}
                      </span>
                      <span className="text-gray-700 text-sm font-medium">
                        {getDiscount(product.price, product.cuttedPrice)}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-10 mb-8">
                    <span className="text-gray-500 text-[13px] font-bold uppercase">
                      Quantity
                    </span>
                    <div
                      className={`flex border border-gray-300 rounded-sm overflow-hidden ${isOutOfStock ? "opacity-30 pointer-events-none" : "bg-white"}`}
                    >
                      <button
                        onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
                        className="px-3 py-1 bg-[#fafafa] hover:bg-gray-200 text-xl border-r"
                      >
                        -
                      </button>
                      <span className="px-6 py-1 text-sm flex items-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() =>
                          setQuantity((q) => (q < product.stock ? q + 1 : q))
                        }
                        className="px-3 py-1 bg-[#fafafa] hover:bg-gray-200 text-xl border-l"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {isOutOfStock ? (
                      <button
                        disabled
                        className="w-full py-3.5 bg-gray-400 text-white font-bold rounded-sm uppercase text-sm cursor-not-allowed shadow-inner"
                      >
                        Out of Stock
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => navigate("/shipping")}
                          className="flex-1 py-3.5 bg-[#2bbeef] text-white font-bold rounded-sm uppercase text-sm hover:brightness-95 transition-all shadow-sm"
                        >
                          Buy Now
                        </button>
                        <button
                          onClick={addToCartHandler}
                          className="flex-1 py-3.5 bg-[#f57224] text-white font-bold rounded-sm uppercase text-sm hover:brightness-95 transition-all shadow-sm"
                        >
                          Add to Cart
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* --- RIGHT SIDEBAR: DELIVERY, RETURN & SELLER --- */}
              <div className="w-full lg:w-[320px] flex flex-col gap-3">
                {/* 1. Delivery Options Section */}
                <div className="bg-white p-4 shadow-sm border border-gray-100 rounded-sm">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-gray-500 text-[12px]">
                      Delivery Options
                    </p>
                    <ErrorOutlineIcon
                      sx={{ fontSize: "16px", color: "#9e9e9e" }}
                    />
                  </div>

                  <div className="flex items-start gap-3 mb-4">
                    <LocationOnIcon
                      fontSize="small"
                      className="text-gray-400"
                    />
                    <div className="flex-1">
                      <p className="text-[13px] text-gray-800">
                        Sindh, Karachi - Gulshan-e-Iqbal, Block 15
                      </p>
                    </div>
                    <button className="text-[#1a9cb7] text-[13px] font-medium uppercase">
                      Change
                    </button>
                  </div>

                  <div className="flex items-start gap-3 border-t pt-3 mb-3">
                    <LocalShippingIcon
                      fontSize="small"
                      className="text-gray-400"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <p className="text-[13px] font-medium">
                          Standard Delivery
                        </p>
                        <p className="text-[14px] font-bold">Rs. 140</p>
                      </div>
                      <p className="text-gray-500 text-[11px]">
                        Guaranteed by {getDeliveryDate()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <PaymentsIcon fontSize="small" className="text-gray-400" />
                    <p className="text-[13px] text-gray-700">
                      Cash on Delivery Available
                    </p>
                  </div>
                </div>

                {/* 2. Return & Warranty Section */}
                <div className="bg-white p-4 shadow-sm border border-gray-100 rounded-sm">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-gray-500 text-[12px]">
                      Return & Warranty
                    </p>
                    <ErrorOutlineIcon
                      sx={{ fontSize: "16px", color: "#9e9e9e" }}
                    />
                  </div>

                  <div className="flex items-start gap-3 mb-4">
                    <ReplayIcon fontSize="small" className="text-gray-400" />
                    <div className="flex-1">
                      <p className="text-[13px] text-gray-800">
                        14 days easy return
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <GppGoodIcon fontSize="small" className="text-gray-400" />
                    <div className="flex-1">
                      <p className="text-[13px] text-gray-800">
                        {product.warranty > 0
                          ? `${product.warranty} Months Warranty`
                          : "Warranty not available"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. Seller Information Section */}
                <div className="bg-white p-4 shadow-sm border border-gray-100 rounded-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-gray-500 text-[11px] mb-1">Sold by</p>
                      <p className="text-[15px] font-medium text-gray-800">
                        {product.user?.shopName || "Official Store"}
                      </p>
                    </div>
                    <button className="flex items-center gap-1 text-[#1a9cb7] text-[13px] font-bold">
                      <ShareIcon
                        sx={{ fontSize: "14px", transform: "scaleX(-1)" }}
                      />{" "}
                      CHAT NOW
                    </button>
                  </div>

                  <div className="grid grid-cols-3 border-t pt-3">
                    <div className="text-center border-r border-gray-100">
                      <p className="text-gray-400 text-[10px] uppercase leading-tight px-1">
                        Positive Seller Ratings
                      </p>
                      <p className="text-2xl font-normal mt-2">95%</p>
                    </div>
                    <div className="text-center border-r border-gray-100">
                      <p className="text-gray-400 text-[10px] uppercase leading-tight px-1">
                        Ship on Time
                      </p>
                      <p className="text-2xl font-normal mt-2">97%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400 text-[10px] uppercase leading-tight px-1">
                        Chat Response Rate
                      </p>
                      <p className="text-gray-400 text-[10px] mt-4 italic">
                        Not enough data
                      </p>
                    </div>
                  </div>

                  <Link
                    to={`/seller/store/${product.user?._id}`}
                    className="w-full text-center text-[#1a9cb7] text-[13px] font-bold mt-4 uppercase border-t pt-3 hover:underline"
                  >
                    Go to Store
                  </Link>
                </div>
              </div>
            </div>

            {/* --- DETAILS TABS --- */}
            <div className="bg-white shadow-sm mb-4">
              <div className="bg-[#fafafa] px-5 py-3 border-b border-gray-100 font-bold text-gray-800 uppercase text-[14px]">
                Product Highlights
              </div>
              <div className="p-5">
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2 list-disc pl-5 text-[13px] text-gray-700">
                  {product.highlights?.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* --- Specifications Section --- */}
            <div className="bg-white shadow-sm mb-4">
              <div className="bg-[#fafafa] px-5 py-3 border-b border-gray-100 font-bold text-gray-800 uppercase text-[14px]">
                Specifications
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-y-6">
                {/* Brand aur SKU (Basic Specs) */}
                <div className="flex flex-col">
                  <span className="text-gray-400 text-[12px]">Brand</span>
                  <span className="text-[13px] text-gray-800 font-medium">
                    {product.brandname || "No Brand"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-400 text-[12px]">SKU Number</span>
                  <span className="text-[13px] text-gray-800 font-medium">
                    {product._id}
                  </span>
                </div>

                {/* --- DYNAMIC SPECS (Jo aapne NewProduct page se add kiye) --- */}
                {product.specifications &&
                  product.specifications.map((spec, i) => (
                    <div key={i} className="flex flex-col">
                      <span className="text-gray-400 text-[12px]">
                        {spec.title}
                      </span>
                      <span className="text-[13px] text-gray-800 font-medium">
                        {spec.description}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
            {/* --- PRODUCT DESCRIPTION SECTION --- */}
            <div className="bg-white shadow-sm mb-4">
              <div className="bg-[#fafafa] px-5 py-3 border-b border-gray-100 font-bold text-gray-800 uppercase text-[14px]">
                Product Description
              </div>
              <div className="p-5 text-[14px] text-gray-700 leading-relaxed">
                {/* Yahan check karein ki 'description' field ka naam sahi hai */}
                <p>
                  {product.description
                    ? product.description
                    : "No description available"}
                </p>
              </div>
            </div>

            {/* --- REVIEWS --- */}
            <div className="bg-white shadow-sm">
              <div className="bg-[#fafafa] px-5 py-3 border-b border-gray-100 font-bold text-gray-800 uppercase text-[14px]">
                Ratings & Reviews
              </div>
              <div className="p-5">
                <div className="flex flex-col md:flex-row gap-10 border-b border-gray-100 pb-8 mb-6">
                  <div className="flex flex-col items-center justify-center border-r pr-12 border-gray-100">
                    <span className="text-4xl font-medium">
                      {product.ratings?.toFixed(1)}
                      <span className="text-gray-400 text-2xl">/5</span>
                    </span>
                    <Rating
                      value={product.ratings}
                      readOnly
                      size="large"
                      precision={0.5}
                      className="my-2"
                    />
                    <span className="text-gray-500 text-xs">
                      {product.numOfReviews} Ratings
                    </span>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() => setOpen(true)}
                      className="border border-[#1a9cb7] text-[#1a9cb7] px-8 py-2 rounded-sm text-xs font-bold uppercase hover:bg-blue-50"
                    >
                      Write a Review
                    </button>
                  </div>
                </div>
                {product.reviews?.map((rev, i) => (
                  <div
                    key={i}
                    className="py-4 border-b border-gray-50 last:border-0"
                  >
                    <Rating value={rev.rating} readOnly size="small" />
                    <p className="text-[12px] text-gray-400 mt-1">
                      by {rev.name}{" "}
                      <VerifiedUserIcon
                        sx={{ fontSize: "14px", color: "#388e3c", ml: 0.5 }}
                      />
                    </p>
                    <p className="text-[14px] text-gray-800 mt-2">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <ProductSlider title={"Related Products"} />
          </main>

          <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle className="font-bold border-b">
              Product Review
            </DialogTitle>
            <DialogContent className="flex flex-col gap-4 pt-6">
              <Rating
                value={rating}
                onChange={(e, val) => setRating(val)}
                size="large"
              />
              <TextField
                label="Your Experience"
                multiline
                rows={3}
                fullWidth
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </DialogContent>
            <DialogActions className="p-4 border-t">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-gray-500 font-bold uppercase text-xs"
              >
                Cancel
              </button>
              <button
                onClick={reviewSubmitHandler}
                className="px-6 py-2 bg-[#f57224] text-white rounded font-bold uppercase text-xs"
              >
                Submit
              </button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </>
  );
};

export default ProductDetails;
