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
            setColors(product.colors || []);   // Load existing colors
            setSizes(product.sizes || []);     // Load existing sizes
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
        <>
            <MetaData title="Update Product | MA-CART" />

            {loading && <BackdropLoader />}
            {updateLoading && <BackdropLoader />}
            
            {product && (
                <form onSubmit={newProductSubmitHandler} encType="multipart/form-data" className="flex flex-col sm:flex-row bg-white rounded-lg shadow p-4" id="mainform">
                    <div className="flex flex-col gap-3 m-2 sm:w-1/2">
                        <TextField label="Name" variant="outlined" size="small" required value={name} onChange={(e) => setName(e.target.value)} />
                        <TextField label="Description" multiline rows={3} required variant="outlined" size="small" value={description} onChange={(e) => setDescription(e.target.value)} />
                        <div className="flex justify-between gap-2">
                            <TextField label="Price" type="number" variant="outlined" size="small" required value={price} onChange={(e) => setPrice(e.target.value)} />
                            <TextField label="Cutted Price" type="number" variant="outlined" size="small" required value={cuttedPrice} onChange={(e) => setCuttedPrice(e.target.value)} />
                        </div>
                        <div className="flex justify-between gap-4">
                            <TextField label="Category" select fullWidth variant="outlined" size="small" required value={category} onChange={(e) => setCategory(e.target.value)}>
                                {categories.map((el, i) => (
                                    <MenuItem value={el} key={i}>{el}</MenuItem>
                                ))}
                            </TextField>
                            <TextField label="Stock" type="number" variant="outlined" size="small" required value={stock} onChange={(e) => setStock(e.target.value)} />
                            <TextField label="Warranty" type="number" variant="outlined" size="small" required value={warranty} onChange={(e) => setWarranty(e.target.value)} />
                        </div>

                        {/* --- 🎨 COLOR SELECTION WITH ARROW --- */}
                        <div className="flex flex-col gap-2">
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
                                        <MenuItem value={col} key={index}>
                                            {col}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <span onClick={addColor} className="py-2 px-6 bg-blue-600 text-white rounded cursor-pointer font-bold text-xs uppercase h-10 flex items-center shadow">Add</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {colors.map((c, i) => (
                                    <div key={i} className="flex justify-between items-center py-1 px-3 bg-purple-50 rounded-full border border-purple-200 gap-2">
                                        <p className="text-purple-800 text-xs font-semibold">{c}</p>
                                        <span onClick={() => deleteColor(i)} className="text-red-600 cursor-pointer flex items-center"><DeleteIcon fontSize="small" style={{ fontSize: '16px' }} /></span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* --- 📏 SIZE SELECTION WITH ARROW --- */}
                        <div className="flex flex-col gap-2">
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
                                        <MenuItem value={sz} key={index}>
                                            {sz}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <span onClick={addSize} className="py-2 px-6 bg-blue-600 text-white rounded cursor-pointer font-bold text-xs uppercase h-10 flex items-center shadow">Add</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {sizes.map((s, i) => (
                                    <div key={i} className="flex justify-between items-center py-1 px-3 bg-indigo-50 rounded-full border border-indigo-200 gap-2">
                                        <p className="text-indigo-800 text-xs font-semibold">{s}</p>
                                        <span onClick={() => deleteSize(i)} className="text-red-600 cursor-pointer flex items-center"><DeleteIcon fontSize="small" style={{ fontSize: '16px' }} /></span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center border rounded">
                                <input value={highlightInput} onChange={(e) => setHighlightInput(e.target.value)} type="text" placeholder="Highlight" className="px-2 flex-1 outline-none border-none py-1.5" />
                                <span onClick={addHighlight} className="py-2 px-6 bg-blue-600 text-white rounded-r cursor-pointer font-bold">Add</span>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                {highlights.map((h, i) => (
                                    <div key={i} className="flex justify-between rounded items-center py-1 px-2 bg-green-50">
                                        <p className="text-green-800 text-sm font-medium">{h}</p>
                                        <span onClick={() => deleteHighlight(i)} className="text-red-600 cursor-pointer">
                                            <DeleteIcon />
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <h2 className="font-bold text-gray-700 uppercase text-xs mt-2 tracking-widest">Brand Details</h2>
                        <div className="flex justify-between gap-4 items-start">
                            <TextField label="Brand" type="text" variant="outlined" size="small" required value={brand} onChange={(e) => setBrand(e.target.value)} />
                            <div className="w-24 h-10 flex items-center justify-center border rounded-lg bg-gray-50">
                                {!logoPreview ? <ImageIcon className="text-gray-300" /> : <img src={logoPreview} alt="Brand Logo" className="w-full h-full object-contain" />}
                            </div>
                            <label className="rounded font-bold bg-gray-700 text-center cursor-pointer text-white py-2 px-3 text-xs uppercase shadow hover:bg-black transition-all">
                                <input type="file" name="logo" accept="image/*" onChange={handleLogoChange} className="hidden" />
                                Logo
                            </label>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 m-2 sm:w-1/2">
                        <h2 className="font-bold text-gray-700 uppercase text-xs tracking-widest">Specifications</h2>
                        <div className="flex justify-evenly gap-2 items-center">
                            <TextField value={specsInput.title} onChange={handleSpecsChange} name="title" label="Title" variant="outlined" size="small" />
                            <TextField value={specsInput.description} onChange={handleSpecsChange} name="description" label="Value" variant="outlined" size="small" />
                            <span onClick={addSpecs} className="py-2 px-6 bg-blue-600 text-white rounded cursor-pointer font-bold text-sm">Add</span>
                        </div>
                        <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto">
                            {specs.map((spec, i) => (
                                <div key={i} className="flex justify-between items-center text-sm rounded bg-blue-50 py-1.5 px-3">
                                    <p className="text-blue-800 font-bold">{spec.title}</p>
                                    <p className="text-gray-600">{spec.description}</p>
                                    <span onClick={() => deleteSpec(i)} className="text-red-600 cursor-pointer">
                                        <DeleteIcon fontSize="small" />
                                    </span>
                                </div>
                            ))}
                        </div>

                        <h2 className="font-bold text-gray-700 uppercase text-xs mt-4 tracking-widest">Product Images</h2>
                        <div className="flex gap-2 overflow-x-auto h-32 border rounded-xl p-2 bg-gray-50">
                            {oldImages && oldImages.map((image, i) => (
                                <img key={i} src={image.url} alt="Product" className="h-full object-contain border rounded-lg bg-white shadow-sm" />
                            ))}
                            {imagesPreview.map((image, i) => (
                                <img key={i} src={image} alt="Product Preview" className="h-full object-contain border rounded-lg bg-white shadow-sm" />
                            ))}
                        </div>
                        <label className="rounded font-bold bg-gray-700 text-center cursor-pointer text-white p-3 shadow uppercase text-xs tracking-widest hover:bg-black transition-all my-2">
                            <input type="file" name="images" accept="image/*" multiple onChange={handleProductImageChange} className="hidden" />
                            Update Images
                        </label>

                        <div className="flex justify-end mt-4">
                            <input type="submit" form="mainform" className="bg-[#f85606] uppercase w-full p-4 text-white font-black rounded-xl shadow-lg cursor-pointer hover:bg-[#d14905] transition-all tracking-widest" value="Update Product" />
                        </div>
                    </div>
                </form>
            )}
        </>
    );
};

export default UpdateProduct;