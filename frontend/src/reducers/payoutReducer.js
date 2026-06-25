import {
    PAYOUT_REQUEST_REQUEST,
    PAYOUT_REQUEST_SUCCESS,
    PAYOUT_REQUEST_FAIL,
    CLEAR_ERRORS,
} from "../constants/payoutConstants";

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
export const allPayoutsReducer = (state = { payouts: [] }, action) => {
    switch (action.type) {
        case "GET_PAYOUTS_REQUEST":
            return {
                loading: true,
                payouts: [],
            };
        case "GET_PAYOUTS_SUCCESS":
            return {
                loading: false,
                payouts: action.payload,
            };
        case "GET_PAYOUTS_FAIL":
            return {
                loading: false,
                error: action.payload,
            };
        case "CLEAR_ERRORS":
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};