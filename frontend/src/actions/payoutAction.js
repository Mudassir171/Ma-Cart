import axios from "axios";
import {
    PAYOUT_REQUEST_REQUEST, PAYOUT_REQUEST_SUCCESS, PAYOUT_REQUEST_FAIL,
    GET_PAYOUTS_REQUEST, GET_PAYOUTS_SUCCESS, GET_PAYOUTS_FAIL,
    APPROVE_PAYOUT_REQUEST, APPROVE_PAYOUT_SUCCESS, APPROVE_PAYOUT_FAIL,
    REJECT_PAYOUT_REQUEST, REJECT_PAYOUT_SUCCESS, REJECT_PAYOUT_FAIL,
    CLEAR_ERRORS,
} from "../constants/payoutConstants";

// 1. Request Payout
export const requestPayout = (payoutData) => async (dispatch) => {
    try {
        dispatch({ type: PAYOUT_REQUEST_REQUEST });
        const { data } = await axios.post(`/api/v1/payout/new`, payoutData);
        dispatch({ type: PAYOUT_REQUEST_SUCCESS, payload: data.payout });
    } catch (error) {
        dispatch({ type: PAYOUT_REQUEST_FAIL, payload: error.response.data.message });
    }
};

// 2. Get All Payouts (Admin)
export const getAllPayouts = () => async (dispatch) => {
    try {
        dispatch({ type: GET_PAYOUTS_REQUEST });
        const { data } = await axios.get(`/api/v1/admin/payouts`);
        dispatch({ type: GET_PAYOUTS_SUCCESS, payload: data.payouts });
    } catch (error) {
        dispatch({ type: GET_PAYOUTS_FAIL, payload: error.response.data.message });
    }
};

// 3. Approve Payout (Admin)
export const approvePayout = (id) => async (dispatch) => {
    try {
        dispatch({ type: APPROVE_PAYOUT_REQUEST });
        const { data } = await axios.put(`/api/v1/admin/payout/${id}/approve`);
        dispatch({ type: APPROVE_PAYOUT_SUCCESS, payload: data.message });
    } catch (error) {
        dispatch({ type: APPROVE_PAYOUT_FAIL, payload: error.response.data.message });
    }
};

// 4. Reject Payout (Admin)
export const rejectPayout = (id) => async (dispatch) => {
    try {
        dispatch({ type: REJECT_PAYOUT_REQUEST });
        const { data } = await axios.put(`/api/v1/admin/payout/${id}/reject`);
        dispatch({ type: REJECT_PAYOUT_SUCCESS, payload: data.message });
    } catch (error) {
        dispatch({ type: REJECT_PAYOUT_FAIL, payload: error.response.data.message });
    }
};

export const clearErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
};