import React, { useState } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { saveShippingInfo } from '../../actions/cartAction';
import { pakistanData } from '../../utils/pakistanData'; // Ensure this file exists
import Stepper from './Stepper';
import MetaData from '../Layouts/MetaData';
import PriceSidebar from './PriceSidebar';

const Shipping = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const { cartItems, shippingInfo } = useSelector((state) => state.cart);

    const [address, setAddress] = useState(shippingInfo.address || "");
    const [pincode, setPincode] = useState(shippingInfo.pincode || "");
    const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo || "");
    const [province, setProvince] = useState(shippingInfo.state || "");
    const [city, setCity] = useState(shippingInfo.city || "");

    const shippingSubmit = (e) => {
        e.preventDefault();

        if (phoneNo.length !== 11) {
            enqueueSnackbar("Phone Number must be 11 digits", { variant: "error" });
            return;
        }

        // Saving country as Pakistan by default
        dispatch(saveShippingInfo({ address, city, country: "PK", state: province, pincode, phoneNo }));
        navigate("/order/confirm");
    };

    return (
        <>
            <MetaData title="Ma-Cart: Shipping Details" />
            <main className="w-full mt-20">
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-11/12 mt-0 sm:mt-4 m-auto sm:mb-7 px-2">
                    <div className="flex-1">
                        <Stepper activeStep={1}>
                            <div className="w-full bg-white p-6 shadow-md border rounded-xl">
                                <form onSubmit={shippingSubmit} className="flex flex-col gap-6 w-full sm:w-4/5 mx-auto py-4">
                                    <h2 className="text-xl font-semibold mb-2">Shipping Details</h2>
                                    
                                    <TextField 
                                        value={address} 
                                        onChange={(e) => setAddress(e.target.value)} 
                                        fullWidth label="Address" required variant="outlined" 
                                    />

                                    <div className="flex gap-4">
                                        <TextField 
                                            value={pincode} 
                                            onChange={(e) => setPincode(e.target.value)} 
                                            type="number" label="Postal Code" fullWidth required 
                                        />
                                        <TextField 
                                            value={phoneNo} 
                                            onChange={(e) => setPhoneNo(e.target.value)} 
                                            type="number" label="Phone No (e.g. 03xxxxxxxxx)" fullWidth required 
                                        />
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <FormControl fullWidth required>
                                            <InputLabel>Province</InputLabel>
                                            <Select
                                                value={province}
                                                label="Province"
                                                onChange={(e) => {
                                                    setProvince(e.target.value);
                                                    setCity(""); 
                                                }}
                                            >
                                                {pakistanData.map((item) => (
                                                    <MenuItem key={item.province} value={item.province}>
                                                        {item.province}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>

                                        {/* City Selector */}
<FormControl fullWidth required disabled={!province}>
    <InputLabel>City</InputLabel>
    <Select
        value={city}
        label="City"
        onChange={(e) => setCity(e.target.value)}
    >
        {/* Yahan hum optional chaining ?. ka use karenge */}
        {province && pakistanData
            .find((item) => item.province === province)
            ?.cities.map((cityName) => (
                <MenuItem key={cityName} value={cityName}>
                    {cityName}
                </MenuItem>
            ))}
    </Select>
</FormControl>
                                    </div>

                                    <button 
                                        type="submit" 
                                        className="bg-green-800 hover:bg-green-600 w-full py-3.5 text-white font-bold rounded-lg shadow-lg uppercase transition-all duration-300"
                                    >
                                        Save and deliver here
                                    </button>
                                </form>
                            </div>
                        </Stepper>
                    </div>

                    <PriceSidebar cartItems={cartItems} />
                </div>
            </main>
        </>
    );
};

export default Shipping;