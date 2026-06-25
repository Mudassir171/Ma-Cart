import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

// Material UI Components
import { 
    FormControl, FormControlLabel, Pagination, Radio, 
    RadioGroup, Slider 
} from '@mui/material';

// Icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import StarIcon from '@mui/icons-material/Star';
import ViewListIcon from '@mui/icons-material/ViewList';
import FilterListIcon from '@mui/icons-material/FilterList';
import GridViewIcon from '@mui/icons-material/GridView';

// Actions & Custom Components
import { clearErrors, getProducts } from '../../actions/productAction';
import { getCategories } from '../../actions/categoryAction';
import Loader from '../Layouts/Loader';
import MinCategory from '../Layouts/MinCategory';
import Product from './Product';
import MetaData from '../Layouts/MetaData';

const Products = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const params = useParams();
    const location = useLocation();

    // --- States ---
    const [price, setPrice] = useState([0, 10000000]);
    const [category, setCategory] = useState(location.search ? location.search.split("=")[1] : "");
    const [ratings, setRatings] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [view, setView] = useState('grid');
    const [cols, setCols] = useState(4); // Default 4 columns
    const [sort, setSort] = useState("best-match");
    const [type, setType] = useState("");
    const [availableTypes, setAvailableTypes] = useState([]);
    
    // Toggle States
    const [categoryToggle, setCategoryToggle] = useState(true);
    const [typeToggle, setTypeToggle] = useState(true);
    const [ratingsToggle, setRatingsToggle] = useState(true);

    const { products, loading, error, resultPerPage, filteredProductsCount } = useSelector((state) => state.products);
    const { categories } = useSelector((state) => state.allCategories);
    const keyword = params.keyword;

    // 1. Initial Load: Categories
    useEffect(() => {
        dispatch(getCategories());
    }, [dispatch]);

    // 2. Sync Sub-types when category changes
    useEffect(() => {
        if (category && categories) {
            const selectedCat = categories.find(cat => cat.name === category);
            if (selectedCat && selectedCat.types) {
                setAvailableTypes(selectedCat.types);
            } else {
                setAvailableTypes([]);
            }
            setType(""); 
        }
    }, [category, categories]);

    // 3. Main Data Fetching
    useEffect(() => {
        if (error) {
            enqueueSnackbar(error, { variant: "error" });
            dispatch(clearErrors());
        }
        dispatch(getProducts(keyword || "", category, price, ratings, currentPage, type));
    }, [dispatch, keyword, category, price, ratings, currentPage, type, error, enqueueSnackbar]);

    // --- Reset All Logic ---
    const clearFilters = () => {
        setPrice([0, 10000000]);
        setCategory("");
        setType("");
        setRatings(0);
        setCurrentPage(1);
        navigate("/products"); 
    };

    return (
        <>
            <MetaData title="All Products | Store" />
            <MinCategory />
            
            <main className="w-full bg-[#f1f3f6] min-h-screen pb-10">
                
                {/* --- MOBILE CATEGORY SCROLL --- */}
                <div className="lg:hidden bg-white border-b sticky top-[52px] z-30 overflow-x-auto no-scrollbar shadow-sm">
                    <div className="flex items-center gap-2 px-4 py-3 whitespace-nowrap">
                        <button 
                            onClick={clearFilters} 
                            className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${!category && !keyword ? 'bg-[#2874f0] text-white border-[#2874f0]' : 'bg-gray-100 text-gray-600'}`}
                        >
                            All Products
                        </button>
                        {categories?.map((cat) => (
                            <button 
                                key={cat._id} 
                                onClick={() => setCategory(cat.name)} 
                                className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${category === cat.name ? 'bg-[#2874f0] text-white border-[#2874f0]' : 'bg-gray-100 text-gray-600'}`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex gap-3 px-0 sm:px-4 max-w-[1500px] mx-auto pt-2 lg:pt-4">
                    
                    {/* --- SIDEBAR (Desktop) --- */}
                    <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 gap-3">
                        <div className="bg-white rounded-sm shadow-sm border border-gray-200  top-20 z-7">
                            <div className="flex items-center justify-between p-4 border-b">
                                <p className="font-bold text-gray-800 text-sm uppercase">Filters</p>
                                <button onClick={clearFilters} className="text-[#2874f0] text-[11px] font-bold uppercase hover:underline transition-colors">Clear All</button>
                            </div>

                            {/* Price */}
                            <div className="p-4 border-b">
                                <p className="text-[11px] font-bold uppercase text-gray-500 mb-6">Price Range</p>
                                <Slider 
                                    value={price} 
                                    onChange={(e, val) => setPrice(val)} 
                                    valueLabelDisplay="auto"
                                    min={0} max={10000000} size="small" 
                                    sx={{ color: '#2874f0' }} 
                                />
                                <div className="flex justify-between mt-2">
                                    <span className="text-[10px] font-bold border px-2 py-1 bg-gray-50 text-gray-600">₹{price[0].toLocaleString()}</span>
                                    <span className="text-[10px] font-bold border px-2 py-1 bg-gray-50 text-gray-600">₹{price[1].toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Category */}
                            <div className="border-b">
                                <div className="flex justify-between p-4 cursor-pointer hover:bg-gray-50" onClick={() => setCategoryToggle(!categoryToggle)}>
                                    <p className="text-[11px] font-bold uppercase text-gray-500">Category</p>
                                    {categoryToggle ? <ExpandLessIcon fontSize="small"/> : <ExpandMoreIcon fontSize="small"/>}
                                </div>
                                {categoryToggle && (
                                    <div className="px-2 pb-3 max-h-60 overflow-y-auto custom-scrollbar">
                                        <RadioGroup value={category} onChange={(e) => setCategory(e.target.value)}>
                                            {categories?.map((el) => (
                                                <FormControlLabel key={el._id} value={el.name} control={<Radio size="small" />} label={<span className="text-sm capitalize">{el.name}</span>} />
                                            ))}
                                        </RadioGroup>
                                    </div>
                                )}
                            </div>

                            {/* Ratings */}
                            <div className="p-4">
                                <div className="flex justify-between cursor-pointer mb-2" onClick={() => setRatingsToggle(!ratingsToggle)}>
                                    <p className="text-[11px] font-bold uppercase text-gray-500">Ratings</p>
                                    {ratingsToggle ? <ExpandLessIcon fontSize="small"/> : <ExpandMoreIcon fontSize="small"/>}
                                </div>
                                {ratingsToggle && (
                                    <RadioGroup value={ratings} onChange={(e) => setRatings(e.target.value)}>
                                        {[4, 3, 2, 1].map((rate) => (
                                            <FormControlLabel key={rate} value={rate} control={<Radio size="small" />} label={<span className="flex items-center text-sm">{rate} <StarIcon sx={{fontSize: 14, ml: 0.5, color: '#ff9f00'}}/> & above</span>} />
                                        ))}
                                    </RadioGroup>
                                )}
                            </div>
                        </div>
                    </aside>

                    {/* --- MAIN PRODUCTS AREA --- */}
                    <div className="flex-1 min-w-0">
                        <div className="bg-white shadow-sm border-b sm:border border-gray-200 sm:rounded-sm mb-2">
                            <div className="flex flex-col md:flex-row justify-between md:items-center p-3 gap-3">
                                <div>
                                    <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">
                                        {keyword ? `Results for "${keyword}"` : (category || 'All Products')}
                                    </p>
                                    <p className="text-sm font-black text-gray-900">
                                        {filteredProductsCount} <span className="text-xs font-normal text-gray-400">Products</span>
                                    </p>
                                </div>

                                <div className="flex items-center justify-between md:justify-end gap-2 sm:gap-4">
                                    {/* GRID SWITCHER 1-6 */}
                                    <div className="hidden md:flex border rounded overflow-hidden shadow-sm bg-gray-50">
                                        {[ 3, 4, 5].map((n) => (
                                            <button 
                                                key={n} 
                                                onClick={() => {setCols(n); setView('grid')}} 
                                                className={`px-3 py-1.5 text-[11px] font-black border-r last:border-0 transition-all ${cols === n && view === 'grid' ? 'bg-[#2874f0] text-white shadow-inner' : 'text-gray-400 hover:bg-white hover:text-[#2874f0]'}`}
                                            >
                                                {n}
                                            </button>
                                        ))}
                                        <button 
                                            onClick={() => setView('list')} 
                                            className={`px-3 py-1.5 flex items-center ${view === 'list' ? 'bg-[#2874f0] text-white' : 'text-gray-400 hover:bg-white hover:text-[#2874f0]'}`}
                                            title="List View"
                                        >
                                            <ViewListIcon sx={{fontSize: 18}}/>
                                        </button>
                                    </div>

                                    {/* Sort Dropdown */}
                                    <select 
                                        value={sort} 
                                        onChange={(e) => setSort(e.target.value)} 
                                        className="text-[11px] font-bold border rounded-sm p-2 outline-none bg-white cursor-pointer hover:border-[#2874f0] transition-colors shadow-sm"
                                    >
                                        <option value="best-match">BEST MATCH</option>
                                        <option value="low">PRICE: LOW TO HIGH</option>
                                        <option value="high">PRICE: HIGH TO LOW</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* PRODUCT LISTING GRID */}
                        {loading ? <Loader /> : (
                            <div 
                                className={`w-full ${view === 'list' ? 'flex flex-col bg-white border divide-y' : 'grid gap-[2px] sm:gap-3'}`}
                                style={view === 'grid' ? { 
                                    display: 'grid',
                                    gridTemplateColumns: `repeat(${window.innerWidth < 640 ? 2 : cols}, minmax(0, 1fr))` 
                                } : {}}
                            >
                                {products?.map((p) => (
                                    <Product {...p} key={p._id} view={view} />
                                ))}
                            </div>
                        )}

                        {/* EMPTY STATE */}
                        {!loading && products?.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-24 bg-white border rounded-sm shadow-sm mx-2 sm:mx-0">
                                <div className="bg-blue-50 p-6 rounded-full mb-4">
                                    <FilterListIcon sx={{ fontSize: 60, color: '#2874f0', opacity: 0.5 }} />
                                </div>
                                <p className="text-gray-800 font-bold text-lg">No products found!</p>
                                <p className="text-gray-500 text-sm mt-1">Try adjusting your filters or search terms.</p>
                                <button 
                                    onClick={clearFilters} 
                                    className="bg-[#2874f0] text-white font-bold text-sm px-10 py-3 rounded-sm mt-8 shadow-lg hover:shadow-xl transition-all uppercase tracking-wider"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        )}

                        {/* PAGINATION */}
                        {filteredProductsCount > resultPerPage && (
                            <div className="flex justify-center py-16">
                                <Pagination 
                                    count={Math.ceil(filteredProductsCount / resultPerPage)} 
                                    page={currentPage} 
                                    onChange={(e, v) => setCurrentPage(v)} 
                                    color="primary" 
                                    shape="rounded" 
                                    size={window.innerWidth < 640 ? "small" : "medium"}
                                    variant="outlined"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
};

export default Products;