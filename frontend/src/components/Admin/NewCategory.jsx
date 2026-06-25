import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import MetaData from '../Layouts/MetaData';
import { useNavigate } from 'react-router-dom';

// MUI Icons
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import CollectionsIcon from '@mui/icons-material/Collections'; 
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'; 

// Actions
import { createCategory } from '../../actions/categoryAction';

const NewCategory = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    // Redux State
    const { loading, success, error } = useSelector((state) => state.newCategory);

    // Form States
    const [title, setTitle] = useState("");
    const [typeInput, setTypeInput] = useState(""); 
    const [types, setTypes] = useState([]);         
    const [image, setImage] = useState("");
    const [imagePreview, setImagePreview] = useState("");

    // --- Logic: Add Sub-category Type ---
    const addTypeToList = (e) => {
        if (e) e.preventDefault(); 
        const trimmedInput = typeInput.trim();

        if (trimmedInput === "") {
            enqueueSnackbar("Type cannot be empty", { variant: "error" });
            return;
        }
        if (types.includes(trimmedInput)) {
            enqueueSnackbar("This type is already added", { variant: "warning" });
            return;
        }

        setTypes([...types, trimmedInput]);
        setTypeInput(""); 
    };

    // --- Logic: Remove Sub-category Type ---
    const removeTypeFromList = (indexToRemove) => {
        setTypes(types.filter((_, index) => index !== indexToRemove));
    };

    // --- Logic: Image Handling ---
    const handleImageChange = (e) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setImagePreview(reader.result);
                setImage(reader.result);
            }
        };
        reader.readAsDataURL(e.target.files[0]);
    };

    // --- Logic: Final Form Submit ---
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!image) {
            enqueueSnackbar("Please upload an image", { variant: "warning" });
            return;
        }
        if (types.length === 0) {
            enqueueSnackbar("Add at least one sub-type", { variant: "warning" });
            return;
        }

        const formData = new FormData();
        formData.append("name", title);
        types.forEach((t) => formData.append("types", t));
        formData.append("image", image);
        
        dispatch(createCategory(formData));
    };

    // --- Logic: Handle Success/Error & Dispatch Notification ---
    useEffect(() => {
        if (error) {
            enqueueSnackbar(error, { variant: "error" });
            dispatch({ type: "CLEAR_ERRORS" });
        }
        if (success) {
            // 🚀 Send Notification to Redux Store & LocalStorage
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    id: Date.now(),
                    title: "New Category Live! 📁",
                    message: `System mein "${title}" category add kar di gayi hai.`,
                    type: "offer", 
                    createdAt: new Date().toLocaleString(),
                    isRead: false
                }
            });

            enqueueSnackbar("Category Created Successfully!", { variant: "success" });
            dispatch({ type: "NEW_CATEGORY_RESET" });
            navigate("/admin/categories");
        }
    }, [dispatch, error, success, navigate, enqueueSnackbar, title]);

    return (
        <>
            <MetaData title="Admin: New Category | MA-CART" />
            
            <div className="flex flex-col items-center p-6 sm:p-10 bg-white rounded-3xl shadow-2xl max-w-lg mx-auto mt-12 border border-gray-100 mb-10 transition-all hover:shadow-blue-100">
                
                {/* Heading */}
                <div className="flex items-center gap-3 mb-10 text-gray-800">
                    <AddBoxIcon sx={{ fontSize: 40 }} className="text-blue-600" />
                    <h2 className="text-3xl font-black tracking-tight">New Category</h2>
                </div>

                <form onSubmit={handleSubmit} className="w-full space-y-8">
                    
                    {/* Image Upload Section */}
                    <div className="flex flex-col items-center">
                        <div className="relative group w-40 h-40 rounded-3xl overflow-hidden border-4 border-dashed border-blue-100 bg-blue-50/50 flex items-center justify-center transition-all hover:border-blue-400">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <CollectionsIcon sx={{ fontSize: 50 }} className="text-blue-200" />
                            )}
                            <label htmlFor="categoryImage" className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                                <PhotoCameraIcon className="text-white mb-1" />
                                <span className="text-white text-xs font-bold uppercase tracking-widest">Upload Image</span>
                            </label>
                        </div>
                        <input id="categoryImage" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </div>

                    {/* Category Name */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-black uppercase text-gray-500 ml-1">Category Title</label>
                        <input
                            type="text"
                            placeholder="Fashion, Electronics etc."
                            className="p-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all shadow-sm"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    {/* Sub-types Section */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-black uppercase text-gray-500 ml-1">Sub-Categories (Types)</label>
                        <div className="flex bg-gray-50 border border-transparent rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-400 transition-all shadow-sm">
                            <input
                                type="text"
                                placeholder="Add type (e.g. Shoes)..."
                                className="flex-1 p-4 bg-transparent outline-none"
                                value={typeInput}
                                onChange={(e) => setTypeInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addTypeToList(e)}
                            />
                            <button type="button" onClick={addTypeToList} className="bg-blue-600 text-white px-8 font-black uppercase text-xs hover:bg-blue-700 transition">
                                Add
                            </button>
                        </div>

                        {/* Types List Display */}
                        <div className="mt-4 grid gap-2 max-h-40 overflow-y-auto pr-2">
                            {types.length === 0 && (
                                <div className="text-center py-4 border border-dashed rounded-2xl text-gray-400 text-sm italic">
                                    No sub-types added yet
                                </div>
                            )}
                            {types.map((t, index) => (
                                <div key={index} className="flex justify-between items-center bg-green-50 px-4 py-3 rounded-xl border border-green-100 group">
                                    <span className="text-green-800 font-bold text-sm tracking-wide">{t}</span>
                                    <button type="button" onClick={() => removeTypeFromList(index)} className="text-red-300 hover:text-red-600 transition-colors">
                                        <DeleteIcon fontSize="small" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Save Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 rounded-2xl font-black text-white shadow-xl transition-all duration-300 uppercase tracking-widest ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#f85606] hover:bg-[#d14905] hover:scale-[1.02] active:scale-[0.98]'}`}
                    >
                        {loading ? "Saving to Cloud..." : "Save Category"}
                    </button>
                </form>
            </div>
        </>
    );
};

export default NewCategory;