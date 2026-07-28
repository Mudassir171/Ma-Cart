import React, { useEffect, useState } from 'react';
import Dashboard from './Dashboard';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import ReviewsIcon from '@mui/icons-material/Reviews';
import StarIcon from '@mui/icons-material/Star';
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const { enqueueSnackbar } = useSnackbar();

    // Seller ke products ke reviews fetch karna
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                // Apna backend reviews API endpoint yahan dein
                const { data } = await axios.get('/api/v1/seller/reviews', { withCredentials: true });
                setReviews(data.reviews || []);
                setLoading(false);
            } catch (error) {
                enqueueSnackbar(error.response?.data?.message || "Failed to fetch reviews", { variant: "error" });
                setLoading(false);
            }
        };
        fetchReviews();
    }, [enqueueSnackbar]);

    // Review delete karne ka function (agar zaroorat ho)
    const deleteReviewHandler = async (reviewId, productId) => {
        try {
            const { data } = await axios.delete(`/api/v1/seller/review?id=${reviewId}&productId=${productId}`, { withCredentials: true });
            enqueueSnackbar(data.message || "Review deleted successfully", { variant: "success" });
            setReviews(reviews.filter(rev => rev._id !== reviewId));
        } catch (error) {
            enqueueSnackbar(error.response?.data?.message || "Failed to delete review", { variant: "error" });
        }
    };

    return (
        <Dashboard activeTab={5}>
            <div className="flex flex-col gap-6 animate-fadeIn pb-10 bg-gray-50 p-2 sm:p-4 rounded-3xl">
                
                {/* Header Banner - Green-800 & White Theme */}
                <div className="relative overflow-hidden bg-green-800 p-6 sm:p-8 rounded-3xl shadow-xl text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-green-700">
                    <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-green-700/40 rounded-full blur-2xl pointer-events-none"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 bg-green-900/60 w-fit px-3 py-1 rounded-full text-green-200 text-xs font-semibold mb-2 border border-green-600/50">
                            <ReviewsIcon fontSize="small" /> Customer Feedback
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">Product Reviews</h1>
                        <p className="text-green-100 text-xs sm:text-sm mt-1 max-w-md">
                            Manage and monitor what your customers are saying about your products.
                        </p>
                    </div>

                    <div className="relative z-10 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 flex items-center gap-4 shadow-inner">
                        <div>
                            <p className="text-xs text-green-200 font-medium">Total Reviews</p>
                            <p className="text-2xl font-black text-white">{reviews.length}</p>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-gray-200">
                        <div className="w-10 h-10 border-4 border-green-800 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-500 text-sm font-medium mt-4">Loading reviews...</p>
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-200 flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center text-2xl mb-3 shadow-inner">
                            <StarIcon fontSize="large" />
                        </div>
                        <h3 className="text-base font-bold text-gray-800">No Reviews Found</h3>
                        <p className="text-gray-400 text-xs mt-1">Aapke products par abhi tak koi review nahi mila hai.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {reviews.map((rev) => (
                            <div key={rev._id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 flex flex-col justify-between gap-4 relative overflow-hidden group hover:border-green-800 transition-all">
                                
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gray-800 text-white flex items-center justify-center font-bold">
                                            <PersonIcon />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900">{rev.name}</h4>
                                            <span className="text-[10px] text-gray-400">Verified Buyer</span>
                                        </div>
                                    </div>
                                    {/* Rating Badge (Yellow Theme) */}
                                    <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200 text-yellow-700 font-bold text-xs">
                                        <StarIcon fontSize="small" className="text-yellow-500" />
                                        <span>{rev.rating}</span>
                                    </div>
                                </div>

                                <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-2xl border border-gray-100 font-medium">
                                    "{rev.comment}"
                                </p>

                                <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-400">
                                    <span>Product ID: {rev.product}</span>
                                    <button 
                                        onClick={() => deleteReviewHandler(rev._id, rev.product)}
                                        className="flex items-center gap-1 text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl font-bold transition-colors border border-red-200"
                                    >
                                        <DeleteIcon fontSize="small" /> Delete
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>
                )}

            </div>
        </Dashboard>
    );
};

export default Reviews;