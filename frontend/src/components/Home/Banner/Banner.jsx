import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './Banner.css';

const Banner = () => {

  const settings = {
    autoplay: true,
    autoplaySpeed: 5000, // 5 seconds
    dots: true,          // Added dots for better navigation without arrows
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,       // Completely hidden buttons/arrows
  };

  // 12 Daraz-style e-commerce banner image links
  const banners = [
    "https://graphicsfamily.com/wp-content/uploads/edd/2022/06/Free-E-commerce-Product-Banner-Design-with-Green-Colors-scaled.jpg",
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1200&q=80", // Gadgets
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjijGQHUvfmjnGjKnc_lwrd0pFkgbbJGeApfnDHan0ybcm7_NXJfwPcVY&s=10", // Fashion Sale
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4rzayl0tr8iV67KWiSTbpcbmIlkDG2EDZiH4K1B1Mvw&s=10", // Kitchen & Home
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3vcc8YhWmY370IttVO0THnuxxNUNhPhNt3yXSZmLrwg&s=10", // Smartphones
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80", // Electronics
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80", // Shopping Store
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80", // Watch Sale
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80", // Beauty & Care
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80", // Footwear
    "https://images.unsplash.com/photo-1520333789090-1afc82db536a?auto=format&fit=crop&w=1200&q=80", // Lifestyle
    "https://images.unsplash.com/photo-1570857502809-08184874388e?auto=format&fit=crop&w=1200&q=80"  // Flash Sale
  ];

  return (
    <>
      <section className="h-44 sm:h-72 w-full rounded-sm shadow relative overflow-hidden">
        <Slider {...settings}>
          {banners.map((el, i) => (
            <div key={i}>
              <img 
                draggable="false" 
                className="h-[500px] sm:h-72 w-full object-cover" 
                src={el} 
                alt={`banner-${i + 1}`} 
              />
            </div>
          ))}
        </Slider>
      </section>
    </>
  );
};

export default Banner;