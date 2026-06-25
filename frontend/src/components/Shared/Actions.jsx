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

const Actions = ({ 
    id, 
    itemId, 
    editRoute, 
    deleteHandler, 
    name, 
    updateStatusHandler, 
    isOrder, 
    currentStatus 
}) => {
    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <div className="flex gap-2 items-center">
                {/* CASE 1: ORDER STATUS UPDATER (Dropdown) */}
                {isOrder ? (
                    <select 
                        onChange={(e) => updateStatusHandler(id, itemId, e.target.value)}
                        className="border border-gray-300 p-1 rounded text-sm focus:outline-none"
                        defaultValue={currentStatus || "Processing"}
                    >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                    </select>
                ) : (
                    /* CASE 2: PRODUCT APPROVAL (Approve/Reject Buttons) */
                    <>
                        <button 
                            onClick={() => updateStatusHandler(id, true)} 
                            className="text-green-600 hover:bg-green-200 p-1 rounded-full bg-green-100"
                            title="Approve"
                        >
                            <CheckCircleIcon />
                        </button>
                        <button 
                            onClick={() => updateStatusHandler(id, false)} 
                            className="text-yellow-600 hover:bg-yellow-200 p-1 rounded-full bg-yellow-100"
                            title="Reject"
                        >
                            <DoDisturbIcon />
                        </button>
                    </>
                )}

                {/* EDIT BUTTON */}
                <Link to={`/${editRoute}/${id}`} className="text-blue-600 hover:bg-blue-200 p-1 rounded-full bg-blue-100">
                    <EditIcon />
                </Link>

                {/* DELETE BUTTON */}
                <button onClick={() => setOpen(true)} className="text-red-600 hover:bg-red-200 p-1 rounded-full bg-red-100">
                    <DeleteIcon />
                </button>
            </div>

            {/* DELETE CONFIRMATION DIALOG */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogContent>
                    <p className="text-gray-500">Do you really want to delete {name}? This process cannot be undone.</p>
                </DialogContent>
                <DialogActions>
                    <button onClick={handleClose} className="py-2 px-6 rounded bg-gray-400 text-white">Cancel</button>
                    <button onClick={() => { deleteHandler(id); handleClose(); }} className="py-2 px-6 ml-4 rounded bg-red-600 text-white">Delete</button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Actions;