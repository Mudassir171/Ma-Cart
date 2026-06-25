import React from 'react';
import MetaData from '../Layouts/MetaData';
import { motion } from 'framer-motion'; // Animation ke liye: npm install framer-motion
import { CheckCircle, ShieldCheck, CreditCard, HelpCircle } from 'lucide-react'; // npm install lucide-react

import payment from '../../assets/images/cards.png';
import installment from '../../assets/images/installment.png';
import terms from '../../assets/images/terms.png';
import pay from '../../assets/images/pay.png';
import aproval from '../../assets/images/aproval.jpg';


const PaymentPage = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    return (
        <>
            <MetaData title="Installment Plans | Ma-Cart" />
            
            <main className="w-full bg-[#f8fafc] pb-20 font-sans">
                
                {/* 🚀 Hero Section: Modern & Sleek */}
                <section className="relative w-full bg-gradient-to-br from-indigo-900 via-purple-800 to-fuchsia-900 py-24 px-6 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-white rounded-full blur-3xl"></div>
                        <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-purple-400 rounded-full blur-3xl"></div>
                    </div>

                    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between relative z-5">
                        <motion.div {...fadeIn} className="text-center md:text-left mb-12 md:mb-0">
                            <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
                                Buy Now, <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-400">
                                    Pay Later.
                                </span>
                            </h1>
                            <p className="text-purple-100 text-lg max-w-md leading-relaxed opacity-90">
                                Experience the freedom of shopping with Ma-Cart's exclusive 0% interest installment plans.
                            </p>
                        </motion.div>
                        {/* background image ke sath ek modern card design */ }
                        
                        <img src={payment} alt="payment" className="w-full max-w-md h-auto bg-white p-4 rounded-lg shadow-lg" />
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="relative"
                        >
                            
                        </motion.div>
                    </div>
                </section>

                {/* 🏦 Partner Banks: Glassmorphism Card */}
                <div className="max-w-6xl mx-auto -mt-12 px-4 relative z-5">
                    <motion.div 
                        whileHover={{ y: -5 }}
                        className="bg-white/80 backdrop-blur-md rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20 p-10"
                    >
                        <p className="text-center text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-8">Trusted by Premium Banking Partners</p>
                        <img src={installment} alt="Installment Partners" className="mx-auto w-full h-full object-contain hover:grayscale-0 grayscale transition-all duration-500" />
                    </motion.div>
                </div>

                {/* 🛠️ How it Works: Step-by-Step Luxury */}
                <section className="max-w-6xl mx-auto mt-32 px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Simple 3-Step Process</h2>
                        <div className="h-1.5 w-20 bg-indigo-600 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            { step: "01", title: "Cart & Checkout", desc: "Select your favorite items (Min. Rs 10,000) and proceed to pay.", icon: <CreditCard className="w-8 h-8 text-indigo-500"/> },
                            { step: "02", title: "Instant Approval", desc: "Pick your bank and tenure. No long waits, just instant verification.", icon: <ShieldCheck className="w-8 h-8 text-indigo-500"/> },
                            { step: "03", title: "Order Success", desc: "Complete the OTP process and enjoy your product immediately!", icon: <CheckCircle className="w-8 h-8 text-indigo-500"/> }
                        ].map((item, index) => (
                            <motion.div 
                                key={index}
                                whileHover={{ y: -10 }}
                                className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 relative group overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <span className="text-8xl font-black">{item.step}</span>
                                </div>
                                <div className="bg-indigo-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
                                <p className="text-gray-500 leading-relaxed text-sm">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* 📄 Terms Section: Clean & Informative */}
                <section className="max-w-5xl mx-auto mt-32 px-6">
                    <div className="bg-indigo-900 rounded-[3rem] p-8 md:p-16 text-white flex flex-col md:flex-row items-center gap-12 shadow-2xl">
                        <div className="flex-1">
                            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                                <HelpCircle className="text-orange-400" /> Terms of Service
                            </h2>
                            <img src={terms} alt="Detailed Terms" className="rounded-2xl shadow-lg border border-white/10" />
                        </div>
                        <div className="flex-1 space-y-4">
                           <p className="text-indigo-200 leading-relaxed">
                                Hamara maqsad aapki shopping ko asaan banana hai. Ma-Cart EMI plans ke sath ab mehngi products aapki pohnch mein hain.
                           </p>
                           <ul className="space-y-3 text-sm opacity-80">
                               <li className="flex items-center gap-2">✓ Valid for all Credit Cards</li>
                               <li className="flex items-center gap-2">✓ 0% Markup on selected banks</li>
                               <li className="flex items-center gap-2">✓ Instant digital processing</li>
                           </ul>
                           <button className="mt-6 bg-white text-indigo-900 px-8 py-3 rounded-full font-bold hover:bg-orange-400 hover:text-white transition-all shadow-xl">
                               Contact Support
                           </button>
                        </div>
                    </div>
                    <p className="text-center mt-10 text-gray-400 text-xs tracking-widest uppercase">
                        Secure Payments Powered by Ma-Cart Gateway
                    </p>
                </section>
            </main>
        </>
    );
};

export default PaymentPage;