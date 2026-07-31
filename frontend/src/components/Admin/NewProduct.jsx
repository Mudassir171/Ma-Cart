import TextField from '@mui/material/TextField';
import { useState, useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuItem from '@mui/material/MenuItem';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { NEW_PRODUCT_RESET } from '../../constants/productConstants';
import { createProduct, clearErrors } from '../../actions/productAction';
import { getCategories } from '../../actions/categoryAction';
import ImageIcon from '@mui/icons-material/Image';
import MetaData from '../Layouts/MetaData';
import BackdropLoader from '../Layouts/BackdropLoader';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const NewProduct = () => {

    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const { loading, success, error } = useSelector((state) => state.newProduct);
    const { categories } = useSelector((state) => state.allCategories);

    const [highlights, setHighlights] = useState([]);
    const [highlightInput, setHighlightInput] = useState("");
    const [specs, setSpecs] = useState([]);
    const [specsInput, setSpecsInput] = useState({
        title: "",
        description: ""
    });

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [cuttedPrice, setCuttedPrice] = useState(0);
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState(0);
    const [warranty, setWarranty] = useState(0);
    const [brand, setBrand] = useState("");
    const [discount, setDiscount] = useState(0);

    const [isFlashSale, setIsFlashSale] = useState(false);
    const [dealExpiry, setDealExpiry] = useState("");

    // --- Color Family States ---
    const [colorName, setColorName] = useState("");
    const [colorImage, setColorImage] = useState("");
    const [colorImagePreview, setColorImagePreview] = useState("");
    const [colors, setColors] = useState([]);

    // --- Size States (Added) ---
    const [sizeInput, setSizeInput] = useState("");
    const [sizes, setSizes] = useState([]);

    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);

    const [logo, setLogo] = useState("");
    const [logoPreview, setLogoPreview] = useState("");

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

    const deleteHighlight = (index) => {
        setHighlights(highlights.filter((h, i) => i !== index))
    }

    const deleteSpec = (index) => {
        setSpecs(specs.filter((s, i) => i !== index))
    }

    // --- Size Handlers (Added) ---
    const addSize = () => {
        if (!sizeInput.trim()) return;
        if (sizes.includes(sizeInput.trim())) {
            enqueueSnackbar("Size already added", { variant: "warning" });
            return;
        }
        setSizes([...sizes, sizeInput.trim()]);
        setSizeInput("");
    };

    const deleteSize = (index) => {
        setSizes(sizes.filter((s, i) => i !== index));
    };

    // --- Color Image Handler ---
    const handleColorImageChange = (e) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setColorImagePreview(reader.result);
                setColorImage(reader.result);
            }
        };
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const addColorSwatch = () => {
        if (!colorName.trim() || !colorImage) {
            enqueueSnackbar("Enter Color Name and Select Color Image", { variant: "warning" });
            return;
        }
        setColors([...colors, { name: colorName, image: colorImage }]);
        setColorName("");
        setColorImage("");
        setColorImagePreview("");
    };

    const deleteColor = (index) => {
        setColors(colors.filter((c, i) => i !== index));
    };

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

        if (files.length > 5) {
            enqueueSnackbar("Maximum 5 images allowed", { variant: "error" });
            return;
        }

        if (files.length === 0) {
            enqueueSnackbar("Please select at least 1 image", { variant: "error" });
            return;
        }

        setImages([]);
        setImagesPreview([]);

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview((oldImages) => [...oldImages, reader.result]);
                    setImages((oldImages) => [...oldImages, reader.result]);
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
        if (!logo) {
            enqueueSnackbar("Add Brand Logo", { variant: "warning" });
            return;
        }
        if (specs.length <= 1) {
            enqueueSnackbar("Add Minimum 2 Specifications", { variant: "warning" });
            return;
        }
        if (images.length < 1 || images.length > 5) {
            enqueueSnackbar("Upload between 1 to 5 images", { variant: "warning" });
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
        formData.set("logo", logo);
        formData.set("discount", discount);
        formData.set("isFlashSale", isFlashSale);
        formData.set("dealExpiry", dealExpiry);

        images.forEach((image) => { formData.append("images", image); });
        highlights.forEach((h) => { formData.append("highlights", h); });
        specs.forEach((s) => { formData.append("specifications", JSON.stringify(s)); });
        colors.forEach((c) => { formData.append("colors", JSON.stringify(c)); });
        sizes.forEach((s) => { formData.append("sizes", s); }); // Added sizes to formData

        dispatch(createProduct(formData));
    }

    useEffect(() => {
        dispatch(getCategories());
        if (error) {
            enqueueSnackbar(error, { variant: "error" });
            dispatch(clearErrors());
        }
        if (success) {
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    id: Date.now(),
                    title: "New Product Launched! 🛍️",
                    message: `Mubarak ho! Aik naya product "${name}" brand ${brand} ke saath live kar diya gaya hai.`,
                    type: "order",
                    createdAt: new Date().toLocaleString(),
                    isRead: false
                }
            });

            enqueueSnackbar("Product Created", { variant: "success" });
            dispatch({ type: NEW_PRODUCT_RESET });
            navigate("/admin/products");
        }
    }, [dispatch, error, success, navigate, enqueueSnackbar, name, brand]);

    return (
        <>
            <MetaData title="Admin: New Product | MA-CART" />
            {loading && <BackdropLoader />}
            <form onSubmit={newProductSubmitHandler} encType="multipart/form-data" className="flex flex-col sm:flex-row bg-white rounded-lg shadow p-4" id="mainform">
                <div className="flex flex-col gap-3 m-2 sm:w-1/2">
                    <TextField label="Name" variant="outlined" size="small" required value={name} onChange={(e) => setName(e.target.value)} />
                    <TextField label="Description" multiline rows={3} required variant="outlined" size="small" value={description} onChange={(e) => setDescription(e.target.value)} />
                    
                    <div className="flex justify-between gap-4">
                        <TextField label="Price" type="number" variant="outlined" size="small" required value={price} onChange={(e) => setPrice(e.target.value)} />
                        <TextField label="Cutted Price" type="number" variant="outlined" size="small" required value={cuttedPrice} onChange={(e) => setCuttedPrice(e.target.value)} />
                    </div>

                    <div className="flex justify-between gap-4">
                        <TextField label="Discount % (e.g. 25)" type="number" variant="outlined" size="small" value={discount} onChange={(e) => setDiscount(e.target.value)} />
                        <TextField 
                            label="Flash Sale Expiry" 
                            type="datetime-local" 
                            variant="outlined" 
                            size="small" 
                            InputLabelProps={{ shrink: true }}
                            value={dealExpiry} 
                            onChange={(e) => setDealExpiry(e.target.value)} 
                        />
                    </div>

                    <div className="px-2 py-1 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <FormControlLabel
                            control={
                                <Checkbox 
                                    checked={isFlashSale} 
                                    onChange={(e) => setIsFlashSale(e.target.checked)} 
                                    color="success"
                                />
                            }
                            label={<span className="text-xs font-bold text-emerald-900">Add this product to Flash Sale section</span>}
                        />
                    </div>

                    {/* --- Size Variants Section (Added) --- */}
                    <div className="border border-gray-200 p-3 rounded-lg bg-gray-50/50">
                        <h2 className="font-bold text-gray-700 uppercase text-xs mb-2 tracking-widest">Size Variants (e.g. S, M, L, XL)</h2>
                        <div className="flex gap-2 items-center mb-2">
                            <TextField 
                                value={sizeInput} 
                                onChange={(e) => setSizeInput(e.target.value)} 
                                label="Size Name" 
                                variant="outlined" 
                                size="small" 
                                className="flex-1 bg-white"
                            />
                            <span onClick={addSize} className="py-2 px-4 bg-blue-600 text-white rounded cursor-pointer font-bold text-sm shadow">Add Size</span>
                        </div>
                        {sizes.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                {sizes.map((sz, i) => (
                                    <div key={i} className="flex items-center gap-1 bg-white border border-blue-400 px-2 py-1 rounded shadow-sm text-xs font-bold text-blue-800">
                                        <span>{sz}</span>
                                        <span onClick={() => deleteSize(i)} className="text-red-600 cursor-pointer hover:text-red-800">
                                            <DeleteIcon style={{ fontSize: '14px' }} />
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* --- Color Family Preview & Input Section --- */}
                    <div className="border border-gray-200 p-3 rounded-lg bg-gray-50/50">
                        <h2 className="font-bold text-gray-700 uppercase text-xs mb-2 tracking-widest">Color Family Swatches</h2>
                        
                        <div className="flex gap-2 items-center mb-3">
                            <TextField 
                                value={colorName} 
                                onChange={(e) => setColorName(e.target.value)} 
                                label="Color Name (e.g. Black)" 
                                variant="outlined" 
                                size="small" 
                                className="flex-1 bg-white"
                            />
                            <div className="w-12 h-10 flex items-center justify-center border rounded overflow-hidden bg-white shadow-sm">
                                {!colorImagePreview ? <ImageIcon className="text-gray-300 text-sm" /> : <img src={colorImagePreview} alt="Color" className="w-full h-full object-cover" />}
                            </div>
                            <label className="rounded bg-gray-700 text-white py-2 px-3 text-xs font-bold uppercase cursor-pointer shadow hover:bg-black transition-all">
                                <input type="file" accept="image/*" onChange={handleColorImageChange} className="hidden" />
                                Image
                            </label>
                            <span onClick={addColorSwatch} className="py-2 px-4 bg-blue-600 text-white rounded cursor-pointer font-bold text-sm shadow">Add</span>
                        </div>

                        {colors.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-gray-200">
                                <span className="text-xs font-semibold text-gray-500 block mb-1">Added Colors Preview:</span>
                                <div className="flex flex-wrap gap-2">
                                    {colors.map((c, i) => (
                                        <div key={i} className="relative group p-1 bg-white border-2 border-orange-500 rounded-md shadow-sm flex flex-col items-center w-14">
                                            <img src={c.image} alt={c.name} className="w-10 h-10 object-cover rounded" />
                                            <span className="text-[10px] font-bold text-gray-700 truncate w-full text-center mt-0.5">{c.name}</span>
                                            <span onClick={() => deleteColor(i)} className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full p-0.5 cursor-pointer shadow hover:bg-red-700">
                                                <DeleteIcon style={{ fontSize: '12px' }} />
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between gap-4 mt-1">
                        <TextField
                            label="Category"
                            select
                            fullWidth
                            variant="outlined"
                            size="small"
                            required
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            {categories && categories.map((el) => (
                                <MenuItem value={el.name} key={el._id}>
                                    {el.name}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField label="Stock" type="number" variant="outlined" size="small" required value={stock} onChange={(e) => setStock(e.target.value)} />
                        <TextField label="Warranty" type="number" variant="outlined" size="small" required value={warranty} onChange={(e) => setWarranty(e.target.value)} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center border rounded">
                            <input value={highlightInput} onChange={(e) => setHighlightInput(e.target.value)} type="text" placeholder="Highlight" className="px-2 flex-1 outline-none border-none" />
                            <span onClick={addHighlight} className="py-2 px-6 bg-blue-600 text-white rounded-r cursor-pointer font-bold">Add</span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            {highlights.map((h, i) => (
                                <div key={i} className="flex justify-between rounded items-center py-1 px-2 bg-green-50">
                                    <p className="text-green-800 text-sm font-medium">{h}</p>
                                    <span onClick={() => deleteHighlight(i)} className="text-red-600 cursor-pointer"><DeleteIcon /></span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <h2 className="font-bold text-gray-700 uppercase text-xs mt-2 tracking-widest">Brand Details</h2>
                    <div className="flex justify-between gap-4 items-start">
                        <TextField label="Brand" variant="outlined" size="small" required value={brand} onChange={(e) => setBrand(e.target.value)} />
                        <div className="w-24 h-10 flex items-center justify-center border rounded-lg overflow-hidden bg-gray-50">
                            {!logoPreview ? <ImageIcon className="text-gray-300" /> : <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" />}
                        </div>
                        <label className="rounded bg-gray-700 text-white py-2 px-3 text-xs font-bold uppercase cursor-pointer shadow hover:bg-black transition-all">
                            <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                            Logo
                        </label>
                    </div>
                </div>

                <div className="flex flex-col gap-2 m-2 sm:w-1/2">
                    <h2 className="font-bold text-gray-700 uppercase text-xs tracking-widest">Specifications</h2>
                    <div className="flex justify-evenly gap-2 items-center">
                        <TextField value={specsInput.title} onChange={handleSpecsChange} name="title" label="Name" variant="outlined" size="small" />
                        <TextField value={specsInput.description} onChange={handleSpecsChange} name="description" label="Value" variant="outlined" size="small" />
                        <span onClick={addSpecs} className="py-2 px-6 bg-blue-600 text-white rounded cursor-pointer font-bold">Add</span>
                    </div>
                    <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto">
                        {specs.map((spec, i) => (
                            <div key={i} className="flex justify-between items-center text-sm rounded bg-blue-50 py-1.5 px-3">
                                <p className="text-blue-800 font-bold">{spec.title}</p>
                                <p className="text-gray-600">{spec.description}</p>
                                <span onClick={() => deleteSpec(i)} className="text-red-600 cursor-pointer"><DeleteIcon fontSize="small" /></span>
                            </div>
                        ))}
                    </div>

                    <h2 className="font-bold text-gray-700 uppercase text-xs mt-4 tracking-widest">Product Gallery (1-5)</h2>
                    <div className="flex gap-2 overflow-x-auto h-32 border rounded-xl p-2 bg-gray-50">
                        {imagesPreview.length > 0 ? imagesPreview.map((image, i) => (
                            <img src={image} alt="Product" key={i} className="w-24 h-full object-contain border rounded-lg bg-white shadow-sm" />
                        )) : (
                            <p className="text-gray-400 text-xs m-auto italic">No images selected yet</p>
                        )}
                    </div>
                    <label className="rounded font-bold bg-gray-700 text-center cursor-pointer text-white p-3 my-2 shadow uppercase text-xs tracking-widest hover:bg-black transition-all">
                        <input type="file" accept="image/*" multiple onChange={handleProductImageChange} className="hidden" />
                        Select Gallery Images
                    </label>

                    <div className="flex justify-end mt-4">
                        <input type="submit" className="bg-[#f85606] uppercase w-full p-4 text-white font-black rounded-xl shadow-lg cursor-pointer hover:bg-[#d14905] transition-all tracking-widest" value="Launch Product" />
                    </div>
                </div>
            </form>
        </>
    );
};

export default NewProduct;