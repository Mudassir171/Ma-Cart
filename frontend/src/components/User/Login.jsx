import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, loginUser, loginSocialUser } from '../../actions/userAction'; 
import { useSnackbar } from 'notistack';
import { auth, googleProvider, signInWithPopup } from '../../firebase';
import BackdropLoader from '../Layouts/BackdropLoader';
import MetaData from '../Layouts/MetaData';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const location = useLocation();

    const { loading, isAuthenticated, error } = useSelector((state) => state.user);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        dispatch(loginUser(email, password));
    }

    // --- Google Login Function Optimized ---
    const handleGoogleLogin = async () => {
        try {
            // 1. Firebase Popup open karein
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            console.log("Firebase Login Success:", user.email);

            // 2. Data prepare karein
            const userData = {
                name: user.displayName,
                email: user.email,
                avatar: user.photoURL,
            };

            // 3. Redux action dispatch karein (Yahan check karein backend API chal rahi hai)
            dispatch(loginSocialUser(userData)); 
            
        } catch (error) {
            // Asli error code console mein check karein (e.g. auth/popup-closed-by-user)
            console.error("Detailed Google Error:", error.code, error.message);
            
            // User-friendly message
            const errorMessage = error.code === 'auth/popup-closed-by-user' 
                ? "Login cancelled by user" 
                : "Google Login Failed. Please try again.";
                
            enqueueSnackbar(errorMessage, { variant: "error" });
        }
    };
    // --- Google Login Function End ---

    const redirect = location.search ? location.search.split("=")[1] : "account";

    useEffect(() => {
        if (error) {
            enqueueSnackbar(error, { variant: "error" });
            dispatch(clearErrors());
        }
        if (isAuthenticated) {
            navigate(`/${redirect}`)
        }
    }, [dispatch, error, isAuthenticated, redirect, navigate, enqueueSnackbar]);

    return (
        <>
            <MetaData title="Login | Ma-Cart" />

            {loading && <BackdropLoader />}
            <main className="w-full min-h-screen bg-gray-100 flex items-center justify-center p-4">
                
                <div className="bg-white w-full max-w-md p-8 shadow-lg rounded-md">
                    
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-left">Login with Password</h2>

                    <form onSubmit={handleLogin} className="flex flex-col gap-5">
                        
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-gray-700">Phone Number or Email*</label>
                            <TextField
                                fullWidth
                                placeholder="Please enter your Phone Number or Email"
                                variant="outlined"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                size="small"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-semibold text-gray-700">Password*</label>
                                <Link to="/password/forgot" className="text-sm text-primary-blue hover:underline">Forgot Password?</Link>
                            </div>
                            <TextField
                                fullWidth
                                placeholder="Please enter your password"
                                variant="outlined"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                size="small"
                            />
                        </div>

                        <button type="submit" className="bg-green-800 text-white py-3 rounded-md font-bold text-lg shadow hover:bg-orange-600 transition duration-200 mt-4 uppercase">
                            Login
                        </button>

                    </form>

                    <div className="relative my-8 border-t border-gray-300">
                        <span className="absolute left-1/2 -top-3 -translate-x-1/2 bg-white px-4 text-gray-500 text-sm">
                            Or, login with
                        </span>
                    </div>

                    <div className="flex gap-4">


                        <button 
                            type="button" 
                            onClick={handleGoogleLogin} 
                            className="flex-1 flex items-center justify-center gap-2 border border-gray-300 py-2.5 rounded-md hover:bg-gray-50 transition font-medium"
                        >
                            <GoogleIcon />
                           Continue with Google
                        </button>
                    </div>

                    <div className="mt-8 text-center">
                        <Link to="/register" className="text-primary-blue font-medium hover:underline">
                            New to Ma-Cart? Create an account
                        </Link>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Login;