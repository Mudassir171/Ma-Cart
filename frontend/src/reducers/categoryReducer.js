// 1. Saari Categories fetch karne ke liye
export const categoriesReducer = (state = { categories: [] }, action) => {
    switch (action.type) {
        case "ALL_CATEGORIES_REQUEST":
            return { loading: true, categories: [] };
        case "ALL_CATEGORIES_SUCCESS":
            return { loading: false, categories: action.payload };
        case "ALL_CATEGORIES_FAIL":
            return { loading: false, error: action.payload };
        case "CLEAR_ERRORS": // Error clear karne ke liye
            return { ...state, error: null };
        default:
            return state;
    }
};

// 2. Nayi Category banane ke liye
export const newCategoryReducer = (state = { category: {} }, action) => {
    switch (action.type) {
        case "NEW_CATEGORY_REQUEST":
            return { ...state, loading: true };
        case "NEW_CATEGORY_SUCCESS":
            return { 
                loading: false, 
                success: action.payload.success, 
                category: action.payload.category 
            };
        case "NEW_CATEGORY_FAIL":
            return { ...state, loading: false, error: action.payload };
        case "NEW_CATEGORY_RESET":
            return { ...state, success: false };
        case "CLEAR_ERRORS":
            return { ...state, error: null };
        default:
            return state;
    }
};

// 3. Category Update aur Delete karne ke liye
export const categoryReducer = (state = {}, action) => {
    switch (action.type) {
        case "UPDATE_CATEGORY_REQUEST":
        case "DELETE_CATEGORY_REQUEST":
            return { ...state, loading: true };

        case "UPDATE_CATEGORY_SUCCESS":
            return { ...state, loading: false, isUpdated: action.payload };

        case "DELETE_CATEGORY_SUCCESS":
            return { ...state, loading: false, isDeleted: action.payload };

        case "UPDATE_CATEGORY_FAIL":
        case "DELETE_CATEGORY_FAIL":
            return { ...state, loading: false, error: action.payload };

        case "UPDATE_CATEGORY_RESET":
            return { ...state, isUpdated: false };

        case "DELETE_CATEGORY_RESET":
            return { ...state, isDeleted: false };

        case "CLEAR_ERRORS":
            return { ...state, error: null };

        default:
            return state;
    }
};