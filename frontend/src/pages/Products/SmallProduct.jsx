import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const SmallProduct = ({ product }) => {
  return (
    <div className="p-2 sm:p-3 bg-white rounded shadow text-black border relative group hover:shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out h-full">
      <div className="relative w-full h-48 md:h-56">
        {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover rounded"
        />
        {/* Heart Icon for favoriting */}
        <HeartIcon product={product} className="absolute top-2 right-2" />
        
        {/* View Details Button */}
        <Link
          to={`/product/${product._id}`}
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white font-semibold text-lg rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          View Details
        </Link>
      </div>
      <div className="p-4 flex flex-col justify-between h-full">
        {/* Product Name and Price */}
        <Link to={`/product/${product._id}`} className="block">
          <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
          <span className="bg-pink-100 text-pink-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300">
            ₹ {product.price}
          </span>
        </Link>
      </div>
    </div>
  );
};

export default SmallProduct;
