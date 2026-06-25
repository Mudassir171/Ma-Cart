// import WebFont from 'webfontloader';
// import Footer from './components/Layouts/Footer/Footer';
// import Header from './components/Layouts/Header/Header';
// import Login from './components/User/Login';
// import Register from './components/User/Register';
// import { Routes, Route, useLocation } from 'react-router-dom';
// import { loadUser } from './actions/userAction';
// import { useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import UpdateProfile from './components/User/UpdateProfile';
// import UpdatePassword from './components/User/UpdatePassword';
// import ForgotPassword from './components/User/ForgotPassword';
// import ResetPassword from './components/User/ResetPassword';
// import Account from './components/User/Account';
// import ProtectedRoute from './Routes/ProtectedRoute';
// import Home from './components/Home/Home';
// import ProductDetails from './components/ProductDetails/ProductDetails';
// import Products from './components/Products/Products';
// import Cart from './components/Cart/Cart';
// import Shipping from './components/Cart/Shipping';
// import OrderConfirm from './components/Cart/OrderConfirm';
// import Payment from './components/Cart/Payment';
// import OrderStatus from './components/Cart/OrderStatus';
// import OrderSuccess from './components/Cart/OrderSuccess';
// import MyOrders from './components/Order/MyOrders';
// import OrderDetails from './components/Order/OrderDetails';
// import Dashboard from './components/Admin/Dashboard';
// import MainData from './components/Admin/MainData';
// import OrderTable from './components/Admin/OrderTable';
// import UpdateOrder from './components/Admin/UpdateOrder';
// import ProductTable from './components/Admin/ProductTable';
// import NewProduct from './components/Admin/NewProduct';
// import UpdateProduct from './components/Admin/UpdateProduct';
// import UserTable from './components/Admin/UserTable';
// import UpdateUser from './components/Admin/UpdateUser';
// import ReviewsTable from './components/Admin/ReviewsTable';
// import Wishlist from './components/Wishlist/Wishlist';
// import NotFound from './components/NotFound';

// function App() {

//   const dispatch = useDispatch();
//   const { pathname } = useLocation();
//   // const [stripeApiKey, setStripeApiKey] = useState("");

//   // async function getStripeApiKey() {
//   //   const { data } = await axios.get('/api/v1/stripeapikey');
//   //   setStripeApiKey(data.stripeApiKey);
//   // }

//   useEffect(() => {
//     WebFont.load({
//       google: {
//         families: ["Roboto:300,400,500,600,700"]
//       },
//     });
//   });

//   useEffect(() => {
//     dispatch(loadUser());
//     // getStripeApiKey();
//   }, [dispatch]);

//   // always scroll to top on route/path change
//   useEffect(() => {
//     window.scrollTo({
//       top: 0,
//       left: 0,
//       behavior: "smooth"
//     });
//   }, [pathname])

//   // disable right click
//   window.addEventListener("contextmenu", (e) => e.preventDefault());
//   window.addEventListener("keydown", (e) => {
//     if (e.keyCode == 123) e.preventDefault();
//     if (e.ctrlKey && e.shiftKey && e.keyCode === 73) e.preventDefault();
//     if (e.ctrlKey && e.shiftKey && e.keyCode === 74) e.preventDefault();
//   });

//   return (
//     <>
//       <Header />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />

//         <Route path="/product/:id" element={<ProductDetails />} />
//         <Route path="/products" element={<Products />} />
//         <Route path="/products/:keyword" element={<Products />} />

//         <Route path="/cart" element={<Cart />} />

//         {/* order process */}
//         <Route path="/shipping" element={
//           <ProtectedRoute>
//             <Shipping />
//           </ProtectedRoute>
//         } ></Route>

//         <Route path="/order/confirm" element={
//           <ProtectedRoute>
//             <OrderConfirm />
//           </ProtectedRoute>
//         } ></Route>

//         <Route path="/process/payment" element={
//           <ProtectedRoute>
//             {/* // stripeApiKey && ( */}
//             {/* // <Elements stripe={loadStripe(stripeApiKey)}> */}
//             <Payment />
//             {/* // </Elements> */}
//             {/* ) */}
//           </ProtectedRoute>
//         } ></Route>

//         <Route path="/orders/success" element={<OrderSuccess success={true} />} />
//         <Route path="/orders/failed" element={<OrderSuccess success={false} />} />
//         {/* order process */}

//         <Route path="/order/:id" element={
//           <ProtectedRoute>
//             <OrderStatus />
//           </ProtectedRoute>
//         } ></Route>

//         <Route path="/orders" element={
//           <ProtectedRoute>
//             <MyOrders />
//           </ProtectedRoute>
//         }></Route>

//         <Route path="/order_details/:id" element={
//           <ProtectedRoute>
//             <OrderDetails />
//           </ProtectedRoute>
//         }></Route>

//         <Route path="/account" element={
//           <ProtectedRoute>
//             <Account />
//           </ProtectedRoute>
//         } ></Route>

//         <Route path="/account/update" element={
//           <ProtectedRoute>
//             <UpdateProfile />
//           </ProtectedRoute>
//         } ></Route>

//         <Route path="/password/update" element={
//           <ProtectedRoute>
//             <UpdatePassword />
//           </ProtectedRoute>
//         } ></Route>

//         <Route path="/password/forgot" element={<ForgotPassword />} />

//         <Route path="/password/reset/:token" element={<ResetPassword />} />

//         <Route path="/wishlist" element={
//           <ProtectedRoute>
//             <Wishlist />
//           </ProtectedRoute>
//         } ></Route>

//         <Route path="/admin/dashboard" element={
//           <ProtectedRoute isAdmin={true}>
//             <Dashboard activeTab={0}>
//               <MainData />
//             </Dashboard>
//           </ProtectedRoute>
//         } ></Route>

//         <Route path="/admin/orders" element={
//           <ProtectedRoute isAdmin={true}>
//             <Dashboard activeTab={1}>
//               <OrderTable />
//             </Dashboard>
//           </ProtectedRoute>
//         } ></Route>

//         <Route path="/admin/order/:id" element={
//           <ProtectedRoute isAdmin={true}>
//             <Dashboard activeTab={1}>
//               <UpdateOrder />
//             </Dashboard>
//           </ProtectedRoute>
//         } ></Route>

//         <Route path="/admin/products" element={
//           <ProtectedRoute isAdmin={true}>
//             <Dashboard activeTab={2}>
//               <ProductTable />
//             </Dashboard>
//           </ProtectedRoute>
//         } ></Route>

//         <Route path="/admin/new_product" element={
//           <ProtectedRoute isAdmin={true}>
//             <Dashboard activeTab={3}>
//               <NewProduct />
//             </Dashboard>
//           </ProtectedRoute>
//         } ></Route>

//         <Route path="/admin/product/:id" element={
//           <ProtectedRoute isAdmin={true}>
//             <Dashboard activeTab={2}>
//               <UpdateProduct />
//             </Dashboard>
//           </ProtectedRoute>
//         } ></Route>

//         <Route path="/admin/users" element={
//           <ProtectedRoute isAdmin={true}>
//             <Dashboard activeTab={4}>
//               <UserTable />
//             </Dashboard>
//           </ProtectedRoute>
//         } ></Route>

//         <Route path="/admin/user/:id" element={
//           <ProtectedRoute isAdmin={true}>
//             <Dashboard activeTab={4}>
//               <UpdateUser />
//             </Dashboard>
//           </ProtectedRoute>
//         } ></Route>

//         <Route path="/admin/reviews" element={
//           <ProtectedRoute isAdmin={true}>
//             <Dashboard activeTab={5}>
//               <ReviewsTable />
//             </Dashboard>
//           </ProtectedRoute>
//         } ></Route>

//         <Route path="*" element={<NotFound />}></Route>

//       </Routes>
//       <Footer />
//     </>
//   );
// }

// export default App;
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Routes, Route, useLocation } from 'react-router-dom';
import WebFont from 'webfontloader';

// Stripe Imports
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// --- Layout Components ---
import Footer from './components/Layouts/Footer/Footer';
import Header from './components/Layouts/Header/Header';
import NotFound from './components/NotFound';

// --- User Components ---
import Login from './components/User/Login';
import Register from './components/User/Register';
import UpdateProfile from './components/User/UpdateProfile';
import UpdatePassword from './components/User/UpdatePassword';
import ForgotPassword from './components/User/ForgotPassword';
import ResetPassword from './components/User/ResetPassword';
import Account from './components/User/Account';
import BecomeSeller from './components/User/BecomeSeller';

// --- Product & Cart Components ---
import Home from './components/Home/Home';
import ProductDetails from './components/ProductDetails/ProductDetails';
import Products from './components/Products/Products';
import Cart from './components/Cart/Cart';
import Shipping from './components/Cart/Shipping';
import OrderConfirm from './components/Cart/OrderConfirm';
import Payment from './components/Cart/Payment';
import OrderSuccess from './components/Cart/OrderSuccess';
import Wishlist from './components/Wishlist/Wishlist';
import SellerStore from './components/Home/SellerStore';
// --- Order Components ---
import MyOrders from './components/Order/MyOrders';
import OrderDetails from './components/Order/OrderDetails';
import OrderStatus from './components/Cart/OrderStatus';

// --- Admin Components ---
import AdminDashboard from './components/Admin/Dashboard';
import AdminMainData from './components/Admin/MainData';
import AdminOrderTable from './components/Admin/OrderTable';
import AdminUpdateOrder from './components/Admin/UpdateOrder';
import AdminProductTable from './components/Admin/ProductTable';
import AdminNewProduct from './components/Admin/NewProduct';
import AdminUpdateProduct from './components/Admin/UpdateProduct';
import AdminUserTable from './components/Admin/UserTable';
import AdminUpdateUser from './components/Admin/UpdateUser';
import AdminReviewsTable from './components/Admin/ReviewsTable';
import AdminAddCategory from './components/Admin/NewCategory';
import AdminCategoryTable from './components/Admin/CategoryTable';
import AdminPendingSellers from './components/Admin/PendingSellers'
import AdminAllSeller from './components/Admin/AllSeller';
import AdminPayoutTable from './components/Admin/PayoutTable';
// --- Seller Dashboard Components (Naya Folder) ---
import SellerDashboard from './components/SellerDashboard/Dashboard';
import SellerMainData from './components/SellerDashboard/MainData';
import SellerProductTable from './components/SellerDashboard/ProductTable';
import SellerNewProduct from './components/SellerDashboard/NewProduct';
import SellerUpdateProduct from './components/SellerDashboard/UpdateProduct';
import SellerOrderTable from './components/SellerDashboard/OrderTable';
import WithdrawalForm from './components/SellerDashboard/WithdrawalForm';
import ShopSettings from './components/SellerDashboard/ShopSettings';
import NewCategory from './components/SellerDashboard/NewCategory';
import CategoryTable from './components/SellerDashboard/CategoryTable';
// --- Other Pages ---
import ContactPage from './components/Home/Contactpage';
import AboutUs from './components/Home/AboutUs';
import Notification from './components/Notification/Notification';
import PaymentPage from './components/Home/Paymentpage';

// --- Actions & Protection ---
import { loadUser } from './actions/userAction';
import ProtectedRoute from './Routes/ProtectedRoute';

function App() {
    const dispatch = useDispatch();
    const { pathname } = useLocation();
    const [stripeApiKey, setStripeApiKey] = useState("");

    useEffect(() => {
        WebFont.load({
            google: {
                families: ["Roboto:300,400,500,600,700"]
            },
        });
    }, []);

    useEffect(() => {
        dispatch(loadUser());

        async function getStripeApiKey() {
            try {
                const { data } = await axios.get('/api/v1/stripeapikey');
                setStripeApiKey(data.stripeApiKey);
            } catch (error) {
                console.error("Stripe key fetch failed:", error);
            }
        }
        getStripeApiKey();
    }, [dispatch]);

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }, [pathname]);

    return (
        <>
            <Header />
                
            <Routes>
                {/* --- Public Routes --- */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:keyword" element={<Products />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/contact-us" element={<ContactPage />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/payment-page" element={<PaymentPage />} />
                <Route path="/password/forgot" element={<ForgotPassword />} />
                <Route path="/password/reset/:token" element={<ResetPassword />} />
                <Route path="/seller/store/:id" element={ <SellerStore /> } />
                // App.js mein:
<Route path="/sellerstore/:id" element={<SellerStore />} />
                {/* --- Protected User Routes --- */}
                <Route path="/account" element={<ProtectedRoute><Account activeTab="profile" /></ProtectedRoute>} />
                <Route path="/account/update" element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>} />
                <Route path="/password/update" element={<ProtectedRoute><UpdatePassword /></ProtectedRoute>} />
                <Route path="/wishlist" element={<ProtectedRoute><Wishlist activeTab="wishlist" /></ProtectedRoute>} />
                <Route path="/notifications" element={<ProtectedRoute><Notification activeTab="notifications" /></ProtectedRoute>} />
                <Route path="/shipping" element={<ProtectedRoute><Shipping /></ProtectedRoute>} />
                <Route path="/order/confirm" element={<ProtectedRoute><OrderConfirm /></ProtectedRoute>} />
                <Route path="/become-seller" element={<ProtectedRoute><BecomeSeller /></ProtectedRoute>} />

                <Route path="/process/payment" element={
                    stripeApiKey && (
                        <Elements stripe={loadStripe(stripeApiKey)}>
                            <ProtectedRoute><Payment /></ProtectedRoute>
                        </Elements>
                    )
                } />

                <Route path="/orders/success" element={<OrderSuccess success={true} />} />
                <Route path="/orders/failed" element={<OrderSuccess success={false} />} />
                <Route path="/orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
                <Route path="/order/:id" element={<ProtectedRoute><OrderStatus /></ProtectedRoute>} />
                <Route path="/order_details/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />

                {/* --- Admin Routes --- */}
                <Route path="/admin/dashboard" element={<ProtectedRoute isAdmin={true}><AdminDashboard activeTab={0}><AdminMainData /></AdminDashboard></ProtectedRoute>} />
                <Route path="/admin/orders" element={<ProtectedRoute isAdmin={true}><AdminDashboard activeTab={1}><AdminOrderTable /></AdminDashboard></ProtectedRoute>} />
                <Route path="/admin/order/:id" element={<ProtectedRoute isAdmin={true}><AdminDashboard activeTab={1}><AdminUpdateOrder /></AdminDashboard></ProtectedRoute>} />
                <Route path="/admin/products" element={<ProtectedRoute isAdmin={true}><AdminDashboard activeTab={2}><AdminProductTable /></AdminDashboard></ProtectedRoute>} />
                <Route path="/admin/update-product/:id" element={<ProtectedRoute isAdmin={true}><AdminDashboard activeTab={2}><AdminUpdateProduct /></AdminDashboard></ProtectedRoute>} />
                <Route path="/admin/new_product" element={<ProtectedRoute isAdmin={true}><AdminDashboard activeTab={3}><AdminNewProduct /></AdminDashboard></ProtectedRoute>} />
                <Route path="/admin/users" element={<ProtectedRoute isAdmin={true}><AdminDashboard activeTab={4}><AdminUserTable /></AdminDashboard></ProtectedRoute>} />
                <Route path="/admin/user/:id" element={<ProtectedRoute isAdmin={true}><AdminDashboard activeTab={4}><AdminUpdateUser /></AdminDashboard></ProtectedRoute>} />
                <Route path="/admin/sellers" element={<ProtectedRoute isAdmin={true}><AdminDashboard activeTab={4}><AdminPendingSellers /></AdminDashboard></ProtectedRoute>} />
                <Route path="/admin/reviews" element={ <ProtectedRoute isAdmin={ true }><AdminDashboard activeTab={ 5 }><AdminReviewsTable /></AdminDashboard></ProtectedRoute> } />
                <Route path="/admin/new_category" element={<ProtectedRoute isAdmin={true}><AdminDashboard activeTab={6}><AdminAddCategory /></AdminDashboard></ProtectedRoute>} />
                <Route path="/admin/categories" element={<ProtectedRoute isAdmin={true}><AdminDashboard activeTab={6}><AdminCategoryTable /></AdminDashboard></ProtectedRoute>} />
                <Route path="/admin/all_seller" element={<ProtectedRoute isAdmin={true}><AdminDashboard activeTab={6}><AdminAllSeller /></AdminDashboard></ProtectedRoute>} />
                <Route path="/admin/payouts" element={<ProtectedRoute isAdmin={true}><AdminDashboard activeTab={7}><AdminPayoutTable /></AdminDashboard></ProtectedRoute>} />
                   
                    {/* --- Seller Routes (Naye Add Kiya Hain) --- */}
                
                <Route path="/seller/dashboard" element={<ProtectedRoute isSeller={true}><SellerDashboard activeTab={0}><SellerMainData /></SellerDashboard></ProtectedRoute>} />
                <Route path="/seller/orders" element={<ProtectedRoute isSeller={true}><SellerDashboard activeTab={1}><SellerOrderTable /></SellerDashboard></ProtectedRoute>} />
                <Route path="/seller/products" element={<ProtectedRoute isSeller={true}><SellerDashboard activeTab={2}><SellerProductTable /></SellerDashboard></ProtectedRoute>} />
                <Route path="/seller/new_products" element={<ProtectedRoute isSeller={true}><SellerDashboard activeTab={3}><SellerNewProduct /></SellerDashboard></ProtectedRoute>} />
                <Route path="/seller/update-product/:id" element={<ProtectedRoute isSeller={true}><SellerDashboard activeTab={2}><SellerUpdateProduct /></SellerDashboard></ProtectedRoute>} /> 
                <Route path="/seller/order/:id" element={<ProtectedRoute isSeller={true}> <SellerDashboard activeTab={1}><AdminUpdateOrder /></SellerDashboard></ProtectedRoute> } />
                <Route path="/seller/withdrawal" element={<ProtectedRoute isSeller={true}><WithdrawalForm /></ProtectedRoute>} />
                <Route path="/sellerstore/Home" element={<ProtectedRoute isSeller={true}><SellerDashboard activeTab={0}><SellerMainData /></SellerDashboard></ProtectedRoute>} />
                <Route path='/seller/categories' element={ <ProtectedRoute isSeller={ true }><SellerDashboard activeTab={ 6 }><CategoryTable /></SellerDashboard></ProtectedRoute> } />
                <Route path='/seller/new-category' element={ <ProtectedRoute isSeller={ true }><SellerDashboard activeTab={ 6 }><NewCategory /></SellerDashboard></ProtectedRoute> } />
                <Route path="/seller/shop" element={ <ProtectedRoute isSeller={ true }><SellerDashboard activeTab={ 8 }><ShopSettings /></SellerDashboard></ProtectedRoute> } />
                {/* 404 Page */ }
                <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
        </>  
    );
}

export default App;