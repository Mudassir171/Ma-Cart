import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, isAdmin, isSeller }) => {

    const { loading, isAuthenticated, user } = useSelector(state => state.user);

    return (
        <>
            {loading === false && (
                isAuthenticated === false ? (
                    <Navigate to="/login" />
                ) : isAdmin && user.role !== "admin" ? (
                    <Navigate to="/login" />
                ) : isSeller && user.role !== "seller" && user.role !== "admin" ? (
                    // Note: Admin ko hum seller dashboard allow kar rahe hain testing ke liye
                    <Navigate to="/login" />
                ) : (
                    children
                )
            )}
        </>
    );
};

export default ProtectedRoute;