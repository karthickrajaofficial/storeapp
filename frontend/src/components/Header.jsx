import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";
import SmallProduct from "../pages/Products/SmallProduct";
import ProductCarousel from "../pages/Products/ProductCarousel";

const Header = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <h1>ERROR</h1>;
  }

  return (
    <div className="flex flex-col lg:flex-row mt-10 justify-around">
      <div className="lg:w-1/2 w-full ">
        <div className="grid grid-cols-2 gap-3">
          {data.map((product) => (
            <div key={product._id} className="p-2 sm:p-4">
              <SmallProduct product={product} />
            </div>
          ))}
        </div>
      </div>
      <div className="lg:w-1/2 w-full mt-10 lg:mt-0 ">
        <ProductCarousel />
      </div>
    </div>
  );
};

export default Header;
