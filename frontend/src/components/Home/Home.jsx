import { useEffect } from 'react';
import Categories from '../Layouts/Categories';
import Banner from './Banner/Banner';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, getSliderProducts } from '../../actions/productAction';
import { useSnackbar } from 'notistack';
import MetaData from '../Layouts/MetaData';
import Product from './ProductSlider/Product';
import { Link } from 'react-router-dom';

const Home = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { error, loading, products } = useSelector((state) => state.products);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }
    dispatch(getSliderProducts());
  }, [dispatch, error, enqueueSnackbar]);

  return (
    <>
      <MetaData title="Daraz.pk | Online Shopping Site" />

      {/* 1. Main Background Wrapper */ }
      <main className="w-full bg-[#f4f4f4] min-h-screen pb-10 overflow-x-hidden mt-5">

        {/* 2. Full Width Banner Section */ }

        <div className="w-full mt-12 bg-white shadow-sm ">
          <Banner />
        </div>

        {/* --- Content Container (Maximum Width 1200px) --- */ }
        <div className="max-w-[1360px] mx-auto px-2 sm:px-4 flex flex-col gap-6">

          {/* 3. FLASH SALE SECTION */ }
          <section className="bg-white rounded-sm shadow-sm overflow-hidden">
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
              <span className="text-green-800 font-bold text-lg uppercase">Flash Sale</span>
              <Link to="/products" className="border border-green-800 text-green-800 rounded-sm px-5 py-2 text-sm font-semibold hover:bg-green-800 hover:text-white transition-all duration-300">
                SHOP ALL PRODUCTS
              </Link>
            </div>

            {/* Grid for Flash Sale (6 items per row on desktop) */ }
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              { !loading && products?.slice(0, 6).map((item) => (
                <div key={ item._id } className="border-r border-b border-gray-100 last:border-r-0">
                  <Product { ...item } />
                </div>
              )) }
            </div>
          </section>

          {/* 4. CATEGORIES SECTION */ }
          <section>
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-green-700 text-xl font-medium">Categories</h2>
              <div className="h-[1px] bg-gray-300 flex-1"></div>
            </div>
              <div className="bg-white rounded-sm shadow-sm p-2">
                <Categories />
              </div>
          </section>

          {/* 5. JUST FOR YOU (Main Product Grid) */ }
          <section className="mt-2">
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-green-700 text-xl font-medium">Just For You</h2>
              <div className="h-[1px] bg-gray-300 flex-1"></div>
            </div>

            {/* Responsive Grid: 2 columns mobile, 6 columns desktop */ }
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              { !loading && products && products.slice(0, 30).map((item) => (
                <div key={ item._id } className="h-full">
                  <Product { ...item } />
                </div>
              )) }
            </div>

            {/* Loading Skeleton Placeholder */ }
            { loading && (
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 py-10">
                { [...Array(6)].map((_, i) => (
                  <div key={ i } className="h-64 bg-white animate-pulse rounded-sm shadow-sm"></div>
                )) }
              </div>
            ) }
          </section>

        </div>
      </main>
    </>
  );
};

export default Home;