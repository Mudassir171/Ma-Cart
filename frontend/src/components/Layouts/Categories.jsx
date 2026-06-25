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

    return (
        <>
            <MetaData title="Shop By Categories" />
            
            <section className="bg-white mt-2 mb-6 w-full shadow-sm rounded-sm overflow-hidden border border-gray-100">
                
                {/* --- Header Section --- */}
                <div className="flex justify-between items-center px-4 py-3 border-b border-gray-50">
                    <h2 className="text-lg font-bold text-green-800 uppercase tracking-tight">
                        Categories
                    </h2>
                    {/* View All ki jagah Shop All Button */}
                    <Link to="/products" className="text-green-800 border border-green-800 px-5 py-2 text-sm font-semibold hover:bg-green-800 hover:text-white transition-all uppercase rounded-sm">
                        Shop All Categories
                    </Link>
                </div>

                {/* --- Grid Layout (Slider Removed) --- */}
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-px bg-gray-100">
                    { loading ? (
                        // Skeleton Loading
                        [...Array(16)].map((_, i) => (
                            <div key={i} className="bg-white p-4 flex flex-col items-center gap-2 animate-pulse">
                                <div className="h-12 w-12 sm:h-16 sm:w-16 bg-gray-100 rounded-full"></div>
                                <div className="h-3 w-12 bg-gray-100 rounded"></div>
                            </div>
                        ))
                    ) : (
                        // 16 Categories Display
                        categories && categories.slice(0, 16).map((item) => (
                            <Link
                                key={item._id}
                                to={`/products?category=${item.name}`}
                                className="group bg-white flex flex-col items-center justify-center p-3 sm:p-5 hover:shadow-inner transition-all duration-200 border-r border-b border-gray-50 last:border-r-0 capitalize"
                            >
                                {/* Circle Image Container */}
                                <div className="h-16 w-16 sm:h-20 sm:w-20 mb-2 p-2 bg-gray-50 rounded-full flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform duration-300">
                                    {item.image && (
                                        <img
                                            draggable="false"
                                            className="max-h-full max-w-full object-contain"
                                            src={item.image.url}
                                            alt={item.name}
                                        />
                                    )}
                                </div>
                                
                                {/* Category Name */}
                                <span className="text-[11px] sm:text-[12px] text-gray-700 font-medium text-center leading-tight group-hover:text-green-400 transition-colors">
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