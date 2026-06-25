import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { requestPayout } from '../../actions/payoutAction'; 
import { useSnackbar } from 'notistack';

const WithdrawalForm = () => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    
    const [amount, setAmount] = useState("");
    const { user } = useSelector((state) => state.user);
console.log("User Data in Payout Form:", user);
    const submitHandler = (e) => {
        e.preventDefault();

        if (amount > user.walletBalance) {
            enqueueSnackbar("Amount exceeds your wallet balance!", { variant: "error" });
            return;
        }

        if (amount <= 0) {
            enqueueSnackbar("Please enter a valid amount", { variant: "warning" });
            return;
        }

        dispatch(requestPayout({ amount }));
        enqueueSnackbar("Withdrawal request submitted successfully", { variant: "success" });
        setAmount(""); // Reset form
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Request Payout</h2>
            <p>
            Available Balance: 
            <span className="font-bold text-green-600">
                ₹{user ? user.walletBalance : 0}
            </span>
        </p>
            
            <form onSubmit={submitHandler} className="flex flex-col md:flex-row gap-4">
                <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter withdrawal amount"
                    className="border border-gray-300 p-2 rounded w-full md:w-2/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                <button 
                    type="submit" 
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition duration-200"
                >
                    Request Payout
                </button>
            </form>
            
            <p className="text-xs text-gray-400 mt-4">
                * Note: Withdrawal requests are subject to admin approval and will be processed within 2-3 business days.
            </p>
        </div>
    );
};

export default WithdrawalForm;