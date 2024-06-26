// CategoryCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/category/${category._id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer max-w-sm mx-auto relative text-black bg-pink-200 rounded-lg shadow-lg transition-shadow duration-300 hover:shadow-2xl"
    >
      {/* <img
        className="w-full rounded-t-lg"
        src={category.image}
        alt={category.name}
        style={{ height: '170px', objectFit: 'cover' }}
      /> */}
      <div className="p-5">
        <h5 className="mb-2 text-xl text-black">{category.name}</h5>
      </div>
    </div>
  );
};

export default CategoryCard;
