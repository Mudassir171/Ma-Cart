import { getDiscount } from '../../../utils/functions';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '../../../actions/wishlistAction';
import { useSnackbar } from 'notistack';

const Product = (props) => {
    const { _id, name, images, ratings, numOfReviews, price, cuttedPrice, stock } = props;
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const { wishlistItems } = useSelector((state) => state.wishlist);
    const itemInWishlist = wishlistItems.some((i) => i.product === _id);

    const discountPercentage = cuttedPrice > price ? getDiscount(price, cuttedPrice) : 0;

    const addToWishlistHandler = (e) => {
        e.preventDefault();
        if (itemInWishlist) {
            dispatch(removeFromWishlist(_id));
            enqueueSnackbar("Removed from Wishlist", { variant: "success" });
        } else {
            dispatch(addToWishlist(_id));
            enqueueSnackbar("Added to Wishlist", { variant: "success" });
        }
    };

    return (
        <div className="group relative bg-white flex flex-col w-full h-full border border-gray-100 hover:border-emerald-300 hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden">
            
            {/* Top Absolute Floating Badges */}
            <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 pointer-events-none">
                {discountPercentage > 0 && (
                    <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md tracking-wide uppercase">
                        {discountPercentage}% OFF
                    </span>
                )}
                {stock <= 3 && stock > 0 ? (
                    <span className="bg-amber-500 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full shadow-sm uppercase animate-pulse">
                        Only {stock} Left
                    </span>
                ) : stock === 0 ? (
                    <span className="bg-rose-500 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full shadow-sm uppercase">
                        Sold Out
                    </span>
                ) : null}
            </div>

            {/* Absolute Wishlist Button */}
            <button 
                onClick={addToWishlistHandler}
                aria-label="Wishlist Button"
                className={`absolute top-3 right-3 z-20 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 shadow-md ${
                    itemInWishlist 
                        ? "bg-rose-50 text-rose-500 scale-110 shadow-rose-100" 
                        : "bg-white/80 text-gray-400 hover:text-rose-500 hover:bg-white"
                }`}
            >
                <FavoriteIcon sx={{ fontSize: "18px" }} />
            </button>

            <Link to={`/product/${_id}`} className="flex flex-col h-full">
                
                {/* 1. Image Area with Zoom Effect & Background Glow */}
                <div className="relative w-full aspect-square bg-gradient-to-b from-gray-50/80 to-emerald-50/20 flex items-center justify-center overflow-hidden p-6">
                    <div className="absolute inset-0 bg-emerald-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <img
                        draggable="false"
                        className="w-full h-full object-contain filter group-hover:scale-110 transition-transform duration-700 ease-out"
                        src={images && images[0] ? images[0].url : ""}
                        alt={name}
                    />
                </div>

                {/* 2. Product Info Section */}
                <div className="p-4 flex flex-col flex-grow bg-white justify-between">
                    <div>
                        {/* Stock status indicator small text */}
                        <div className="mb-1.5 flex items-center justify-between">
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${stock > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {stock > 0 ? '● In Stock' : '● Unavailable'}
                            </span>
                        </div>

                        {/* Title */}
                        <h2 className="text-[13px] sm:text-[14px] leading-snug text-gray-800 font-semibold group-hover:text-emerald-700 transition-colors line-clamp-2 h-10 mb-2">
                            {name}
                        </h2>

                        {/* Ratings */}
                        <div className="flex items-center gap-1.5 mb-3">
                            <div className="flex items-center bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                                <StarIcon sx={{ fontSize: "13px" }} className="text-amber-400 mr-0.5" />
                                <span className="text-[11px] font-bold text-gray-700">{ratings ? ratings.toFixed(1) : "0.0"}</span>
                            </div>
                            <span className="text-[11px] text-gray-400 font-medium">({numOfReviews ? numOfReviews.toLocaleString() : 0})</span>
                        </div>
                    </div>

                    {/* Price & Quick Action Bar */}
                    <div className="pt-2 border-t border-gray-100 flex items-end justify-between mt-auto">
                        <div>
                            <div className="flex items-baseline gap-1.5 flex-wrap">
                                <span className="text-emerald-900 text-base sm:text-lg font-black tracking-tight">
                                    Rs:{price ? price.toLocaleString() : 0}
                                </span>
                                {cuttedPrice > price && (
                                    <span className="text-gray-400 line-through text-[11px] font-medium">
                                        Rs:{cuttedPrice.toLocaleString()}
                                    </span>
                                )}
                            </div>
                            {cuttedPrice > price && (
                                <p className="text-[10px] font-bold text-emerald-600 tracking-tight mt-0.5">
                                    Save Rs:{(cuttedPrice - price).toLocaleString()}
                                </p>
                            )}
                        </div>

                        {/* Quick View / Add Icon Button */}
                        <div className="h-9 w-9 bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm">
                            <ShoppingBagIcon sx={{ fontSize: "16px" }} />
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default Product;