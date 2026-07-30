import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getCategories } from '../../actions/categoryAction';
import { Link } from 'react-router-dom';
import MetaData from '../Layouts/MetaData';

const Categories = () => {
    const dispatch = useDispatch();
    const { categories, loading } = useSelector((state) => state.allCategories);
    
    // State to track active row index (0 to 4 for 5 rows)
    const [activeRowIndex, setActiveRowIndex] = useState(0);

    useEffect(() => {
        dispatch(getCategories());
    }, [dispatch]);

    // Row-specific Banners mapped dynamically (Row 1 to Row 5)
    const rowBanners = [
        {
            id: 1,
            row: 0,
            title: "Fresh & Crisp Produce",
            subtitle: "Row 1 Specials • Up to 40% Off",
            link: "/products?category=fresh-fruits",
            image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=600&auto=format&fit=crop",
            buttonText: "Shop Fresh"
        },
        {
            id: 2,
            row: 1,
            title: "Daily Dairy & Breakfast",
            subtitle: "Row 2 Essentials • Farm Fresh",
            link: "/products?category=dairy",
            image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=600&auto=format&fit=crop",
            buttonText: "Explore Dairy"
        },
        {
            id: 3,
            row: 2,
            title: "Pantry & Staple Foods",
            subtitle: "Row 3 Savings • Stock Up Now",
            link: "/products?category=pantry",
            image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=600&auto=format&fit=crop",
            buttonText: "Shop Pantry"
        },
        {
            id: 4,
            row: 3,
            title: "Household & Personal Care",
            subtitle: "Row 4 Essentials • Best Brands",
            link: "/products?category=household",
            image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600&auto=format&fit=crop",
            buttonText: "View Care"
        },
        {
            id: 5,
            row: 4,
            title: "Specialty & Organic Items",
            subtitle: "Row 5 Collection • Healthy Living",
            link: "/products?category=organic",
            image: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=600&auto=format&fit=crop",
            buttonText: "Discover More"
        }
    ];

    // Current active banner based on the active row
    const currentBanner = rowBanners[activeRowIndex] || rowBanners[0];

    return (
        <>
            <MetaData title="Shop By Categories - Premium Store" />
            
            <section className="bg-gradient-to-b from-white to-gray-50/50 my-4 w-full shadow-md rounded-xl overflow-hidden border border-emerald-100/60 p-4 md:p-6">
                
                {/* --- Header Section --- */}
                <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-100">
                    <div className="flex items-center gap-2.5">
                        <div className="h-6 w-1.5 bg-emerald-600 rounded-full"></div>
                        <h2 className="text-lg md:text-xl font-extrabold text-emerald-900 tracking-tight">
                            Explore Categories & Row Offers
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

                {/* --- Main Split Layout: Dynamic Banner Left | 5x5 Grid Right --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    
                    {/* Left Side: Dynamic Banner Changing per Row (Col Span 4) */}
                    <div className="lg:col-span-4 h-full flex flex-col justify-center">
                        <Link 
                            to={currentBanner.link}
                            className="group relative h-[340px] md:h-[380px] rounded-xl overflow-hidden shadow-md border border-emerald-100 flex flex-col justify-end p-6 transition-all duration-500"
                        >
                            <img 
                                src={currentBanner.image} 
                                alt={currentBanner.title}
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>
                            
                            <div className="relative z-10 text-white">
                                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300 bg-emerald-950/70 px-3 py-1 rounded-md backdrop-blur-md">
                                    {currentBanner.subtitle}
                                </span>
                                <h3 className="text-xl md:text-2xl font-extrabold mt-2 leading-snug">
                                    {currentBanner.title}
                                </h3>
                                <span className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-white bg-emerald-600 px-4 py-2 rounded-lg group-hover:bg-emerald-500 transition-colors shadow-sm">
                                    {currentBanner.buttonText} &rarr;
                                </span>
                            </div>
                        </Link>

                        {/* Row Navigation Dots/Indicators */}
                        <div className="flex justify-center items-center gap-2 mt-3">
                            {rowBanners.map((b, idx) => (
                                <button
                                    key={b.id}
                                    onClick={() => setActiveRowIndex(idx)}
                                    className={`h-2 rounded-full transition-all duration-300 ${activeRowIndex === idx ? 'w-6 bg-emerald-600' : 'w-2 bg-gray-300 hover:bg-gray-400'}`}
                                    aria-label={`Switch to row ${idx + 1} banner`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Right Side: 5x5 Grid for Categories (Col Span 8) */}
                    <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                        {loading ? (
                            // Skeleton Loading State (25 items for 5 rows x 5 columns)
                            [...Array(25)].map((_, i) => (
                                <div key={i} className="bg-white p-3 rounded-xl flex flex-col items-center gap-3 animate-pulse shadow-sm">
                                    <div className="h-14 w-14 sm:h-16 sm:w-16 bg-gray-200 rounded-full"></div>
                                    <div className="h-3 w-12 bg-gray-200 rounded"></div>
                                </div>
                            ))
                        ) : (
                            // Displaying up to 25 Categories mapped with row tracker on hover/interaction
                            categories && categories.slice(0, 25).map((item, index) => {
                                // Determine which row this item belongs to (5 items per row)
                                const rowIndex = Math.floor(index / 5);

                                return (
                                    <Link
                                        key={item._id}
                                        to={`/products?category=${item.name}`}
                                        onMouseEnter={() => setActiveRowIndex(rowIndex)} // Changes banner dynamically on hover
                                        className="group bg-white flex flex-col items-center justify-between p-3 rounded-xl hover:shadow-md hover:-translate-y-1 transition-all duration-300 border border-gray-100 hover:border-emerald-200 relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-emerald-50/0 group-hover:bg-emerald-50/30 transition-colors duration-300"></div>

                                        {/* Circle Image Container */}
                                        <div className="relative z-10 h-14 w-14 sm:h-16 sm:w-16 mb-2 p-2 bg-gray-50 group-hover:bg-white rounded-full flex items-center justify-center shadow-inner overflow-hidden group-hover:scale-105 transition-all duration-300 border border-gray-100">
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
                                        <span className="relative z-10 text-[11px] sm:text-[12px] text-gray-700 font-semibold text-center leading-tight group-hover:text-emerald-700 transition-colors line-clamp-1">
                                            {item.name}
                                        </span>
                                    </Link>
                                );
                            })
                        )}
                    </div>

                </div>
            </section>
        </>
    );
};

export default Categories;