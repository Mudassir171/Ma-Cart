import { useSelector } from 'react-redux';
import MetaData from '../Layouts/MetaData';
import MinCategory from '../Layouts/MinCategory';
import Sidebar from '../User/Sidebar';
import Product from './Product';

const Wishlist = () => {
    // Redux state se wishlistItems nikalna
    const { wishlistItems } = useSelector((state) => state.wishlist);

    return (
        <>
            <MetaData title="Wishlist | Flipkart" />
            <MinCategory />
            
            <main className="w-full mt-12 sm:mt-0">
                <div className="flex gap-3.5 sm:w-11/12 sm:mt-4 m-auto mb-7">
                    
                    {/* Sidebar with active tab */}
                    <Sidebar activeTab={"wishlist"} />

                    <div className="flex-1 shadow bg-white">
                        <div className="flex flex-col">
                            <span className="font-medium text-lg px-4 sm:px-8 py-4 border-b">
                                My Wishlist ({wishlistItems?.length || 0})
                            </span>

                            {/* Empty Wishlist Case */}
                            {(!wishlistItems || wishlistItems.length === 0) ? (
                                <div className="flex items-center flex-col gap-2 m-6">
                                    <img 
                                        draggable="false" 
                                        className="object-contain" 
                                        src="https://static-assets-web.flixcart.com/www/linchpin/fk-cp-zion/img/mywishlist-empty_39f7a5.png" 
                                        alt="Empty Wishlist" 
                                    />
                                    <span className="text-lg font-medium mt-6">Empty Wishlist</span>
                                    <p className="text-gray-500 text-sm">You have no items in your wishlist. Start adding!</p>
                                </div>
                            ) : (
                                /* Mapping Items: Create a copy before reversing to prevent loop bugs */
                                [...wishlistItems].reverse().map((item, index) => (
                                    <Product {...item} key={item.product || index} />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Wishlist;