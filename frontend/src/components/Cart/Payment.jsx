// import axios from 'axios';
// import { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import PriceSidebar from './PriceSidebar';
// import Stepper from './Stepper';
// // import {
// //     CardNumberElement,
// //     CardCvcElement,
// //     CardExpiryElement,
// //     useStripe,
// //     useElements,
// // } from '@stripe/react-stripe-js';
// import { clearErrors } from '../../actions/orderAction';
// import { useSnackbar } from 'notistack';
// import { post } from '../../utils/paytmForm';
// import FormControl from '@mui/material/FormControl';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Radio from '@mui/material/Radio';
// import RadioGroup from '@mui/material/RadioGroup';
// import MetaData from '../Layouts/MetaData';

// const Payment = () => {

//     const dispatch = useDispatch();
//     // const navigate = useNavigate();
//     const { enqueueSnackbar } = useSnackbar();
//     // const stripe = useStripe();
//     // const elements = useElements();
//     // const paymentBtn = useRef(null);

//     const [payDisable, setPayDisable] = useState(false);

//     const { shippingInfo, cartItems } = useSelector((state) => state.cart);
//     const { user } = useSelector((state) => state.user);
//     const { error } = useSelector((state) => state.newOrder);

//     const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

//     const paymentData = {
//         amount: Math.round(totalPrice),
//         email: user.email,
//         phoneNo: shippingInfo.phoneNo,
//     };

//     // const order = {
//     //     shippingInfo,
//     //     orderItems: cartItems,
//     //     totalPrice,
//     // }

//     const submitHandler = async (e) => {
//         e.preventDefault();

//         // paymentBtn.current.disabled = true;
//         setPayDisable(true);

//         try {
//             const config = {
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//             };

//             const { data } = await axios.post(
//                 '/api/v1/payment/process',
//                 paymentData,
//                 config,
//             );

//             let info = {
//                 action: "https://securegw-stage.paytm.in/order/process",
//                 params: data.paytmParams
//             }

//             post(info)

//             // if (!stripe || !elements) return;

//             // const result = await stripe.confirmCardPayment(client_secret, {
//             //     payment_method: {
//             //         card: elements.getElement(CardNumberElement),
//             //         billing_details: {
//             //             name: user.name,
//             //             email: user.email,
//             //             address: {
//             //                 line1: shippingInfo.address,
//             //                 city: shippingInfo.city,
//             //                 country: shippingInfo.country,
//             //                 state: shippingInfo.state,
//             //                 postal_code: shippingInfo.pincode,
//             //             },
//             //         },
//             //     },
//             // });

//             // if (result.error) {
//             //     paymentBtn.current.disabled = false;
//             //     enqueueSnackbar(result.error.message, { variant: "error" });
//             // } else {
//             //     if (result.paymentIntent.status === "succeeded") {

//             //         order.paymentInfo = {
//             //             id: result.paymentIntent.id,
//             //             status: result.paymentIntent.status,
//             //         };

//             //         dispatch(newOrder(order));
//             //         dispatch(emptyCart());

//             //         navigate("/order/success");
//             //     } else {
//             //         enqueueSnackbar("Processing Payment Failed!", { variant: "error" });
//             //     }
//             // }

//         } catch (error) {
//             // paymentBtn.current.disabled = false;
//             setPayDisable(false);
//             enqueueSnackbar(error, { variant: "error" });
//         }
//     };

//     useEffect(() => {
//         if (error) {
//             dispatch(clearErrors());
//             enqueueSnackbar(error, { variant: "error" });
//         }
//     }, [dispatch, error, enqueueSnackbar]);


//     return (
//         <>
//             <MetaData title="Flipkart: Secure Payment | Paytm" />

//             <main className="w-full mt-20">

//                 {/* <!-- row --> */}
//                 <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-11/12 mt-0 sm:mt-4 m-auto sm:mb-7">

//                     {/* <!-- cart column --> */}
//                     <div className="flex-1">

//                         <Stepper activeStep={3}>
//                             <div className="w-full bg-white">

//                                 <form onSubmit={(e) => submitHandler(e)} autoComplete="off" className="flex flex-col justify-start gap-2 w-full mx-8 my-4 overflow-hidden">
//                                     <FormControl>
//                                         <RadioGroup
//                                             aria-labelledby="payment-radio-group"
//                                             defaultValue="paytm"
//                                             name="payment-radio-button"
//                                         >
//                                             <FormControlLabel
//                                                 value="paytm"
//                                                 control={<Radio />}
//                                                 label={
//                                                     <div className="flex items-center gap-4">
//                                                         <img draggable="false" className="h-6 w-6 object-contain" src="https://rukminim1.flixcart.com/www/96/96/promos/01/09/2020/a07396d4-0543-4b19-8406-b9fcbf5fd735.png" alt="Paytm Logo" />
//                                                         <span>Paytm</span>
//                                                     </div>
//                                                 }
//                                             />
//                                         </RadioGroup>
//                                     </FormControl>

//                                     <input type="submit" value={`Pay ₹${totalPrice.toLocaleString()}`} disabled={payDisable ? true : false} className={`${payDisable ? "bg-primary-grey cursor-not-allowed" : "bg-primary-orange cursor-pointer"} w-1/2 sm:w-1/4 my-2 py-3 font-medium text-white shadow hover:shadow-lg rounded-sm uppercase outline-none`} />

//                                 </form>

//                                 {/* stripe form */}
//                                 {/* <form onSubmit={(e) => submitHandler(e)} autoComplete="off" className="flex flex-col justify-start gap-3 w-full sm:w-3/4 mx-8 my-4">
//                                 <div>
//                                     <CardNumberElement />
//                                 </div>
//                                 <div>
//                                     <CardExpiryElement />
//                                 </div>
//                                 <div>
//                                     <CardCvcElement />
//                                 </div>
//                                 <input ref={paymentBtn} type="submit" value="Pay" className="bg-primary-orange w-full sm:w-1/3 my-2 py-3.5 text-sm font-medium text-white shadow hover:shadow-lg rounded-sm uppercase outline-none cursor-pointer" />
//                             </form> */}
//                                 {/* stripe form */}

//                             </div>
//                         </Stepper>
//                     </div>

//                     <PriceSidebar cartItems={cartItems} />
//                 </div>
//             </main>
//         </>
//     );
// };

// export default Payment;








import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PriceSidebar from './PriceSidebar';
import Stepper from './Stepper';
import {
    CardNumberElement,
    CardCvcElement,
    CardExpiryElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import { clearErrors, newOrder } from '../../actions/orderAction';
import { useSnackbar } from 'notistack';
import MetaData from '../Layouts/MetaData';

const Payment = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const stripe = useStripe();
    const elements = useElements();

    const [payDisable, setPayDisable] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("card");
    
    // Screenshot states for EasyPaisa/JazzCash
    const [screenshot, setScreenshot] = useState("");
    const [screenshotPreview, setScreenshotPreview] = useState("");

    const { shippingInfo, cartItems } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.user);
    const { error } = useSelector((state) => state.newOrder);

    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Handle Screenshot Selection
    const handleScreenshotChange = (e) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setScreenshot(reader.result);
                setScreenshotPreview(reader.result);
            }
        };
        reader.readAsDataURL(e.target.files[0]);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setPayDisable(true);

        try {
            const orderData = {
                shippingInfo,
                orderItems: cartItems.map((item) => ({
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image.url || item.image,
                    product: item.product,
                })),
                totalPrice,
                paymentInfo: {
                    id: "",
                    status: "",
                    method: paymentMethod,
                }
            };

            // --- CASE 1: STRIPE CARD PAYMENT ---
            if (paymentMethod === "card") {
                if (totalPrice < 50) {
                    enqueueSnackbar("Stripe requires minimum ₹50", { variant: "warning" });
                    setPayDisable(false);
                    return;
                }

                const config = { headers: { "Content-Type": "application/json" } };
                const { data } = await axios.post('/api/v1/payment/process', { amount: Math.round(totalPrice * 100) }, config);
                const client_secret = data.client_secret;

                if (!stripe || !elements) return;

                const result = await stripe.confirmCardPayment(client_secret, {
                    payment_method: {
                        card: elements.getElement(CardNumberElement),
                    },
                });

                if (result.error) {
                    setPayDisable(false);
                    enqueueSnackbar(result.error.message, { variant: "error" });
                } else if (result.paymentIntent.status === "succeeded") {
                    orderData.paymentInfo = {
                        id: result.paymentIntent.id,
                        status: "succeeded",
                        method: "Card"
                    };

                    await dispatch(newOrder(orderData));

                    // Notification Logic
                    dispatch({
                        type: "ADD_NOTIFICATION",
                        payload: {
                            id: Date.now(),
                            title: "Order Placed! 🚀",
                            message: `Aapka ₹${totalPrice} ka order confirm ho gaya hai.`,
                            createdAt: new Date().toLocaleString(),
                            isRead: false,
                            type: "order"
                        }
                    });

                    navigate("/order/success");
                }
            }

            // --- CASE 2: EASYPAISA / JAZZCASH (Manual) ---
            else if (paymentMethod === "easypaisa" || paymentMethod === "jazzcash") {
                if (!screenshot) {
                    enqueueSnackbar("Please upload payment screenshot", { variant: "error" });
                    setPayDisable(false);
                    return;
                }

                orderData.paymentInfo = {
                    id: `${paymentMethod.toUpperCase()}-${Date.now()}`,
                    status: "Pending Approval",
                    method: paymentMethod,
                    screenshot: screenshot 
                };

                await dispatch(newOrder(orderData));

                // Notification Logic
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        id: Date.now(),
                        title: "Order Received (Pending Verification) ⏳",
                        message: `Humein aapka ${paymentMethod} screenshot mil gaya hai. Verification ke baad order ship hoga.`,
                        createdAt: new Date().toLocaleString(),
                        isRead: false,
                        type: "payment"
                    }
                });

                enqueueSnackbar("Order Placed! Admin will verify your payment.", { variant: "success" });
                navigate("/order/success");
            }

        } catch (error) {
            setPayDisable(false);
            enqueueSnackbar(error.response?.data?.message || "Payment Failed", { variant: "error" });
        }
    };

    useEffect(() => {
        if (error) {
            dispatch(clearErrors());
            enqueueSnackbar(error, { variant: "error" });
        }
    }, [dispatch, error, enqueueSnackbar]);

    return (
        <>
            <MetaData title="Secure Payment | MA-CART" />
            <main className="w-full mt-20">
                <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-11/12 mt-4 m-auto sm:mb-7">
                    <div className="flex-1">
                        <Stepper activeStep={3}>
                            <div className="w-full bg-white p-6 shadow border rounded">
                                <h1 className="text-xl font-bold border-b pb-3 mb-6 text-gray-700 uppercase">Select Payment Method</h1>

                                <form onSubmit={submitHandler} className="flex flex-col gap-5">

                                    {/* Debit Card (Stripe) */}
                                    <div onClick={() => setPaymentMethod("card")}
                                        className={`p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200'}`}>
                                        <div className="flex items-center gap-3">
                                            <input type="radio" checked={paymentMethod === 'card'} readOnly className="cursor-pointer" />
                                            <span className="font-semibold text-gray-800">Debit / Credit Card (Stripe)</span>
                                        </div>
                                        {paymentMethod === "card" && (
                                            <div className="flex flex-col gap-3 mt-4 animate-fade-in px-2">
                                                <div className="border p-3 rounded bg-white"><CardNumberElement /></div>
                                                <div className="flex gap-4">
                                                    <div className="border p-3 rounded flex-1 bg-white"><CardExpiryElement /></div>
                                                    <div className="border p-3 rounded flex-1 bg-white"><CardCvcElement /></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* EasyPaisa */}
                                    <div onClick={() => setPaymentMethod("easypaisa")}
                                        className={`p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'easypaisa' ? 'border-green-500 bg-green-50 shadow-md' : 'border-gray-200'}`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <input type="radio" checked={paymentMethod === 'easypaisa'} readOnly className="cursor-pointer" />
                                                <span className="font-bold text-green-700">EasyPaisa (Manual)</span>
                                            </div>
                                            <img src="https://images.seeklogo.com/logo-png/51/1/easypaisa-logo-png_seeklogo-512220.png" alt="EasyPaisa" className="object-contain" style={{width: '150px', height: '50px'}} />
                                        </div>
                                        {paymentMethod === "easypaisa" && (
                                            <div className="mt-4 p-3 bg-white border rounded">
                                                <p className="text-sm">Send Amount to: <span className="font-bold">0349-3395255</span> (MA-CART)</p>
                                                <input type="file" accept="image/*" onChange={handleScreenshotChange} className="mt-3 text-xs w-full" />
                                                {screenshotPreview && <img src={screenshotPreview} alt="Preview" className="h-24 mt-2 rounded border" />}
                                            </div>
                                        )}
                                    </div>

                                    {/* JazzCash */}
                                    <div onClick={() => setPaymentMethod("jazzcash")}
                                        className={`p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'jazzcash' ? 'border-red-500 bg-red-50 shadow-md' : 'border-gray-200 hover:bg-gray-50'}`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <input type="radio" checked={paymentMethod === 'jazzcash'} readOnly className="cursor-pointer" />
                                                <span className="font-bold text-green-800">JazzCash</span>
                                            <span className="text-green-500 font-semibold text-green-600  rounded">(Manual)</span>
                                            </div>
                                                <img src="https://iconlogovector.com/uploads/images/2025/11/lg-691c164eec616-JazzCash.webp" alt="JazzCash" className="object-contain" style={{width: '150px', height: '50px'}} />
                                        </div>
                                        {paymentMethod === "jazzcash" && (
                                            <div className="mt-4 p-4 bg-white border-t border-red-200 rounded-b-lg animate-fade-in">
                                                <p className="text-sm text-gray-600">Send Amount to: <span className="font-bold text-black text-base">0300-7654321</span></p>
                                                <input type="file" accept="image/*" onChange={handleScreenshotChange} className="mt-3 text-xs w-full border p-2 rounded" />
                                                {screenshotPreview && <img src={screenshotPreview} alt="Preview" className="h-32 mt-2 rounded border-2 border-dashed border-red-400 p-1" />}
                                            </div>
                                        )}
                                    </div>

                                    <button type="submit" disabled={payDisable}
                                        className={`w-full py-3 text-white font-bold rounded shadow-lg ${payDisable ? "bg-gray-400" : "bg-green-800 hover:bg-green-600"}`}>
                                        {payDisable ? "Processing..." : `CONFIRM ORDER - ₹${totalPrice.toLocaleString()}`}
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

export default Payment;