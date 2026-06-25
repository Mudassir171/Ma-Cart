import React from "react";
import { Link, useNavigate } from "react-router-dom";

import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import InventoryIcon from "@mui/icons-material/Inventory";
import GroupIcon from "@mui/icons-material/Group";
import ReviewsIcon from "@mui/icons-material/Reviews";
import AddBoxIcon from "@mui/icons-material/AddBox";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import StoreIcon from "@mui/icons-material/Store";
import HomeIcon from "@mui/icons-material/Home";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import PaymentsIcon from "@mui/icons-material/Payments";
import CloseIcon from "@mui/icons-material/Close";
import CategoryIcon from "@mui/icons-material/Category";
import AddCircleIcon from "@mui/icons-material/AddCircle";

import Avatar from "@mui/material/Avatar";

import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";

import { logoutUser } from "../../../actions/userAction";

import "./Sidebar.css";

const SellerSidebar = ({ activeTab, setToggleSidebar }) => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const { user } = useSelector((state) => state.user);

  const navMenu = [
   

    {
      icon: <DashboardIcon />,
      label: "Dashboard",
      ref: "/seller/dashboard",
    },
     {
      icon: <HomeIcon />,
      label: "Home",
      // Agar store ID user ke andar hai toh: user.shopId ya user._id
      ref: `/sellerstore/${user?._id}`,
    },

    {
      icon: <InventoryIcon />,
      label: "Products",
      ref: "/seller/products",
    },
    

    {
      icon: <AddBoxIcon />,
      label: "Add Product",
      ref: "/seller/new_products",
    },

    {
      icon: <CategoryIcon />,
      label: "Categories",
      ref: "/seller/categories",
    },

    {
      icon: <AddCircleIcon />,
      label: "Add Category",
      ref: "/seller/new-category",
    },

    {
      icon: <ShoppingBagIcon />,
      label: "Orders",
      ref: "/seller/orders",
    },

    {
      icon: <GroupIcon />,
      label: "Customers",
      ref: "/seller/customers",
    },

    {
      icon: <AnalyticsIcon />,
      label: "Analytics",
      ref: "/seller/analytics",
    },

    {
      icon: <PaymentsIcon />,
      label: "Withdraw",
      ref: "/seller/withdrawal",
    },

    {
      icon: <ReviewsIcon />,
      label: "Reviews",
      ref: "/seller/reviews",
    },

    {
      icon: <StoreIcon />,
      label: "Shop Settings",
      ref: "/seller/shop",
    },

    {
      icon: <AccountBoxIcon />,
      label: "Profile",
      ref: "/account",
    },

    {
      icon: <LogoutIcon />,
      label: "Logout",
    },
  ];
  const handleLogout = () => {
    dispatch(logoutUser());

    enqueueSnackbar("Logout Successfully", {
      variant: "success",
    });

    navigate("/login");
  };

  return (
   <aside className="sidebar z-10 sm:z-0 block min-h-screen fixed left-0 pb-14 max-h-screen w-3/4 sm:w-1/5 bg-gray-800 text-white overflow-x-hidden border-r">
            <div className="flex items-center gap-3 bg-gray-700 p-2 rounded-lg shadow-lg my-4 mx-3.5">
        <Avatar src={user?.avatar?.url} />

        <div>
          <h2 className="font-semibold">{user?.name}</h2>

          <p className="text-sm text-gray-300">{user?.email}</p>
        </div>

        <button
          onClick={() => setToggleSidebar(false)}
          className="ml-auto sm:hidden"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="mt-6">
        {navMenu.map((item, index) =>
          item.label === "Logout" ? (
            <button
              key={index}
              onClick={handleLogout}
              className="w-full text-left px-5 py-4 flex gap-3 hover:bg-slate-800"
            >
              {item.icon}

              <span>{item.label}</span>
            </button>
          ) : (
            <Link
              key={index}
              to={item.ref}
              className={`flex px-5 py-4 gap-3

${activeTab === index ? "bg-green-600" : "hover:bg-slate-800"}`}
            >
              {item.icon}

              <span>{item.label}</span>
            </Link>
          ),
        )}
      </div>
    </aside>
  );
};

export default SellerSidebar;
