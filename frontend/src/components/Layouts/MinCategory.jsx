import { useSelector } from 'react-redux';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Link } from 'react-router-dom';

const MinCategory = () => {
    const { categories, loading } = useSelector((state) => state.allCategories);

    if (loading || !categories || !Array.isArray(categories)) {
        return null;
    }

    return (
        /* - 'relative': Taake scroll normal ho.
           - 'z-30': Header (z-50) se hamesha neeche rahega.
           - 'mt-[56px]': Fixed header ki wajah se top se gap.
        */
        <section className="hidden sm:block bg-white w-full border-b shadow-sm relative z-7 mt-[56px]">
            <div className="flex items-center justify-start gap-2 max-w-screen-2xl mx-auto px-12">
                {categories
                    .filter(cat => cat && cat.name && cat.types && cat.types.length > 0)
                    .map((cat) => (
                        <div key={cat._id} className="relative group">
                            
                            <Link 
                                to={`/products?category=${encodeURIComponent(cat.name)}`} 
                                className="capitalize text-[13px] p-3 text-gray-700 z-7 font-medium hover:text-primary-blue flex items-center gap-0.5 whitespace-nowrap"
                            >
                                {cat.name} 
                                <span className="text-gray-400 group-hover:text-primary-blue transition-transform duration-300 group-hover:rotate-180">
                                    <ExpandMoreIcon sx={{ fontSize: "16px" }} />
                                </span>
                            </Link>

                            {/* Dropdown - Iska z-index header se kam hona chahiye taake scroll par header ke neeche jaye */}
                            <div className="absolute top-full left-0 hidden group-hover:flex flex-col bg-white shadow-2xl border border-gray-100 min-w-[200px] py-2 z-9 rounded-b-md">
                                {cat.types.map((type, index) => (
                                    <Link
                                        key={index}
                                        to={`/products?category=${encodeURIComponent(cat.name)}&type=${encodeURIComponent(type)}`}
                                        className="px-5 py-2.5 uppercase text-[10px] text-gray-600 hover:bg-blue-50 hover:text-primary-blue font-bold transition-all border-l-4 border-transparent hover:border-primary-blue"
                                    >
                                        {type}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))
                }
            </div>
        </section>
    );
};

export default MinCategory;