import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

const Ratings = ({ value, text, color }) => {
  const fullStars = Math.floor(value);
  const halfStars = value - fullStars > 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStars;

  const starColor = `text-${color}`; 
  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, index) => (
        <FaStar key={index} className={`${starColor} ml-1`} />
      ))}

      {halfStars === 1 && <FaStarHalfAlt className={`${starColor} ml-1`} />}
      
      {[...Array(emptyStars)].map((_, index) => (
        <FaRegStar key={index} className={`${starColor} ml-1`} />
      ))}

      <span className={`rating-text ml-2 ${starColor}`}>{text && text}</span>
    </div>
  );
};

Ratings.defaultProps = {
  color: "pink-600", // Default color for stars
};

export default Ratings;
