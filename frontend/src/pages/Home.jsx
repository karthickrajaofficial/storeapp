import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import { setCategories } from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import Header from "../components/Header";
import CategoryCard from "./CategoryCard";

const Home = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.shop);

  const { data: categoriesData, isLoading, isError } = useFetchCategoriesQuery();

  useEffect(() => {
    if (categoriesData) {
      dispatch(setCategories(categoriesData));
    }
  }, [categoriesData, dispatch]);

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <p className="text-red-500">Error: Failed to fetch data</p>;
  }

  return (
    <>
      <Header />
      <div className="container mx-auto mt-20 mb-10">
        <div className="flex flex-wrap">
          {categories.map((category) => (
            <div className="p-3 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 mb-2" key={category._id}>
              <CategoryCard category={category} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
