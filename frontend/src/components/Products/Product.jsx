import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility'; // View Details ke liye icon
import { Link } from 'react-router-dom';
import { getDiscount } from '../../utils/functions';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '../../actions/wishlistAction';
import { useSnackbar } from 'notistack';

const Product = ({ _id, name, images, ratings, numOfReviews, price, cuttedPrice, stock, view }) => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const { wishlistItems } = useSelector((state) => state.wishlist);
    const itemInWishlist = wishlistItems.some((i) => i.product === _id);

    const shortName = name.length > 50 ? name.substring(0, 50) + "..." : name;

    const addToWishlistHandler = (e) => {
        e.preventDefault();
        if (itemInWishlist) {
            dispatch(removeFromWishlist(_id));
            enqueueSnackbar("Removed from Wishlist", { variant: "info" });
        } else {
            dispatch(addToWishlist(_id));
            enqueueSnackbar("Added to Wishlist", { variant: "success" });
        }
    };

    // --- LIST VIEW (Fixed with Button and Wishlist Icon) ---
    if (view === 'list') {
        return (
            <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white hover:shadow-md border-b border-gray-100 transition-shadow relative group">
                {/* Image Section */}
                <Link to={`/product/${_id}`} className="w-full sm:w-32 h-32 flex-shrink-0">
                    <img src={images[0].url} alt={name} className="w-full h-full object-contain" />
                </Link>

                {/* Content Section */}
                <div className="flex flex-col flex-grow gap-1">
                    <div className="flex justify-between items-start">
                        <Link to={`/product/${_id}`}>
                            <h2 className="text-sm font-medium text-gray-800 hover:text-primary-blue transition-colors">{shortName}</h2>
                        </Link>
                        {/* Wishlist Icon for List View */}
                        <button onClick={addToWishlistHandler} className="p-1 hover:bg-red-500 rounded-full transition-colors">
                            <FavoriteIcon sx={{ fontSize: "20px", color: itemInWishlist ? "#ef4444" : "#d1d5db" }} />
                        </button>
                    </div>

                    <span className={`text-[10px] font-bold uppercase ${stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {stock > 0 ? 'IN STOCK' : 'OUT OF STOCK'}
                    </span>

                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900">₹{price.toLocaleString()}</span>
                        {cuttedPrice > price && (
                            <span className="text-gray-400 line-through text-xs font-normal">₹{cuttedPrice.toLocaleString()}</span>
                        )}
                    </div>

                    {/* View Details Button Section */}
                    <div className="mt-2">
                        <Link 
                            to={`/product/${_id}`} 
                            className="inline-flex items-center gap-2 px-4 py-1.5 bg-black text-white text-xs font-medium rounded shadow-sm hover:bg-black-500 transition-colors uppercase tracking-wider"
                        >
                            <VisibilityIcon sx={{ fontSize: "14px" }} />
                            View Details
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // --- GRID VIEW (Same as before) ---
    return (
        <div className="group relative bg-white flex flex-col border border-gray-100 p-3 hover:shadow-xl transition-shadow duration-300 rounded-sm">
            
            <button 
                onClick={addToWishlistHandler} 
                className="absolute top-3 right-3 z-6 p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-red-500 transition-colors "
            >
                <FavoriteIcon sx={{ fontSize: "18px", color: itemInWishlist ? "#ef4444" : "#d1d5db" }} />
            </button>

            <Link to={`/product/${_id}`} className="flex flex-col h-full">
                <div className="w-full h-48 bg-[#f9f9f9] rounded-sm flex items-center justify-center p-4 mb-4 overflow-hidden">
                    <img 
                        src={images[0].url} 
                        alt={name} 
                        className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105" 
                    />
                </div>

                <div className="flex flex-col gap-1.5 px-1">
                    <span className={`text-[10px] font-bold tracking-wide ${stock > 0 ? 'text-teal-600' : 'text-red-500'}`}>
                        {stock > 0 ? 'IN STOCK' : 'OUT OF STOCK'}
                    </span>

                    <h2 className="text-[14px] font-medium text-gray-700 leading-snug h-10 hover:text-[#2874f0] overflow-hidden line-clamp-2">
                        {shortName}
                    </h2>

                    <div className="flex items-center gap-1">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <StarIcon key={i} sx={{ fontSize: 14, color: i < Math.floor(ratings) ? "#FFD700" : "#E0E0E0" }} />
                            ))}
                        </div>
                        <span className="text-gray-400 text-[11px]">({numOfReviews})</span>
                    </div>

                    <div className="mt-2 flex flex-col">
                        <span className="text-xl font-bold text-orange-600">₹{price.toLocaleString()}</span>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-400 line-through text-xs">₹{cuttedPrice.toLocaleString()}</span>
                            <span className="text-teal-600 text-[11px] font-bold">Save {getDiscount(price, cuttedPrice)}%</span>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default Product;