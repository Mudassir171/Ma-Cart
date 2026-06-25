import { getDiscount } from '../../../utils/functions';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
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

    const addToWishlistHandler = (e) => {
        e.preventDefault();
        if (itemInWishlist) {
            dispatch(removeFromWishlist(_id));
            enqueueSnackbar("Removed from Wishlist", { variant: "success" });
        } else {
            dispatch(addToWishlist(_id));
            enqueueSnackbar("Added to Wishlist", { variant: "success" });
        }
    }

    return (
        <div className="group bg-white flex flex-col w-full h-full border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 rounded-sm overflow-hidden">
            
            <Link to={`/product/${_id}`} className="flex flex-col h-full">
                
                {/* 1. Image Area */}
                <div className="w-full aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
                    <img
                        draggable="false"
                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                        src={images[0].url}
                        alt={name}
                    />
                </div>

                {/* 2. Status & Wishlist Bar (New Row instead of Absolute) */}
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
                    
                    <button 
                        onClick={addToWishlistHandler}
                        className={`transition-colors duration-200 ${itemInWishlist ? "text-red-500" : "text-gray-400 hover:text-red-400"}`}
                    >
                        <FavoriteIcon sx={{ fontSize: "18px" }} />
                    </button>
                </div>

                {/* 3. Product Info */}
                <div className="p-3 flex flex-col flex-grow bg-white">
                    {/* Title */}
                    <h2 className="text-[13px] leading-snug text-gray-800 font-normal group-hover:text-green-400 transition-colors line-clamp-2 h-9 mb-2">
                        {name.length > 40 ? `${name.substring(0, 40)}...` : name}
                    </h2>

                    {/* Ratings */}
                    <div className="flex items-center gap-1 mb-2">
                        <div className="flex items-center text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                                <StarIcon key={i} sx={{ fontSize: "12px" }} className={i < Math.round(ratings) ? "text-yellow-400" : "text-gray-200"} />
                            ))}
                        </div>
                        <span className="text-[10px] text-gray-400">({numOfReviews.toLocaleString()})</span>
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