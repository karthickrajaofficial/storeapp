import { useSelector } from "react-redux";
import { selectFavoriteProduct } from "../../redux/features/favorites/favoriteSlice";
import Product from "./Product";

const Favorites = () => {
  const favorites = useSelector(selectFavoriteProduct);

  return (
    <div className="px-4 lg:px-20 mt-20 mb-20">
      <h1 className="text-lg font-bold mb-6">Favorite Products</h1>
      <div className="flex flex-wrap justify-center lg:justify-start gap-4">
        {favorites.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Favorites;
