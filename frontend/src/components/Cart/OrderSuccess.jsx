import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MetaData from '../Layouts/MetaData';
import successfull from '../../assets/images/Transaction/success.png';
import failed from '../../assets/images/Transaction/failed.png';

const OrderSuccess = ({ success }) => {
    const navigate = useNavigate();
    const [time, setTime] = useState(3);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime((prevTime) => prevTime - 1);
        }, 1000);

        if (time === 0) {
            clearInterval(intervalId);
            if (success) {
                navigate("/orders");
            } else {
                navigate("/cart");
            }
        }

        return () => clearInterval(intervalId);
    }, [time, navigate, success]);

    return (
        <>
            <MetaData title={`Transaction ${success ? "Successful" : "Failed"}`} />
            <main className="w-full mt-20">
                <div className="flex flex-col gap-2 items-center justify-center sm:w-4/6 sm:mt-4 m-auto mb-7 bg-white shadow rounded p-6 pb-12">
                    <img 
                        draggable="false" 
                        className="w-1/2 h-60 object-contain" 
                        src={success ? successfull : failed} 
                        alt="Transaction Status" 
                    />
                    <h1 className={`text-2xl font-semibold ${success ? "text-green-600" : "text-red-600"}`}>
                        Transaction {success ? "Successful" : "Failed"}
                    </h1>
                    <p className="mt-4 text-lg text-gray-800">
                        Redirecting to {success ? "orders" : "cart"} in <span className="font-bold">{time}</span> sec
                    </p>
                    <Link 
                        to={success ? "/orders" : "/cart"} 
                        className={`${success ? "bg-primary-blue" : "bg-red-500"} mt-2 py-2.5 px-6 text-white uppercase shadow hover:shadow-lg rounded-sm transition-all`}
                    >
                        go to {success ? "orders" : "cart"}
                    </Link>
                </div>
            </main>
        </>
    );
};

export default OrderSuccess;