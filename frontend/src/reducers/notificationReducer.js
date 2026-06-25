/**
 * MA-CART Notification Reducer
 * Features: LocalStorage Persistent, Delete One, Clear All, Mark as Read
 */

export const notificationReducer = (state = { notifications: [] }, action) => {
    switch (action.type) {

        // 1. Nayi Notification Add karna aur LocalStorage mein save karna
        case "ADD_NOTIFICATION":
            const updatedAdd = [...state.notifications, action.payload];
            localStorage.setItem("notifications", JSON.stringify(updatedAdd));
            return {
                ...state,
                notifications: updatedAdd,
            };

        // 2. Specific Notification delete karna ID ki bunyad par
        case "DELETE_NOTIFICATION":
            const updatedDelete = state.notifications.filter(
                (item) => item.id !== action.payload
            );
            localStorage.setItem("notifications", JSON.stringify(updatedDelete));
            return {
                ...state,
                notifications: updatedDelete,
            };

        // 3. Tamam Notifications ko aik sath khatam karna
        case "CLEAR_NOTIFICATIONS":
            localStorage.removeItem("notifications");
            return {
                ...state,
                notifications: [],
            };

        // 4. Notification par click hone par Blue Dot hatane ke liye
        case "MARK_AS_READ":
            const updatedRead = state.notifications.map((item) =>
                item.id === action.payload ? { ...item, isRead: true } : item
            );
            localStorage.setItem("notifications", JSON.stringify(updatedRead));
            return {
                ...state,
                notifications: updatedRead,
            };

        default:
            return state;
    }
};