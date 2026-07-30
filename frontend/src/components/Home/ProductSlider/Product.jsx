import { getDiscount } from '../../../utils/functions';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ShareIcon from '@mui/icons-material/Share';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '../../../actions/wishlistAction';
import { addItemsToCart } from '../../../actions/cartAction';
import { useSnackbar } from 'notistack';

const Product = (props) => {
    const { _id, name, images, ratings, numOfReviews, price, cuttedPrice, stock } = props;
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const { wishlistItems } = useSelector((state) => state.wishlist);
    const itemInWishlist = wishlistItems.some((i) => i.product === _id);

    // Wishlist Handler
    const addToWishlistHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (itemInWishlist) {
            dispatch(removeFromWishlist(_id));
            enqueueSnackbar("Removed from Wishlist", { variant: "success" });
        } else {
            dispatch(addToWishlist(_id));
            enqueueSnackbar("Added to Wishlist", { variant: "success" });
        }
    };

    // Add to Cart Handler
    const addToCartHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (stock <= 0) {
            enqueueSnackbar("Product is Out of Stock", { variant: "error" });
            return;
        }
        dispatch(addItemsToCart(_id, 1));
        enqueueSnackbar("Added To Cart Successfully", { variant: "success" });
    };

    // Share Handler
    const shareHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const productUrl = `${window.location.origin}/product/${_id}`;
        if (navigator.share) {
            navigator.share({
                title: name,
                url: productUrl,
            }).catch(() => {});
        } else {
            navigator.clipboard.writeText(productUrl);
            enqueueSnackbar("Product link copied to clipboard!", { variant: "success" });
        }
    };

    return (
        <div className="group bg-white flex flex-col w-full h-full border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 rounded-sm overflow-hidden relative">
            
            <Link to={`/product/${_id}`} className="flex flex-col h-full">
                
                {/* 1. Image Area with Hover Action Buttons on Top-Left */}
                <div className="w-full aspect-square bg-gray-50 flex items-center justify-center overflow-hidden relative">
                    <img
                        draggable="false"
                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                        src={images && images[0] ? images[0].url : ''}
                        alt={name}
                    />

                    {/* Top-Left Hover Action Buttons (Wishlist, Cart, Share) */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                        
                        {/* Wishlist Button */}
                        <button 
                            onClick={addToWishlistHandler}
                            className={`w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center transition-transform hover:scale-110 ${itemInWishlist ? "text-red-500" : "text-gray-600 hover:text-red-500"}`}
                            title="Wishlist"
                        >
                            <FavoriteIcon sx={{ fontSize: "16px" }} />
                        </button>

                        {/* Cart Button */}
                        <button 
                            onClick={addToCartHandler}
                            className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-emerald-600 transition-transform hover:scale-110"
                            title="Add to Cart"
                        >
                            <ShoppingCartIcon sx={{ fontSize: "16px" }} />
                        </button>

                        {/* Share Button */}
                        <button 
                            onClick={shareHandler}
                            className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-blue-500 transition-transform hover:scale-110"
                            title="Share"
                        >
                            <ShareIcon sx={{ fontSize: "16px" }} />
                        </button>

                    </div>
                </div>

                {/* 2. Status Bar */}
                <div className="flex justify-between items-center px-3 py-2 bg-gray-50/50 border-b border-gray-100">
                    <div className="flex-1">
                        {stock <= 3 && stock > 0 ? (
                            <span className="text-[10px] text-[#f85606] font-bold uppercase italic">
                                Only {stock} Left
                            </span>
                        ) : stock === 0 ? (
                            <span className="text-[10px] text-red-600 font-bold uppercase">
                                Out of Stock
                            </span>
                        ) : (
                            <span className="text-[10px] text-green-600 font-bold uppercase">
                                In Stock
                            </span>
                        )}
                    </div>
                </div>

                {/* 3. Product Info */}
                <div className="p-3 flex flex-col flex-grow bg-white">
                    {/* Title */}
                    <h2 className="text-[13px] leading-snug text-gray-800 font-normal group-hover:text-green-600 transition-colors line-clamp-2 h-9 mb-2">
                        {name.length > 40 ? `${name.substring(0, 40)}...` : name}
                    </h2>

                    {/* Ratings */}
                    <div className="flex items-center gap-1 mb-2">
                        <div className="flex items-center text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                                <StarIcon key={i} sx={{ fontSize: "12px" }} className={i < Math.round(ratings) ? "text-yellow-400" : "text-gray-200"} />
                            ))}
                        </div>
                        <span className="text-[10px] text-gray-400">({numOfReviews ? numOfReviews.toLocaleString() : 0})</span>
                    </div>

                    {/* Price Section */}
                    <div className="mt-auto">
                        <div className="flex items-baseline gap-1.5 flex-wrap">
                            <span className="text-green-800 text-lg font-bold">Rs:{price.toLocaleString()}</span>
                            {cuttedPrice > price && (
                                <span className="text-gray-400 line-through text-[11px]">Rs:{cuttedPrice.toLocaleString()}</span>
                            )}
                        </div>
                        {cuttedPrice > price && (
                            <p className="text-[11px] font-semibold text-green-600">
                                Save {getDiscount(price, cuttedPrice)}%
                            </p>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default Product;