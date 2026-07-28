import TextField from '@mui/material/TextField';
import { useState, useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuItem from '@mui/material/MenuItem';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { useNavigate, useParams } from 'react-router-dom';
import { REMOVE_PRODUCT_DETAILS, UPDATE_PRODUCT_RESET } from '../../constants/productConstants';
import { clearErrors, getProductDetails, updateProduct } from '../../actions/productAction';
import ImageIcon from '@mui/icons-material/Image';
import BackdropLoader from '../Layouts/BackdropLoader';
import { categories } from '../../utils/constants';
import MetaData from '../Layouts/MetaData';

const UpdateProduct = () => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const params = useParams();

    const { loading, product, error } = useSelector((state) => state.productDetails);
    const { loading: updateLoading, isUpdated, error: updateError } = useSelector((state) => state.product);
    const { user } = useSelector((state) => state.user);

    const [highlights, setHighlights] = useState([]);
    const [highlightInput, setHighlightInput] = useState("");
    
    // --- 🎨 COLORS STATE ---
    const [colors, setColors] = useState([]);
    const [colorInput, setColorInput] = useState("");

    // --- 📏 SIZES STATE ---
    const [sizes, setSizes] = useState([]);
    const [sizeInput, setSizeInput] = useState("");

    const [specs, setSpecs] = useState([]);
    const [specsInput, setSpecsInput] = useState({ title: "", description: "" });

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [cuttedPrice, setCuttedPrice] = useState(0);
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState(0);
    const [warranty, setWarranty] = useState(0);
    const [brand, setBrand] = useState("");
    const [images, setImages] = useState([]);
    const [oldImages, setOldImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);

    const [logo, setLogo] = useState("");
    const [logoPreview, setLogoPreview] = useState("");

    // Dropdown options for colors and sizes
    const availableColors = ["Red", "Blue", "Green", "Black", "White", "Yellow", "Pink", "Purple", "Orange", "Grey"];
    const availableSizes = ["S", "M", "L", "XL", "XXL", "Free Size", "28", "30", "32", "34", "36", "38", "40", "42"];

    const handleSpecsChange = (e) => {
        setSpecsInput({ ...specsInput, [e.target.name]: e.target.value });
    }

    const addSpecs = () => {
        if (!specsInput.title.trim() || !specsInput.description.trim()) return;
        setSpecs([...specs, specsInput]);
        setSpecsInput({ title: "", description: "" });
    }

    const addHighlight = () => {
        if (!highlightInput.trim()) return;
        setHighlights([...highlights, highlightInput]);
        setHighlightInput("");
    }

    // --- 🎨 ADD / DELETE COLOR ---
    const addColor = () => {
        if (!colorInput.trim() || colors.includes(colorInput)) return;
        setColors([...colors, colorInput]);
        setColorInput("");
    }
    const deleteColor = (index) => {
        setColors(colors.filter((c, i) => i !== index));
    }

    // --- 📏 ADD / DELETE SIZE ---
    const addSize = () => {
        if (!sizeInput.trim() || sizes.includes(sizeInput)) return;
        setSizes([...sizes, sizeInput]);
        setSizeInput("");
    }
    const deleteSize = (index) => {
        setSizes(sizes.filter((s, i) => i !== index));
    }

    const deleteHighlight = (index) => {
        setHighlights(highlights.filter((h, i) => i !== index))
    }

    const deleteSpec = (index) => {
        setSpecs(specs.filter((s, i) => i !== index))
    }

    const handleLogoChange = (e) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setLogoPreview(reader.result);
                setLogo(reader.result);
            }
        };
        reader.readAsDataURL(e.target.files[0]);
    }

    const handleProductImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages([]);
        setImagesPreview([]);
        setOldImages([]);

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview((oldData) => [...oldData, reader.result]);
                    setImages((oldData) => [...oldData, reader.result]);
                }
            }
            reader.readAsDataURL(file);
        });
    }

    const newProductSubmitHandler = (e) => {
        e.preventDefault();
        if (highlights.length <= 0) {
            enqueueSnackbar("Add Highlights", { variant: "warning" });
            return;
        }
        if (specs.length <= 1) {
            enqueueSnackbar("Add Minimum 2 Specifications", { variant: "warning" });
            return;
        }

        const formData = new FormData();
        formData.set("name", name);
        formData.set("description", description);
        formData.set("price", price);
        formData.set("cuttedPrice", cuttedPrice);
        formData.set("category", category);
        formData.set("stock", stock);
        formData.set("warranty", warranty);
        formData.set("brandname", brand);
        if (logo) formData.set("logo", logo);

        images.forEach((image) => formData.append("images", image));
        highlights.forEach((h) => formData.append("highlights", h));
        specs.forEach((s) => formData.append("specifications", JSON.stringify(s)));
        
        // --- 🎨📏 APPEND COLORS & SIZES ---
        colors.forEach((c) => formData.append("colors", c));
        sizes.forEach((s) => formData.append("sizes", s));

        dispatch(updateProduct(params.id, formData));
    }

    useEffect(() => {
        if (product && product._id !== params.id) {
            dispatch(getProductDetails(params.id));
        } else if (product) {
            setName(product.name || "");
            setDescription(product.description || "");
            setPrice(product.price || 0);
            setCuttedPrice(product.cuttedPrice || 0);
            setCategory(product.category || "");
            setStock(product.stock || 0);
            setWarranty(product.warranty || 0);
            setBrand(product.brand?.name || "");
            setHighlights(product.highlights || []);
            setSpecs(product.specifications || []);
            setColors(product.colors || []);   
            setSizes(product.sizes || []);     
            setOldImages(product.images || []);
            setLogoPreview(product.brand?.logo?.url || "");
        }

        if (error) {
            enqueueSnackbar(error, { variant: "error" });
            dispatch(clearErrors());
        }
        if (updateError) {
            enqueueSnackbar(updateError, { variant: "error" });
            dispatch(clearErrors());
        }
        if (isUpdated) {
            enqueueSnackbar("Product Updated Successfully", { variant: "success" });
            dispatch({ type: UPDATE_PRODUCT_RESET });
            dispatch({ type: REMOVE_PRODUCT_DETAILS });
            
            if(user.role === "seller") {
                navigate('/seller/products');
            } else {
                navigate('/admin/products');
            }
        }
    }, [dispatch, error, updateError, isUpdated, params.id, product, navigate, enqueueSnackbar, user.role]);

    return (
        <div className="min-h-screen bg-gray-50 p-2 sm:p-6">
            <MetaData title="Update Product | MA-CART" />

            {loading && <BackdropLoader />}
            {updateLoading && <BackdropLoader />}
            
            {product && (
                <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white">
                        <h1 className="text-xl sm:text-2xl font-black tracking-wide uppercase">Update Product</h1>
                        <p className="text-xs sm:text-sm text-gray-400 mt-1">Modify product information, specifications, and media assets seamlessly.</p>
                    </div>

                    <form onSubmit={newProductSubmitHandler} encType="multipart/form-data" className="flex flex-col lg:flex-row gap-6 p-4 sm:p-8" id="mainform">
                        
                        {/* LEFT COLUMN */}
                        <div className="flex flex-col gap-5 flex-1">
                            <h2 className="font-bold text-gray-800 uppercase text-xs tracking-wider border-b pb-2">General Information</h2>
                            
                            <TextField label="Name" variant="outlined" size="small" required value={name} onChange={(e) => setName(e.target.value)} fullWidth />
                            
                            <TextField label="Description" multiline rows={3} required variant="outlined" size="small" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth />
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <TextField label="Price" type="number" variant="outlined" size="small" required value={price} onChange={(e) => setPrice(e.target.value)} fullWidth />
                                <TextField label="Cutted Price" type="number" variant="outlined" size="small" required value={cuttedPrice} onChange={(e) => setCuttedPrice(e.target.value)} fullWidth />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <TextField label="Category" select fullWidth variant="outlined" size="small" required value={category} onChange={(e) => setCategory(e.target.value)}>
                                    {categories.map((el, i) => (
                                        <MenuItem value={el} key={i}>{el}</MenuItem>
                                    ))}
                                </TextField>
                                <TextField label="Stock" type="number" variant="outlined" size="small" required value={stock} onChange={(e) => setStock(e.target.value)} fullWidth />
                                <TextField label="Warranty" type="number" variant="outlined" size="small" required value={warranty} onChange={(e) => setWarranty(e.target.value)} fullWidth />
                            </div>

                            {/* COLORS */}
                            <div className="flex flex-col gap-2.5 bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <label className="font-bold text-gray-700 text-xs uppercase tracking-wider">Product Colors</label>
                                <div className="flex gap-2 items-center">
                                    <TextField
                                        label="Select or Add Color"
                                        select
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        value={colorInput}
                                        onChange={(e) => setColorInput(e.target.value)}
                                    >
                                        {availableColors.map((col, index) => (
                                            <MenuItem value={col} key={index}>{col}</MenuItem>
                                        ))}
                                    </TextField>
                                    <button type="button" onClick={addColor} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs uppercase h-10 shadow transition-all shrink-0">Add</button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {colors.map((c, i) => (
                                        <div key={i} className="flex items-center py-1.5 px-3 bg-purple-100 rounded-full border border-purple-200 gap-2 shadow-sm">
                                            <span className="text-purple-900 text-xs font-bold">{c}</span>
                                            <span onClick={() => deleteColor(i)} className="text-red-600 hover:text-red-800 cursor-pointer flex items-center"><DeleteIcon style={{ fontSize: '15px' }} /></span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* SIZES */}
                            <div className="flex flex-col gap-2.5 bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <label className="font-bold text-gray-700 text-xs uppercase tracking-wider">Product Sizes</label>
                                <div className="flex gap-2 items-center">
                                    <TextField
                                        label="Select or Add Size"
                                        select
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        value={sizeInput}
                                        onChange={(e) => setSizeInput(e.target.value)}
                                    >
                                        {availableSizes.map((sz, index) => (
                                            <MenuItem value={sz} key={index}>{sz}</MenuItem>
                                        ))}
                                    </TextField>
                                    <button type="button" onClick={addSize} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs uppercase h-10 shadow transition-all shrink-0">Add</button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {sizes.map((s, i) => (
                                        <div key={i} className="flex items-center py-1.5 px-3 bg-indigo-100 rounded-full border border-indigo-200 gap-2 shadow-sm">
                                            <span className="text-indigo-900 text-xs font-bold">{s}</span>
                                            <span onClick={() => deleteSize(i)} className="text-red-600 hover:text-red-800 cursor-pointer flex items-center"><DeleteIcon style={{ fontSize: '15px' }} /></span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* HIGHLIGHTS */}
                            <div className="flex flex-col gap-2.5 bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <label className="font-bold text-gray-700 text-xs uppercase tracking-wider">Highlights</label>
                                <div className="flex items-center bg-white border rounded-lg overflow-hidden shadow-sm">
                                    <input value={highlightInput} onChange={(e) => setHighlightInput(e.target.value)} type="text" placeholder="Enter product highlight..." className="px-3 flex-1 outline-none border-none py-2 text-sm" />
                                    <button type="button" onClick={addHighlight} className="py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase transition-all">Add</button>
                                </div>
                                <div className="flex flex-col gap-1.5 mt-1 max-h-36 overflow-y-auto">
                                    {highlights.map((h, i) => (
                                        <div key={i} className="flex justify-between rounded-lg items-center py-1.5 px-3 bg-green-50 border border-green-200">
                                            <p className="text-green-900 text-xs font-semibold">{h}</p>
                                            <span onClick={() => deleteHighlight(i)} className="text-red-600 hover:text-red-800 cursor-pointer">
                                                <DeleteIcon fontSize="small" />
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* BRAND DETAILS */}
                            <h2 className="font-bold text-gray-800 uppercase text-xs tracking-wider border-b pb-2 pt-2">Brand Details</h2>
                            <div className="flex flex-col sm:flex-row gap-4 items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <TextField label="Brand Name" type="text" variant="outlined" size="small" required value={brand} onChange={(e) => setBrand(e.target.value)} fullWidth />
                                <div className="flex items-center gap-3 w-full sm:w-auto justify-between">
                                    <div className="w-16 h-12 flex items-center justify-center border rounded-lg bg-white shadow-sm overflow-hidden p-1">
                                        {!logoPreview ? <ImageIcon className="text-gray-300" /> : <img src={logoPreview} alt="Brand Logo" className="w-full h-full object-contain" />}
                                    </div>
                                    <label className="rounded-lg font-bold bg-gray-700 hover:bg-black text-center cursor-pointer text-white py-2.5 px-4 text-xs uppercase shadow transition-all tracking-wider shrink-0">
                                        <input type="file" name="logo" accept="image/*" onChange={handleLogoChange} className="hidden" />
                                        Upload Logo
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="flex flex-col gap-5 flex-1">
                            <h2 className="font-bold text-gray-800 uppercase text-xs tracking-wider border-b pb-2">Specifications</h2>
                            <div className="flex flex-col sm:flex-row gap-2 items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <TextField value={specsInput.title} onChange={handleSpecsChange} name="title" label="Title" variant="outlined" size="small" fullWidth />
                                <TextField value={specsInput.description} onChange={handleSpecsChange} name="description" label="Value" variant="outlined" size="small" fullWidth />
                                <button type="button" onClick={addSpecs} className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs uppercase shadow transition-all w-full sm:w-auto shrink-0">Add</button>
                            </div>
                            <div className="flex flex-col gap-2 max-h-52 overflow-y-auto pr-1">
                                {specs.map((spec, i) => (
                                    <div key={i} className="flex justify-between items-center text-xs rounded-lg bg-blue-50 border border-blue-100 py-2.5 px-4 shadow-sm">
                                        <p className="text-blue-900 font-bold w-1/3">{spec.title}</p>
                                        <p className="text-gray-600 w-1/2">{spec.description}</p>
                                        <span onClick={() => deleteSpec(i)} className="text-red-600 hover:text-red-800 cursor-pointer">
                                            <DeleteIcon fontSize="small" />
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <h2 className="font-bold text-gray-800 uppercase text-xs tracking-wider border-b pb-2 pt-2">Product Images</h2>
                            <div className="flex gap-3 overflow-x-auto h-36 border-2 border-dashed border-gray-300 rounded-2xl p-3 bg-gray-50 items-center">
                                {oldImages && oldImages.map((image, i) => (
                                    <img key={i} src={image.url} alt="Product" className="h-full object-contain border rounded-xl bg-white shadow-md p-1 shrink-0" />
                                ))}
                                {imagesPreview.map((image, i) => (
                                    <img key={i} src={image} alt="Product Preview" className="h-full object-contain border rounded-xl bg-white shadow-md p-1 shrink-0" />
                                ))}
                                {oldImages.length === 0 && imagesPreview.length === 0 && (
                                    <p className="text-gray-400 text-xs w-full text-center">No images uploaded yet</p>
                                )}
                            </div>
                            <label className="rounded-xl font-bold bg-gray-800 hover:bg-black text-center cursor-pointer text-white p-3.5 shadow-md uppercase text-xs tracking-widest transition-all">
                                <input type="file" name="images" accept="image/*" multiple onChange={handleProductImageChange} className="hidden" />
                                Update Product Images
                            </label>

                            <div className="mt-auto pt-4">
                                <button type="submit" form="mainform" className="w-full bg-gradient-to-r from-[#f85606] to-[#d14905] uppercase py-4 text-white font-black rounded-2xl shadow-xl hover:shadow-orange-200 transition-all tracking-widest text-sm">
                                    Update Product
                                </button>
                            </div>
                        </div>

                    </form>
                </div>
            )}
        </div>
    );
};

export default UpdateProduct;