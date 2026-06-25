import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Products lene ke liye
import SearchIcon from '@mui/icons-material/Search';
import CallMadeIcon from '@mui/icons-material/CallMade';

const SearchBar = () => {
    const [keyword, setKeyword] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);

    const navigate = useNavigate();
    const searchRef = useRef(null);

    // 1. Redux se saare products nikaalein
    const { products } = useSelector((state) => state.products);

    // 2. Jab keyword change ho, tab check karein ke product list mein hai ya nahi
    useEffect(() => {
        if (keyword.trim().length > 0 && products) {
            // Sirf wahi products filter karein jo database mein hain
            const matches = products
                .filter(p => p.name.toLowerCase().includes(keyword.toLowerCase()))
                .map(p => p.name) // Sirf naam nikaalein
                .slice(0, 10); // Top 10 results dikhane ke liye

            setFilteredSuggestions(matches);
        } else {
            setFilteredSuggestions([]);
        }
    }, [keyword, products]);

    const submitHandler = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/products/${keyword}`);
            setShowSuggestions(false);
        }
    };

    // Outside click handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative w-full max-w-[600px] mx-auto" ref={ searchRef }>
            <form
                className="flex items-center w-full bg-white rounded-sm overflow-hidden shadow-sm"
                onSubmit={ submitHandler }
            >
                <input
                    type="text"
                    className="flex-1 px-4 py-2 text-[14px] outline-none text-gray-700"
                    placeholder="Search for products, brands and more"
                    onChange={ (e) => setKeyword(e.target.value) }
                    onFocus={ () => setShowSuggestions(true) }
                    value={ keyword }
                />
                <button type="submit" className="bg-[#ffe11b] p-2 px-4">
                    <SearchIcon className="text-[#2874f0]" />
                </button>
            </form>

            {/* --- Dynamic Suggestions List --- */ }
            { showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 z-50">
                    { filteredSuggestions.map((item, index) => (
                        <div
                            key={ index }
                            onClick={ () => {
                                setKeyword(item);
                                navigate(`/products/${item}`);
                                setShowSuggestions(false);
                            } }
                            className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 cursor-pointer border-b border-gray-50"
                        >
                            {/* --- Suggestions List mein truncation --- */ }
                            <span className="text-[14px] text-gray-800">
                                { item.length > 30 ? `${item.substring(0, 30)}...` : item }
                            </span>
                            <CallMadeIcon sx={ { fontSize: '16px', color: '#bdc3c7' } } />
                        </div>
                    )) }
                </div>
            ) }
        </div>
    );
};

export default SearchBar;