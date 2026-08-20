import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Banner = () => {
  const settings = {
    autoplay: true,
    autoplaySpeed: 3500,
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    pauseOnHover: false,
  };

  // Main Slider ke liye 10 High-Quality Banners
  const mainBanners = [
    {
      img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80",
      tag: "MEGA SALE",
      title: "Electronics & Tech Deals",
      subtitle: "Up to 60% OFF",
    },
    {
      img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
      tag: "FASHION TRENDS",
      title: "New Summer Collection",
      subtitle: "Upgrade your style today",
    },
    {
      img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
      tag: "LUXURY",
      title: "Premium Smartwatches",
      subtitle: "Best prices on top brands",
    },
    {
      img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
      tag: "AUDIO EXCLUSIVE",
      title: "Wireless Headphones",
      subtitle: "Immersive sound experience",
    },
    {
      img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
      tag: "FOOTWEAR",
      title: "Trendy Sports Shoes",
      subtitle: "Step up your game",
    },
    {
      img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
      tag: "BEAUTY CARE",
      title: "Skincare Essentials",
      subtitle: "Glow with organic products",
    },
    {
      img: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1200&q=80",
      tag: "SMART GADGETS",
      title: "Home Automation Deals",
      subtitle: "Make life simpler",
    },
    {
      img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
      tag: "STORE WIDE",
      title: "Weekend Special Discount",
      subtitle: "Limited time stock",
    },
    {
      img: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1200&q=80",
      tag: "CAMERA & LENS",
      title: "Photography Gear Sale",
      subtitle: "Capture every moment",
    },
    {
      img: "https://images.unsplash.com/photo-1570857502809-08184874388e?auto=format&fit=crop&w=1200&q=80",
      tag: "FLASH SALE",
      title: "Super Saver Deals",
      subtitle: "Don't miss out!",
    },
  ];

  // Right Side Fixed Side-Banner Data
  const rightBanner = {
    img: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=800&q=80",
    badge: "SPECIAL OFFER",
    title: "Exclusive Gift Cards & Vouchers",
    subtitle: "Get Extra 15% Cashback",
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto  px-2 sm:px-4 py-4">
      {/* Grid Container: Desktop view mein Main Slider 3/4 space leta hai aur Right Banner 1/4 space */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-stretch">
        {/* Left Side: 10 Images Slider (lg:col-span-3) */}
        <div className="lg:col-span-3 relative overflow-hidden rounded-2xl shadow-xl border border-white/10 group">
          <Slider {...settings}>
            {mainBanners.map((item, index) => (
              <div key={index} className="relative outline-none">
                <div className="relative h-[240px] sm:h-[360px] md:h-[420px] w-full overflow-hidden">
                  <img
                    draggable="false"
                    className="w-full h-full object-cover transform scale-105 transition-transform duration-1000 group-hover:scale-100"
                    src={item.img}
                    alt={item.title}
                  />

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent flex flex-col justify-center px-6 sm:px-12 text-white">
                    <span className="inline-block w-max px-3 py-1 mb-2 text-xs font-semibold tracking-wider text-amber-400 bg-black/40 backdrop-blur-md rounded-full border border-amber-400/30">
                      {item.tag}
                    </span>
                    <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-md max-w-md">
                      {item.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-200 mt-1 sm:mt-2">
                      {item.subtitle}
                    </p>
                    <div className="mt-4">
                      <button className="px-4 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-bold text-black bg-white hover:bg-amber-400 transition-all duration-300 rounded-lg shadow-md hover:shadow-amber-400/30">
                        Shop Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>

        {/* Right Side: Fixed Promo Banner (lg:col-span-1) */}
        <div className="hidden lg:block lg:col-span-1 relative h-[200px] lg:h-auto rounded-2xl overflow-hidden shadow-xl border border-white/10 group">
          <img
            draggable="false"
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
            src={rightBanner.img}
            alt="Side Banner"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-5 text-white">
            <span className="w-max px-2.5 py-0.5 mb-2 text-[10px] font-bold tracking-wider text-black bg-amber-400 rounded-md uppercase">
              {rightBanner.badge}
            </span>
            <h3 className="text-base sm:text-lg font-bold leading-snug">
              {rightBanner.title}
            </h3>
            <p className="text-xs text-gray-300 mt-1">{rightBanner.subtitle}</p>
            <button className="mt-3 w-full py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 rounded-lg transition-colors shadow">
              Claim Offer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
