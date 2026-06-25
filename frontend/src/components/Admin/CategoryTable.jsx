import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useSelector, useDispatch } from 'react-redux';
import { getCategories, updateCategory, approveCategory, deleteCategory, clearErrors } from '../../actions/categoryAction'; 
import MetaData from '../Layouts/MetaData';
import {
    Paper, Typography, Box, Button,
    Dialog, DialogTitle, DialogContent, TextField, DialogActions, Avatar, IconButton, 
    FormControl, Select, MenuItem, Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

const CategoryTable = () => {
    const dispatch = useDispatch();

    const { loading, error, categories } = useSelector((state) => state.allCategories);
    const { isUpdated, isDeleted, error: updateError, loading: updateLoading } = useSelector((state) => state.category || {});
    const { isApproved, error: approvalError, loading: approvalLoading } = useSelector((state) => state.approveCategory || {});

    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [types, setTypes] = useState([""]); 
    const [categoryId, setCategoryId] = useState("");
    const [image, setImage] = useState("");
    const [imagePreview, setImagePreview] = useState("");

    useEffect(() => {
        if (error) { alert(error); dispatch(clearErrors()); }
        if (updateError) { alert(updateError); dispatch(clearErrors()); }
        if (approvalError) { alert(approvalError); dispatch(clearErrors()); }

        if (isUpdated) {
            alert("Category Updated Successfully!");
            handleClose();
            dispatch({ type: "UPDATE_CATEGORY_RESET" });
            dispatch(getCategories());
        }

        if (isDeleted) {
            alert("Category Deleted Successfully!");
            dispatch({ type: "DELETE_CATEGORY_RESET" });
            dispatch(getCategories());
        }

        if (isApproved) {
            alert("Category Status Updated Successfully!");
            dispatch({ type: "APPROVE_CATEGORY_RESET" });
            dispatch(getCategories());
        }

        dispatch(getCategories());
    }, [dispatch, error, isUpdated, isDeleted, updateError, isApproved, approvalError]);

    const handleTypeChange = (index, value) => {
        const updatedTypes = [...types];
        updatedTypes[index] = value;
        setTypes(updatedTypes);
    };

    const addTypeField = () => setTypes([...types, ""]);
    const removeTypeField = (index) => {
        const updatedTypes = [...types];
        updatedTypes.splice(index, 1);
        setTypes(updatedTypes);
    };

    const handleEditClick = (category) => {
        setCategoryId(category.id);
        setName(category.name);
        setTypes(category.types && category.types.length > 0 ? [...category.types] : [""]);
        setImagePreview(category.image);
        setOpen(true);
    };

    const deleteCategoryHandler = (id) => {
        if (window.confirm("Are you sure you want to delete this category?")) { dispatch(deleteCategory(id)); }
    };

    const handleApproveReject = (id, newStatus) => {
        if (window.confirm(`Are you sure you want to ${newStatus} this category?`)) {
            dispatch(approveCategory(id, { status: newStatus }));
        }
    };

    const handleClose = () => {
        setOpen(false);
        setName("");
        setTypes([""]);
        setImage("");
        setImagePreview("");
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        const myForm = new FormData();
        myForm.set("name", name);
        types.forEach((t) => {
            if (t.trim() !== "") { myForm.append("types", t); }
        });
        if (image !== "") { myForm.set("image", image); }
        dispatch(updateCategory(categoryId, myForm));
    };

    const columns = [
        { field: "id", headerName: "ID", flex: 0.8, headerAlign: 'center', align: 'center' },
        { field: "name", headerName: "Category Name", flex: 1, headerAlign: 'center', align: 'center' },
        {
            field: "types",
            headerName: "View Types",
            flex: 1.2,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <FormControl fullWidth size="small" sx={{ minWidth: 150 }}>
                    <Select
                        displayEmpty
                        value=""
                        renderValue={() => "Check Sub-types"}
                        sx={{ fontSize: '0.8rem', height: 35 }}
                    >
                        {params.value && params.value.length > 0 ? (
                            params.value.map((t, i) => (
                                <MenuItem key={i} value={t} disabled sx={{ color: 'black !important', opacity: '1 !important' }}>
                                    {t}
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled>No Types Available</MenuItem>
                        )}
                    </Select>
                </FormControl>
            )
        },
        {
            field: "image",
            headerName: "Image",
            flex: 0.5,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <Box component="img" sx={{ height: 40, width: 40, borderRadius: '4px', objectFit: 'contain', border: '1px solid #ddd' }} src={params.value} />
            ),
        },
        {
            field: "status",
            headerName: "Approval Status",
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'center' }}>
                    {params.value === 'approved' ? (
                        <Chip label="Approved" color="success" size="small" />
                    ) : (
                        <Chip label="Pending" color="warning" size="small" />
                    )}
                    {params.value !== 'approved' && (
                        <Button 
                            size="small" 
                            variant="contained" 
                            color="success" 
                            onClick={() => handleApproveReject(params.row.id, 'approved')}
                            sx={{ fontSize: '0.65rem', py: 0 }}
                        >
                            Approve
                        </Button>
                    )}
                </Box>
            )
        },
        {
            field: "actions",
            headerName: "Actions",
            flex: 0.8,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton onClick={() => handleEditClick(params.row)} color="primary"><EditIcon /></IconButton>
                    <IconButton onClick={() => deleteCategoryHandler(params.row.id)} color="error"><DeleteIcon /></IconButton>
                </Box>
            ),
        },
    ];

    const rows = categories ? categories.map((item) => ({
        id: item._id,
        name: item.name,
        types: item.types, 
        image: item.image?.url || '',
        status: item.status || 'pending',
    })) : [];

    return (
        <Box sx={{ p: { xs: 2, md: 5 }, backgroundColor: '#f1f3f6', minHeight: '100vh' }}>
            <MetaData title="Admin - Category Approvals & Inventory" />

            <Paper elevation={3} sx={{ p: 3, borderRadius: '8px' }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#2874f0', textAlign: 'center' }}>
                    CATEGORY APPROVALS & INVENTORY
                </Typography>

                <DataGrid
                    rows={rows}
                    columns={columns}
                    autoHeight
                    disableSelectionOnClick
                    loading={loading || updateLoading || approvalLoading}
                    sx={{ 
                        border: 'none', 
                        backgroundColor: 'white',
                        '& .MuiDataGrid-columnHeaders': { backgroundColor: '#f8f9fa', borderBottom: '2px solid #2874f0' } 
                    }}
                />
            </Paper>

            {/* --- UPDATE MODAL --- */}
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle sx={{ fontWeight: 600, backgroundColor: '#2874f0', color: 'white', mb: 2 }}>Update Category</DialogTitle>
                <form onSubmit={handleUpdate}>
                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <TextField
                                fullWidth
                                label="Category Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />

                            <Box sx={{ border: '1px solid #ddd', p: 2, borderRadius: '4px' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Manage Types</Typography>
                                    <Button size="small" variant="contained" startIcon={<AddCircleIcon />} onClick={addTypeField} sx={{ fontSize: '0.7rem' }}>
                                        Add New Type
                                    </Button>
                                </Box>
                                
                                {types.map((type, index) => (
                                    <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            placeholder={`Type ${index + 1}`}
                                            value={type}
                                            onChange={(e) => handleTypeChange(index, e.target.value)}
                                        />
                                        {types.length > 1 && (
                                            <IconButton color="error" onClick={() => removeTypeField(index)}>
                                                <RemoveCircleIcon />
                                            </IconButton>
                                        )}
                                    </Box>
                                ))}
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, border: '1px dashed #2874f0', borderRadius: '8px' }}>
                                <Avatar src={imagePreview} variant="rounded" sx={{ width: 80, height: 80, border: '1px solid #eee' }} />
                                <Button variant="outlined" component="label" startIcon={<CloudUploadIcon />}>
                                    Change Image
                                    <input type="file" hidden accept="image/*" onChange={(e) => {
                                        const reader = new FileReader();
                                        reader.onload = () => { if (reader.readyState === 2) { setImagePreview(reader.result); setImage(reader.result); } };
                                        reader.readAsDataURL(e.target.files[0]);
                                    }} />
                                </Button>
                            </Box>
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Button onClick={handleClose} variant="outlined" color="inherit">Cancel</Button>
                        <Button type="submit" variant="contained" disabled={updateLoading} sx={{ backgroundColor: '#2874f0', px: 4 }}>
                            {updateLoading ? "Updating..." : "Save Changes"}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
};

export default CategoryTable;