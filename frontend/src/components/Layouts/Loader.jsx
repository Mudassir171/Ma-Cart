import React from 'react';
// import logo from '../'; // Apna log../ yahan import karein

const Loader = () => {

  return (
    <div className="min-h-screen min-w-full flex flex-col items-center justify-center bg-white">
      <div className="relative flex items-center justify-center">
        
        {/* Ring 1: Fast Spinner */}
        <div className="absolute w-28 h-28 border-[3px] border-blue-600 border-t-transparent rounded-full animate-spin-fast"></div>
        
        {/* Ring 2: Slow Pulse Outer */}
        <div className="absolute w-32 h-32 border border-blue-100 rounded-full animate-ping-slow"></div>

        {/* Center: Pulsing Background */}
        <div className="absolute w-20 h-20 bg-blue-50 rounded-full animate-pulse-soft"></div>

        {/* Ma-Cart Icon */}
        <img 
          src="../assets/logo.png" 
          alt="Ma-Cart" 
          className="w-14 h-14 object-contain relative z-10 animate-bounce-gentle"
          onError={(e) => { 
            // Agar logo path galat ho toh default cart icon show hoga
            e.target.src = "https://cdn-icons-png.flaticon.com/512/1170/1170678.png" 
          }} 
        />
      </div>

      {/* Branded Loading Text */}
      <div className="mt-12 flex flex-col items-center">
        <h2 className="text-blue-600 font-bold text-xl tracking-[0.2em] mb-1">MA-CART</h2>
        <div className="w-24 h-1 bg-gray-100 overflow-hidden rounded-full">
            <div className="w-full h-full bg-blue-600 animate-loading-bar"></div>
        </div>
      </div>

      {/* Custom Keyframes - Inko global CSS mein dalne ki zaroorat nahi, yahi kaam karega */}
      <style jsx>{`
        @keyframes spin-fast {
          to { transform: rotate(360deg); }
        }
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes pulse-soft {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.2); opacity: 0.2; }
        }
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .animate-spin-fast { animation: spin-fast 0.8s linear infinite; }
        .animate-ping-slow { animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite; }
        .animate-pulse-soft { animation: pulse-soft 2s ease-in-out infinite; }
        .animate-bounce-gentle { animation: bounce-gentle 2s ease-in-out infinite; }
        .animate-loading-bar { animation: loading-bar 1.5s infinite linear; }
      `}</style>
    </div>
  );
};

export default Loader;