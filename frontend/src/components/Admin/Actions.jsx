import { useState } from 'react';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

const Actions = ({ id, deleteHandler, name, editRoute, updateStatusHandler, isSeller }) => {
    const [open, setOpen] = useState(false);

    const handleClose = () => setOpen(false);

    // Path dynamic rakha hai taaki seller/admin dono use kar sakein
    const editPath = isSeller ? `/seller/${editRoute}/${id}` : `/admin/${editRoute}/${id}`;

    return (
        <>
            <div className="flex items-center gap-2">
                {/* 1. Approve Button */}
                <button 
                    onClick={() => updateStatusHandler(id, true)} 
                    className="p-1.5 rounded-full text-green-600 bg-green-100 hover:bg-green-600 hover:text-white transition-all shadow-sm"
                    title="Approve"
                >
                    <CheckCircleIcon fontSize="small" />
                </button>

                {/* 2. Reject Button */}
                <button 
                    onClick={() => updateStatusHandler(id, false)} 
                    className="p-1.5 rounded-full text-yellow-600 bg-yellow-100 hover:bg-yellow-600 hover:text-white transition-all shadow-sm"
                    title="Reject"
                >
                    <DoDisturbIcon fontSize="small" />
                </button>

                {/* 3. Edit Button */}
                {editRoute !== "review" && (
                    <Link to={editPath} className="text-blue-600 hover:bg-blue-100 p-1 rounded-full shadow-sm">
                        <EditIcon fontSize="small" />
                    </Link>
                )}

                {/* 4. Delete Button */}
                <button 
                    onClick={() => setOpen(true)} 
                    className="text-red-600 hover:bg-red-100 p-1 rounded-full shadow-sm"
                >
                    <DeleteIcon fontSize="small" />
                </button>
            </div>

            {/* Confirmation Dialog */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogContent>
                    <p className="text-gray-500">
                        Do you really want to delete {name && <span className="font-medium">{name}</span>}? 
                        This process cannot be undone.
                    </p>
                </DialogContent>
                <DialogActions>
                    <button onClick={handleClose} className="py-2 px-6 rounded bg-gray-400 hover:bg-gray-500 text-white">Cancel</button>
                    <button 
                        onClick={() => { deleteHandler(id); handleClose(); }} 
                        className="py-2 px-6 ml-4 rounded bg-red-600 hover:bg-red-700 text-white"
                    >
                        Delete
                    </button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Actions;