import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const SmallProduct = ({ product }) => {
  return (
    <div className="p-2 sm:p-3 bg-white rounded shadow text-black border">
      <div className="relative">
        {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-auto rounded"
        />
        {/* Heart Icon for favoriting */}
        <HeartIcon product={product} className="absolute top-2 right-2" />
      </div>
      <div className="p-4">
        {/* Link to product details */}
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
