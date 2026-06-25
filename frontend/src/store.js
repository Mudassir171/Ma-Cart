import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { newPayoutReducer } from "./reducers/payoutReducer";
import { allPayoutsReducer } from "./reducers/payoutReducer";
// Reducers Import
import { 
    forgotPasswordReducer, 
    profileReducer, 
    userReducer, 
    allUsersReducer, 
    userDetailsReducer 
} from './reducers/userReducer';

import { 
    newProductReducer, 
    newReviewReducer, 
    productDetailsReducer, 
    productReducer, 
    productsReducer, 
    productReviewsReducer, 
    reviewReducer 
} from './reducers/productReducer';

import { cartReducer } from './reducers/cartReducer';
import { saveForLaterReducer } from './reducers/saveForLaterReducer';
import { wishlistReducer } from './reducers/wishlistReducer';

import { 
    allOrdersReducer, 
    myOrdersReducer, 
    newOrderReducer, 
    orderDetailsReducer, 
    orderReducer, 
    paymentStatusReducer 
} from './reducers/orderReducer';

// --- Category & Notification Reducers Import ---
import { 
    newCategoryReducer, 
    categoriesReducer, 
    categoryReducer 
} from './reducers/categoryReducer';

import { notificationReducer } from './reducers/notificationReducer'; // <-- Naya Import

const reducer = combineReducers({
    // User Reducers
    user: userReducer,
    profile: profileReducer,
    forgotPassword: forgotPasswordReducer,
    users: allUsersReducer,
    userDetails: userDetailsReducer,

    // Product Reducers
    products: productsReducer,
    productDetails: productDetailsReducer,
    newProduct: newProductReducer,
    product: productReducer,
    newReview: newReviewReducer,
    reviews: productReviewsReducer,
    review: reviewReducer,

    // Cart & Wishlist
    cart: cartReducer,
    saveForLater: saveForLaterReducer,
    wishlist: wishlistReducer,

    // Order Reducers
    newOrder: newOrderReducer,
    myOrders: myOrdersReducer,
    paymentStatus: paymentStatusReducer,
    orderDetails: orderDetailsReducer,
    allOrders: allOrdersReducer,
    order: orderReducer,

    // Category Reducers
    newCategory: newCategoryReducer,
    allCategories: categoriesReducer,
    category: categoryReducer,

    // --- Notification Reducer (Ab notification show hogi) ---
    notifications: notificationReducer, // <-- Ye line add ki hai
    newPayout: newPayoutReducer,
    allPayouts: allPayoutsReducer,
});

// Initial State Setup
// Initial State Setup
let initialState = {
    cart: {
        cartItems: localStorage.getItem('cartItems')
            ? JSON.parse(localStorage.getItem('cartItems'))
            : [],
        shippingInfo: localStorage.getItem("shippingInfo")
            ? JSON.parse(localStorage.getItem("shippingInfo"))
            : {},
    },
    saveForLater: {
        saveForLaterItems: localStorage.getItem('saveForLaterItems')
            ? JSON.parse(localStorage.getItem('saveForLaterItems'))
            : [],
    },
    wishlist: {
        wishlistItems: localStorage.getItem('wishlistItems')
            ? JSON.parse(localStorage.getItem('wishlistItems'))
            : [],
    },

    // --- Notifications ka data Load kar rahe hain ---
    notifications: {
        notifications: localStorage.getItem("notifications")
            ? JSON.parse(localStorage.getItem("notifications"))
            : [],
    },
};

const middleware = [thunk];

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;