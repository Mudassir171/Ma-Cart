import React from 'react';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  return (
    <div className="bg-white min-h-screen font-sans">
      
      {/* 1. Header Hero Section (Flipkart Blue Style) */}
      <section className="bg-[#2874f0] py-16 md:py-24 text-center text-white px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">About MA-CART</h1>
        <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
          Your Trusted Destination for Quality and Convenience.
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        
        {/* 2. Our Journey Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">The MA-CART Story</h2>
            <p className="text-gray-600 leading-relaxed mb-4 text-lg">
              Launched in 2026, **Ma-Cart** has grown from a small startup to one of the most loved e-commerce platforms. Our journey began with a simple idea: <strong>"Customer First"</strong>.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6 text-lg">
              We bring millions of products across categories like Fashion, Electronics, and Home Essentials to your doorstep. Our mission is to provide an effortless shopping experience with the best prices.
            </p>
            <Link to="/">
              <button className="bg-[#fb641b] text-white px-10 py-3 rounded-sm font-bold shadow-md hover:shadow-lg transition-all uppercase tracking-wide">
                Start Shopping
              </button>
            </Link>
          </div>
          
          {/* Animated Image/Card */}
          <div className="order-1 md:order-2 flex justify-center">
            <div className="relative p-4 bg-gray-50 rounded-lg shadow-inner border border-gray-100 animate-float">
                <img 
                  src="/logo.png" 
                  alt="Ma-Cart Mission" 
                  className="w-full max-w-sm rounded shadow-xl"
                  onError={(e) => e.target.src = "https://via.placeholder.com/400x300?text=Ma-Cart+Success"}
                />
            </div>
          </div>
        </div>

        {/* 3. Animated Video Section */}
        <section className="mb-24">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800">Watch Our Journey</h2>
            <div className="w-20 h-1 bg-[#2874f0] mx-auto mt-2"></div>
          </div>
          <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border-8 border-white">
            <iframe 
              className="w-full aspect-video"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ" // Yahan apni video ka ID dalein
              title="Ma-Cart Video"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        </section>

        {/* 4. Why Choose Us (Iconic Features) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="p-8 text-center bg-white border border-gray-200 rounded hover:shadow-2xl transition-shadow duration-300 group">
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🚚</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Fastest Delivery</h3>
            <p className="text-gray-600">Across 1000+ cities with real-time tracking of your orders.</p>
          </div>
          <div className="p-8 text-center bg-white border border-gray-200 rounded hover:shadow-2xl transition-shadow duration-300 group">
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🛡️</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Secure Payments</h3>
            <p className="text-gray-600">Your transactions are safe with our multi-layer security systems.</p>
          </div>
          <div className="p-8 text-center bg-white border border-gray-200 rounded hover:shadow-2xl transition-shadow duration-300 group">
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">⭐</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Genuine Products</h3>
            <p className="text-gray-600">We work directly with brands to ensure 100% original items.</p>
          </div>
        </div>

      </div>

      {/* 5. Bottom Footer Blue Bar */}
      <div className="bg-gray-100 py-10 text-center border-t border-gray-200">
        <p className="text-gray-500 font-medium italic">"Transforming the way India shops, one click at a time."</p>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AboutUs;