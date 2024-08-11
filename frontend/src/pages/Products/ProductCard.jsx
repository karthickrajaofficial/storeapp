import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/features/cart/cartSlice';
import { toast } from 'react-toastify';
import HeartIcon from './HeartIcon';

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success('Item added successfully', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-xs w-full h-full flex flex-col relative overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl group">
      <section className="relative flex-shrink-0 w-full h-48 md:h-56">
        <Link to={`/product/${p._id}`}>
          <img
            className="w-full h-full object-cover rounded-t-lg"
            src={p.image}
            alt={p.name}
            style={{ height: '170px' }}
          />
          <span className="absolute bottom-3 right-3 bg-pink-100 text-pink-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
            {p?.brand}
          </span>
          <HeartIcon product={p} className="absolute top-3 right-3" />
          
          {/* View Details Button */}
          <Link
            to={`/product/${p._id}`}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white font-semibold text-lg rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            View Details
          </Link>
        </Link>
      </section>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between mb-2">
          <h5 className="text-xl font-semibold text-black">{p?.name}</h5>
          <p className="font-semibold text-pink-500">
            {p?.price?.toLocaleString('en-US', {
              style: 'currency',
              currency: 'INR',
            })}
          </p>
        </div>

        <p className="mb-3 text-black">
          {p?.description?.substring(0, 60)}...
        </p>

        <section className="flex justify-between items-center mt-auto">
          <Link
            to={`/product/${p._id}`}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-pink-700 rounded-lg hover:bg-pink-800 focus:ring-4 focus:outline-none focus:ring-pink-300"
          >
            Read More
            <svg
              className="w-3.5 h-3.5 ml-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </Link>

          <button
            className="p-2 rounded-full bg-gray-200 hover:bg-pink-500 transition-colors"
            onClick={() => addToCartHandler(p, 1)}
          >
            <AiOutlineShoppingCart size={25} />
          </button>
        </section>
      </div>
    </div>
  );
};

export default ProductCard;
