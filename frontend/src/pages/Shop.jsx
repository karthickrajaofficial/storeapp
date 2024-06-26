import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );

  const categoriesQuery = useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");
  const [isCategoryFilterVisible, setIsCategoryFilterVisible] = useState(false);
  const [isPriceFilterVisible, setIsPriceFilterVisible] = useState(false);

  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio,
  });

  const categoryFilterRef = useRef(null);
  const priceFilterRef = useRef(null);

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (!checked.length || !radio.length) {
      if (!filteredProductsQuery.isLoading) {
        const filteredProducts = filteredProductsQuery.data.filter(
          (product) => {
            return (
              product.price.toString().includes(priceFilter) ||
              product.price !== parseInt(priceFilter, 10)
            );
          }
        );
        dispatch(setProducts(filteredProducts));
      }
    }
  }, [checked, radio, filteredProductsQuery.data, dispatch, priceFilter]);

  const handleBrandClick = (brand) => {
    const productsByBrand = filteredProductsQuery.data?.filter(
      (product) => product.brand === brand
    );
    dispatch(setProducts(productsByBrand));
    setIsPriceFilterVisible(false);
  };

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
    setIsCategoryFilterVisible(false);
  };

  const uniqueBrands = [
    ...Array.from(
      new Set(
        filteredProductsQuery.data
          ?.map((product) => product.brand)
          .filter((brand) => brand !== undefined)
      )
    ),
  ];

  const handlePriceChange = (e) => {
    setPriceFilter(e.target.value);
  };

  const handleClickOutside = (event) => {
    if (
      categoryFilterRef.current &&
      !categoryFilterRef.current.contains(event.target)
    ) {
      setIsCategoryFilterVisible(false);
    }
    if (priceFilterRef.current && !priceFilterRef.current.contains(event.target)) {
      setIsPriceFilterVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="container mx-auto mb-20 mt-20">
      <div className="flex flex-col md:flex-row">
        <div className="bg-white text-white p-3 md:ml-5 mt-2 mb-2 pl-20">
          <button
            className="h4 text-center py-2 px-5 bg-pink-500 text-white rounded-full mb-2"
            onClick={() => setIsCategoryFilterVisible(!isCategoryFilterVisible)}
          >
            Filter By Categories
          </button>
          {isCategoryFilterVisible && (
            <div ref={categoryFilterRef} className="p-5 w-[15rem]">
              {categories?.map((c) => (
                <div key={c._id} className="mb-2">
                  <div className="flex items-center mr-4">
                    <input
                      type="checkbox"
                      id={`category-checkbox-${c._id}`}
                      onChange={(e) => handleCheck(e.target.checked, c._id)}
                      className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500 dark:focus:ring-pink-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor={`category-checkbox-${c._id}`}
                      className="ml-2 text-sm font-medium text-black "
                    >
                      {c.name}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="my-2"></div> 

          <button
            className="h4 text-center py-2 px-5 bg-pink-500 text-white rounded-full mb-2"
            onClick={() => setIsPriceFilterVisible(!isPriceFilterVisible)}
          >
            Filter by PriceRange
          </button>
          {isPriceFilterVisible && (
            <div ref={priceFilterRef} className="p-5">
              {uniqueBrands?.map((brand) => (
                <div key={brand} className="flex items-center mr-4 mb-5">
                  <input
                    type="radio"
                    id={brand}
                    name="brand"
                    onChange={() => handleBrandClick(brand)}
                    className="w-4 h-4 text-pink-400 bg-gray-100 border-gray-300 focus:ring-pink-500 dark:focus:ring-pink-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor={brand}
                    className="ml-2 text-sm font-medium text-black"
                  >
                    {brand}
                  </label>
                </div>
              ))}
            </div>
          )}

          <div className="p-5 pt-0">
            <button
              className="w-full border rounded-lg bg-pink-600 text-white py-2 my-4"
              onClick={() => window.location.reload()}
            >
              Reset
            </button>
          </div>
        </div>

        <div className="p-3">
          <div className="flex flex-wrap">
            {products.length === 0 ? (
              <Loader />
            ) : (
              products?.map((p) => (
                <div className="p-3 ml-20" key={p._id}>
                  <ProductCard p={p} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
