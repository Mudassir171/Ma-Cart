import axios from "axios";

// 1. Get All Categories
export const getCategories = () => async (dispatch) => {
    try {
        dispatch({ type: "ALL_CATEGORIES_REQUEST" });
        const { data } = await axios.get("/api/v1/categories");

        dispatch({
            type: "ALL_CATEGORIES_SUCCESS",
            payload: data.categories,
        });
    } catch (error) {
        dispatch({
            type: "ALL_CATEGORIES_FAIL",
            payload: error.response.data.message,
        });
    }
};

// 2. Create Category
export const createCategory = (categoryData) => async (dispatch) => {
    try {
        dispatch({ type: "NEW_CATEGORY_REQUEST" });

        // CHANGE: "multipart/form-data" istemal karein kyunke types array aur image bhej rahe hain
        const config = { headers: { "Content-Type": "multipart/form-data" } };

        const { data } = await axios.post(`/api/v1/admin/category/new`, categoryData, config);

        dispatch({
            type: "NEW_CATEGORY_SUCCESS",
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: "NEW_CATEGORY_FAIL",
            payload: error.response.data.message,
        });
    }
};

// 3. Update Category
export const updateCategory = (id, categoryData) => async (dispatch) => {
    try {
        dispatch({ type: "UPDATE_CATEGORY_REQUEST" });

        // CHANGE: Yahan bhi multipart/form-data rakhein
        const config = { headers: { "Content-Type": "multipart/form-data" } };

        const { data } = await axios.put(`/api/v1/admin/category/${id}`, categoryData, config);

        dispatch({
            type: "UPDATE_CATEGORY_SUCCESS",
            payload: data.success,
        });
    } catch (error) {
        dispatch({
            type: "UPDATE_CATEGORY_FAIL",
            payload: error.response.data.message,
        });
    }
};

// 4. Delete Category (Same as before)
export const deleteCategory = (id) => async (dispatch) => {
    try {
        dispatch({ type: "DELETE_CATEGORY_REQUEST" });
        const { data } = await axios.delete(`/api/v1/admin/category/${id}`);
        dispatch({
            type: "DELETE_CATEGORY_SUCCESS",
            payload: data.success,
        });
    } catch (error) {
        dispatch({
            type: "DELETE_CATEGORY_FAIL",
            payload: error.response.data.message,
        });
    }
};

// 5. Clear Errors
export const clearErrors = () => async (dispatch) => {
    dispatch({ type: "CLEAR_ERRORS" });
};
// 6. Approve Category (Status Update)
export const approveCategory = (id, statusData) => async (dispatch) => {
    try {
        dispatch({ type: "APPROVE_CATEGORY_REQUEST" });

        const config = { headers: { "Content-Type": "application/json" } };
        const { data } = await axios.put(`/api/v1/admin/category/status/${id}`, statusData, config);

        dispatch({
            type: "APPROVE_CATEGORY_SUCCESS",
            payload: data.success,
        });
    } catch (error) {
        dispatch({
            type: "APPROVE_CATEGORY_FAIL",
            payload: error.response.data.message,
        });
    }
};