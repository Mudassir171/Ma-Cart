import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getCategories } from '../../actions/categoryAction';
import { Link } from 'react-router-dom';
import MetaData from '../Layouts/MetaData';

const Categories = () => {
    const dispatch = useDispatch();
    const { categories, loading } = useSelector((state) => state.allCategories);

    useEffect(() => {
        dispatch(getCategories());
    }, [dispatch]);

    // Responsive items limit: 21 items (3 lines of 7 items on desktop, 7 lines of 3 items on mobile)
    const displayCategories = categories ? categories.slice(0, 21) : [];

    return (
        <>
            <MetaData title="Shop By Categories - Premium Store" />
            
            <section className="bg-gradient-to-b from-white to-gray-50/50 my-4 w-full shadow-md rounded-xl overflow-hidden border border-emerald-100/60 p-4 md:p-6">
                
                {/* --- Header Section --- */}
                <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-100">
                    <div className="flex items-center gap-2.5">
                        <div className="h-6 w-1.5 bg-emerald-600 rounded-full"></div>
                        <h2 className="text-lg md:text-xl font-extrabold text-emerald-900 tracking-tight">
                            Explore Categories
                        </h2>
                    </div>

                    <Link 
                        to="/products" 
                        className="group relative inline-flex items-center gap-2 px-5 py-2 text-xs md:text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all duration-300 shadow-sm"
                    >
                        <span>Shop All</span>
                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>

                {/* --- Full Width Categories Grid (Mobile: 3 cols, Desktop: 7 cols) --- */}
                <div className="grid grid-cols-3 md:grid-cols-7 gap-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                    {loading ? (
                        // Skeleton Loading State
                        [...Array(14)].map((_, i) => (
                            <div key={i} className="bg-white p-3 rounded-xl flex flex-col items-center gap-3 animate-pulse shadow-sm">
                                <div className="h-12 w-12 sm:h-14 sm:w-14 bg-gray-200 rounded-full"></div>
                                <div className="h-3 w-10 bg-gray-200 rounded"></div>
                            </div>
                        ))
                    ) : (
                        displayCategories.map((item) => (
                            <Link
                                key={item._id}
                                to={`/products?category=${item.name}`}
                                className="group bg-white flex flex-col items-center justify-between p-3 rounded-xl hover:shadow-md hover:-translate-y-1 transition-all duration-300 border border-gray-100 hover:border-emerald-200 relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-emerald-50/0 group-hover:bg-emerald-50/30 transition-colors duration-300"></div>

                                {/* Circle Image Container */}
                                <div className="relative z-10 h-12 w-12 sm:h-14 sm:w-14 mb-2 p-2 bg-gray-50 group-hover:bg-white rounded-full flex items-center justify-center shadow-inner overflow-hidden group-hover:scale-105 transition-all duration-300 border border-gray-100">
                                    {item.image && (
                                        <img
                                            draggable="false"
                                            className="max-h-full max-w-full object-contain filter group-hover:brightness-105 transition-all duration-300"
                                            src={item.image.url}
                                            alt={item.name}
                                        />
                                    )}
                                </div>
                                
                                {/* Category Name */}
                                <span className="relative z-10 text-[10px] sm:text-[11px] text-gray-700 font-semibold text-center leading-tight group-hover:text-emerald-700 transition-colors line-clamp-1">
                                    {item.name}
                                </span>
                            </Link>
                        ))
                    )}
                </div>

            </section>
        </>
    );
};

export default Categories;