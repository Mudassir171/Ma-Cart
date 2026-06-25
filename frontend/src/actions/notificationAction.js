// Example Action (notificationAction.js)
export const addNotification = (data) => (dispatch) => {
    dispatch({
        type: "ADD_NOTIFICATION",
        payload: {
            id: Date.now(),
            title: data.title,
            message: data.message,
            createdAt: new Date().toLocaleString(),
            isRead: false,
            type: data.type
        }
    });
};