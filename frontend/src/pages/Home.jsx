import React from "react";
import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Header from "../components/Header";
import Product from "./Products/Product";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });

  return (
    <>
      {!keyword ? <Header /> : null}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader />
        </div>
      ) : isError ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-red-500">Error: Failed to fetch data</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col lg:flex-row justify-between items-center mt-20 ">
            <h1 className="text-center  lg:text-left lg:ml-[20rem] mt-10 text-3xl lg:text-4xl">
              Special Products
            </h1>

            <Link
              to="/shop"
              className="bg-pink-600 text-white font-bold rounded-full py-2 px-10 mt-10 lg:mt-0 lg:mr-[18rem]"
            >
              Shop
            </Link>
          </div>

          <div>
            <div className="flex justify-center text-bold font-poppins  flex-wrap mb-[2rem] mt-[2rem]">
              {data.products.map((product) => (
                <div key={product._id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2">
                  <Product product={product} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Home;
