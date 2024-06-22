import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const Product = ({ product }) => {
  return (
    <div className="w-full bg-white rounded shadow text-black border p-3 sm:w-80 md:w-96 lg:w-112 xl:w-96">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full rounded"
        />
        <HeartIcon product={product} />
      </div>

      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h2 className="text-lg mb-2">{product.name}</h2>
          <span className="bg-pink-100 text-pink-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
            ₹ {product.price}
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Product;
