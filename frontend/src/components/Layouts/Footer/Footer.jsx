import WorkIcon from "@mui/icons-material/Work";
import StarsIcon from "@mui/icons-material/Stars";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import HelpIcon from "@mui/icons-material/Help";
import paymentMethods from "../../../assets/images/payment-methods.svg";
import { Link } from "react-router-dom";

const footerLinks = [
  {
    title: "About Ma-Cart",
    links: [
      { name: "Home", redirect: "/" },
      { name: "About Us", redirect: "/about-us" },
      { name: "Contact Us", redirect: "/contact-us" },
      { name: "Shop All Products", redirect: "/products" },
    ],
  },
  {
    title: "Customer Help",
    links: [
      { name: "Digital Payment", redirect: "/payment-page" },
      { name: "Shipping", redirect: "/shipping" },
      { name: "Track Orders", redirect: "/orders" },
      { name: "My Wishlist", redirect: "/wishlist" },
    ],
  },
  {
    title: "Policies",
    links: [
      { name: "Return Policy", redirect: "/contact-us" },
      { name: "Terms Of Use", redirect: "/about-us" },
      { name: "Security", redirect: "/about-us" },
      { name: "Privacy", redirect: "/about-us" },
    ],
  },
  {
    title: "social",
    links: [
      { name: "Facebook", redirect: "https://www.facebook.com/" },
      { name: "Twitter", redirect: "https://twitter.com/" },
      { name: "Instagram", redirect: "https://instagram.com/" },
    ],
  },
];

const Footer = () => {
  return (
    <>
      <footer className="mt-20 w-full py-8 px-4 sm:px-12 bg-primary-darkBlue text-white text-xs border-b border-gray-600 flex flex-col sm:flex-row overflow-hidden">
        <div className="w-full sm:w-7/12 flex flex-col sm:flex-row">
          {footerLinks.map((el, i) => (
            <div
              className="w-full sm:w-1/4 flex flex-col gap-2 my-3 sm:my-2 sm:ml-5"
              key={i}
            >
              <h2 className="text-primary-grey mb-2 uppercase font-semibold tracking-wide">
                {el.title}
              </h2>
              {el.links.map((item, index) =>
                item.redirect.startsWith("http") ? (
                  <a
                    href={item.redirect}
                    key={index}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-primary-blue transition-colors"
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    to={item.redirect}
                    key={index}
                    className="hover:text-primary-blue transition-colors"
                  >
                    {item.name}
                  </Link>
                ),
              )}
            </div>
          ))}
        </div>

        <div className="border-gray-600 h-36 w-1 border-l mr-5 mt-6 hidden sm:block"></div>

        <div className="w-full sm:w-5/12 my-3 sm:my-2 mx-5 sm:mx-0 flex flex-col sm:flex-row gap-5 sm:gap-0 justify-between">
          <div className="w-full sm:w-1/2">
            <h2 className="text-primary-grey font-semibold">Mail Us:</h2>
            <p className="mt-2 leading-5 text-gray-300">
              Punjab, Pakistan <br />
              Jhang Lalian Road, Adda Sheikhan,
              <br />
              Chiniot, 35400,
              <br />
              Pakistan
            </p>
          </div>

          <div className="w-full sm:w-1/2">
            <h2 className="text-primary-grey font-semibold">
              Registered Office Address:
            </h2>
            <p className="mt-2 leading-5 text-gray-300">
              Punjab, Pakistan <br />
              Jhang Lalian Road, Adda Sheikhan,
              <br />
              Chiniot, 35400,
              <br />
              Pakistan <br />
              Telephone: <span className="text-primary-blue">0321 7395255</span>
            </p>
          </div>
        </div>
      </footer>

      <div className="px-4 sm:px-16 py-6 w-full bg-primary-darkBlue flex flex-wrap gap-5 sm:gap-0 justify-between items-center text-sm text-white">
        <Link
          to="/become-seller"
          className="flex items-center gap-2 hover:text-primary-blue transition-colors"
        >
          <span className="text-yellow-400">
            <WorkIcon sx={{ fontSize: "18px" }} />
          </span>
          <span>Become a Seller</span>
        </Link>
        <Link
          to="/contact-us"
          className="flex items-center gap-2 hover:text-primary-blue transition-colors"
        >
          <span className="text-yellow-400">
            <StarsIcon sx={{ fontSize: "18px" }} />
          </span>
          <span>Advertise</span>
        </Link>
        <Link
          to="/contact-us"
          className="flex items-center gap-2 hover:text-primary-blue transition-colors"
        >
          <span className="text-yellow-400">
            <CardGiftcardIcon sx={{ fontSize: "18px" }} />
          </span>
          <span>Gift Cards</span>
        </Link>
        <Link
          to="/contact-us"
          className="flex items-center gap-2 hover:text-primary-blue transition-colors"
        >
          <span className="text-yellow-400">
            <HelpIcon sx={{ fontSize: "18px" }} />
          </span>
          <span>Help Center</span>
        </Link>

        <span className="text-gray-400">
          &copy; {new Date().getFullYear()} MA-CART.com
        </span>
        <img
          draggable="false"
          src={paymentMethods}
          alt="Payment Methods"
          className="h-6"
        />
      </div>
    </>
  );
};

export default Footer;
