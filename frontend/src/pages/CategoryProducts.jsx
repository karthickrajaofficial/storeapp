import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useGetFilteredProductsQuery } from '../redux/api/productApiSlice';
import { setProducts } from '../redux/features/shop/shopSlice';
import Loader from '../components/Loader';
import ProductCard from './Products/ProductCard';

const CategoryProducts = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { products } = useSelector((state) => state.shop);

  const { data: filteredProductsData, isLoading, isError } = useGetFilteredProductsQuery({
    checked: [id],
    radio: [],
  });

  useEffect(() => {
    if (filteredProductsData) {
      dispatch(setProducts(filteredProductsData));
    }
  }, [filteredProductsData, dispatch]);

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <p className="text-red-500">Error: Failed to fetch products</p>;
  }

  return (
    <div className="container mx-auto mt-20 mb-20 px-4">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          products.map((p) => (
            <div key={p._id} className="flex justify-center">
              <ProductCard p={p} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;
