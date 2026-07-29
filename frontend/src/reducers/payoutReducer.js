import {
    PAYOUT_REQUEST_REQUEST,
    PAYOUT_REQUEST_SUCCESS,
    PAYOUT_REQUEST_FAIL,
    GET_PAYOUTS_REQUEST,
    GET_PAYOUTS_SUCCESS,
    GET_PAYOUTS_FAIL,
    APPROVE_PAYOUT_REQUEST,
    APPROVE_PAYOUT_SUCCESS,
    APPROVE_PAYOUT_FAIL,
    REJECT_PAYOUT_REQUEST,
    REJECT_PAYOUT_SUCCESS,
    REJECT_PAYOUT_FAIL,
    CLEAR_ERRORS,
} from "../constants/payoutConstants";

// 1. New Payout Request Reducer
export const newPayoutReducer = (state = {}, { type, payload }) => {
    switch (type) {
        case PAYOUT_REQUEST_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case PAYOUT_REQUEST_SUCCESS:
            return {
                loading: false,
                payout: payload,
                success: true,
            };
        case PAYOUT_REQUEST_FAIL:
            return {
                ...state,
                loading: false,
                error: payload,
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};

// 2. Get All Payouts Reducer (Admin)
export const allPayoutsReducer = (state = { payouts: [] }, action) => {
    switch (action.type) {
        case GET_PAYOUTS_REQUEST:
            return {
                loading: true,
                payouts: [],
            };
        case GET_PAYOUTS_SUCCESS:
            return {
                loading: false,
                payouts: action.payload,
            };
        case GET_PAYOUTS_FAIL:
            return {
                loading: false,
                error: action.payload,
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};

// 3. Payout Management Reducer (For Approve & Reject Actions)
export const payoutReducer = (state = {}, action) => {
    switch (action.type) {
        case APPROVE_PAYOUT_REQUEST:
        case REJECT_PAYOUT_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case APPROVE_PAYOUT_SUCCESS:
        case REJECT_PAYOUT_SUCCESS:
            return {
                ...state,
                loading: false,
                isUpdated: true,
                message: action.payload,
            };
        case APPROVE_PAYOUT_FAIL:
        case REJECT_PAYOUT_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case "APPROVE_PAYOUT_RESET":
        case "REJECT_PAYOUT_RESET":
            return {
                ...state,
                isUpdated: false,
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};