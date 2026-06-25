import React, { useEffect, useState } from "react";
import axios from "axios";

import MetaData from "../Layouts/MetaData";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
import { useSnackbar } from "notistack";

const ShopSettings = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);

  const [logoPreview, setLogoPreview] = useState("");

  const [bannerPreview, setBannerPreview] = useState("");

  const [shop, setShop] = useState({
    shopName: "",
    phone: "",
    city: "",
    address: "",
    category: "",
    description: "",
    cnic: "",
    bank: "",
    logo: "",
    banner: "",
  });

  useEffect(() => {
    const loadShop = async () => {
      try {
        const { data } = await axios.get("/api/v1/seller/shop");

        if (data.shop) {
          setShop(data.shop);

          setLogoPreview(data.shop.logo);

          setBannerPreview(data.shop.banner);
        }
      } catch {
        enqueueSnackbar("Cannot Load Shop", {
          variant: "error",
        });
      }
    };

    loadShop();
  }, []);

  const inputHandler = (e) => {
    setShop({
      ...shop,

      [e.target.name]: e.target.value,
    });
  };

  const imageHandler = (e, type) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        if (type === "logo") {
          setLogoPreview(reader.result);

          setShop({
            ...shop,

            logo: reader.result,
          });
        } else {
          setBannerPreview(reader.result);

          setShop({
            ...shop,

            banner: reader.result,
          });
        }
      }
    };

    reader.readAsDataURL(file);
  };

  const updateShop = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const { data } = await axios.put(
        "/api/v1/seller/shop/update",

        shop,
      );

      if (data.success) {
        enqueueSnackbar(
          "Shop Updated",

          {
            variant: "success",
          },
        );
      }
    } catch (err) {
      enqueueSnackbar(
        err.response?.data?.message || "Update Failed",

        {
          variant: "error",
        },
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MetaData title="Shop Settings" />

      <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-indigo-100 py-10 px-5">
        <div
          className="
max-w-6xl
mx-auto
bg-white
rounded-[40px]
shadow-2xl
overflow-hidden
"
        >
          <div
            className="
bg-green-600
text-white
p-10
"
          >
            <h1
              className="
text-5xl
font-black
"
            >
              🏪 Shop Settings
            </h1>

            <p className="mt-3">Manage Your Store</p>
          </div>

          <form
            onSubmit={updateShop}
            className="
grid
md:grid-cols-2
gap-8
p-10
"
          >
            <input
              name="shopName"
              value={shop.shopName}
              onChange={inputHandler}
              placeholder="Shop Name"
              className="border rounded-2xl p-4"
            />

            <input
              name="phone"
              value={shop.phone}
              onChange={inputHandler}
              placeholder="Phone"
              className="border rounded-2xl p-4"
            />

            <input
              name="city"
              value={shop.city}
              onChange={inputHandler}
              placeholder="City"
              className="border rounded-2xl p-4"
            />

            <input
              name="cnic"
              value={shop.cnic}
              onChange={inputHandler}
              placeholder="CNIC"
              className="border rounded-2xl p-4"
            />

            <input
              name="bank"
              value={shop.bank}
              onChange={inputHandler}
              placeholder="Bank Account"
              className="border rounded-2xl p-4"
            />

            <select
              name="category"
              value={shop.category}
              onChange={inputHandler}
              className="
border
rounded-2xl
p-4
"
            >
              <option>Electronics</option>

              <option>Fashion</option>

              <option>Mobile</option>

              <option>Beauty</option>

              <option>Clothing</option>
            </select>

            <textarea
              rows="5"
              name="address"
              value={shop.address}
              onChange={inputHandler}
              placeholder="Address"
              className="
border
rounded-2xl
p-4
md:col-span-2
"
            />

            <textarea
              rows="5"
              name="description"
              value={shop.description}
              onChange={inputHandler}
              placeholder="Description"
              className="
border
rounded-2xl
p-4
md:col-span-2
"
            />

            <div
              className="
border-2
border-dashed
rounded-3xl
p-8
text-center
"
            >
              <label>Shop Logo</label>

              <input
                type="file"
                accept="image/*"
                className="mt-4"
                onChange={(e) => imageHandler(e, "logo")}
              />

              {logoPreview && (
                <img
                  src={logoPreview}
                  alt=""
                  className="
w-40
h-40
rounded-full
mx-auto
mt-5
object-cover
"
                />
              )}
            </div>

            <div
              className="
border-2
border-dashed
rounded-3xl
p-8
text-center
"
            >
              <label>Shop Banner</label>

              <input
                type="file"
                accept="image/*"
                className="mt-4"
                onChange={(e) => imageHandler(e, "banner")}
              />

              {bannerPreview && (
                <img
                  src={bannerPreview}
                  alt=""
                  className="
rounded-3xl
mt-5
h-48
w-full
object-cover
"
                />
              )}
            </div>

            <button
              disabled={loading}
              className="
md:col-span-2
bg-green-600
text-white
h-16
rounded-2xl
text-xl
font-bold
"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ShopSettings;
