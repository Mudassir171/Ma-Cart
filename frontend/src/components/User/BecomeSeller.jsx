import React, { useState } from "react";
import MetaData from "../Layouts/MetaData";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { loadUser } from "../../actions/userAction";

const BecomeSeller = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");

  const [shop, setShop] = useState({
    shopName: "", phone: "", address: "", city: "", category: "", 
    description: "", cnic: "", bank: "", logo: "", banner: "",
  });

  const inputHandler = (e) => setShop({ ...shop, [e.target.name]: e.target.value });

  const imageHandler = (e, type) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        if (type === "logo") { setLogoPreview(reader.result); setShop({ ...shop, logo: reader.result }); }
        else { setBannerPreview(reader.result); setShop({ ...shop, banner: reader.result }); }
      }
    };
    reader.readAsDataURL(file);
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put("/api/v1/become/seller", shop);
      enqueueSnackbar("Request Sent! Admin will review your shop.", { variant: "success" });
      navigate("/");
      dispatch(loadUser());
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || "Failed", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full h-14 bg-white/50 border border-indigo-100 rounded-2xl px-5 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all";

  return (
    <>
      <MetaData title="Launch Your Store" />
      <div className="min-h-screen bg-slate-50 py-12 px-4 flex items-center justify-center">
        <div className="max-w-4xl w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
          
          {/* Header Section */}
          <div className="bg-indigo-600 p-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full -mr-20 -mt-20 opacity-50 blur-3xl"></div>
            <h1 className="text-4xl font-extrabold relative">🚀 Launch Your Dream Brand</h1>
            <p className="mt-2 opacity-80 relative font-medium">Join thousands of successful sellers today.</p>
          </div>

          <form onSubmit={submit} className="p-10 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <input name="shopName" placeholder="Shop Name" required onChange={inputHandler} className={inputClass} />
              <input name="phone" placeholder="Phone Number" required onChange={inputHandler} className={inputClass} />
              <input name="city" placeholder="City" required onChange={inputHandler} className={inputClass} />
              <input name="cnic" placeholder="CNIC Number" required onChange={inputHandler} className={inputClass} />
              <input name="bank" placeholder="Bank Account Number" required onChange={inputHandler} className={inputClass} />
              <select name="category" onChange={inputHandler} className={inputClass}>
                <option>Select Category</option>
                {['Electronics', 'Fashion', 'Mobile', 'Clothing', 'Beauty'].map(cat => <option key={cat}>{cat}</option>)}
              </select>
            </div>

            <textarea name="address" placeholder="Shop Address" onChange={inputHandler} className={`${inputClass} h-24`} />
            <textarea name="description" placeholder="Short description about your shop..." onChange={inputHandler} className={`${inputClass} h-24`} />

            {/* Image Uploads */}
            <div className="grid md:grid-cols-2 gap-6">
              <UploadBox label="Shop Logo" onChange={(e) => imageHandler(e, "logo")} preview={logoPreview} isLogo />
              <UploadBox label="Shop Banner" onChange={(e) => imageHandler(e, "banner")} preview={bannerPreview} />
            </div>

            <button disabled={loading} className="w-full h-16 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-lg rounded-2xl transition-all shadow-lg hover:shadow-indigo-500/30">
              {loading ? "Processing..." : "✨ Launch My Shop"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

// Helper component for cleaner code
const UploadBox = ({ label, onChange, preview, isLogo }) => (
  <div className="border-2 border-dashed border-indigo-200 rounded-3xl p-6 text-center hover:border-indigo-400 transition-colors">
    <label className="block font-bold text-slate-700 mb-3">{label}</label>
    <input type="file" accept="image/*" onChange={onChange} className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
    {preview && <img src={preview} alt="preview" className={`mt-4 mx-auto object-cover shadow-md ${isLogo ? "w-24 h-24 rounded-full" : "w-full h-32 rounded-2xl"}`} />}
  </div>
);

export default BecomeSeller;